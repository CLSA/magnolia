DROP PROCEDURE IF EXISTS calculate_amendment_fees;
DELIMITER //
CREATE PROCEDURE calculate_amendment_fees()
  BEGIN

    -- only proceed if this hasn't already been done
    SELECT COUNT(*) INTO @test FROM amendment WHERE fee IS NOT NULL OR override_fee IS NOT NULL;
    IF @test = 0 THEN

      -- determine the @cenozo database name
      SET @cenozo = (
        SELECT unique_constraint_schema
        FROM information_schema.referential_constraints
        WHERE constraint_schema = DATABASE()
        AND constraint_name = "fk_access_site_id"
      );

      -- determine the application's country id
      SET @sql = CONCAT(
        "SELECT country_id INTO @base_country_id ",
        "FROM ", @cenozo, ".application ",
        "WHERE name = 'magnolia'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      -- Determine the override fee for all amendments based on the reqn override_price and fee waivers
      UPDATE reqn
      JOIN amendment ON reqn.id = amendment.reqn_id
      SET amendment.override_fee = IF(
        -- If the price is overridden then set the base "." amendment's override_fee to that value and all other
        -- amendments to 0 (since we don't know what the override fee for each individual amendment is in)
        reqn.override_price IS NOT NULL,
        IF( amendment.name = ".", reqn.override_price, 0 ),
        -- otherwise set the override_fee to 0 since the reqn used a fee-waiver
        0
      )
      WHERE reqn.override_price IS NOT NULL
      OR reqn.special_fee_waiver_id IS NOT NULL;

      -- Now determine the fee for all reqns which are not in the "new" phase

      -- Start with the base cost for all base "." amendments
      UPDATE reqn
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      JOIN amendment ON reqn.id = amendment.reqn_id
      JOIN reqn_version ON amendment.id = reqn_version.amendment_id
      AND version <=> (
        SELECT MAX(version)
        FROM reqn_version
        WHERE reqn_version.amendment_id = amendment.id
        GROUP BY reqn_version.reqn_id
        LIMIT 1
      )
      SET amendment.fee = IF(
        reqn.trainee_user_id IS NOT NULL,
        -- when there is a trainee...
        IF(
          @base_country_id = IFNULL( reqn_version.trainee_country_id, @base_country_id ) AND
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          -- either 0 for waivers, or local price if not
          IF( IFNULL( reqn_version.waiver, "none" ) != "none", 0, 3000 ),
          5000 -- international price
        ),
        -- when there is no trainee then just check if the applicant is local or international
        IF( @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ), 3000, 5000 )
      )
      WHERE stage_type.phase != "new"
      AND amendment.name = ".";

      -- Now add any additional fees (base amendment only)
      CREATE TEMPORARY TABLE additional_fee
      SELECT amendment.id AS amendment_id, SUM(additional_fee.fee) AS fee
      FROM amendment
      JOIN reqn_has_additional_fee USING (reqn_id)
      JOIN additional_fee ON reqn_has_additional_fee.additional_fee_id = additional_fee.id
      WHERE amendment.name = "."
      GROUP BY amendment.id;
      ALTER TABLE additional_fee ADD INDEX dk_amendment_id (amendment_id);

      UPDATE amendment
      JOIN additional_fee ON amendment.id = additional_fee.amendment_id
      SET amendment.fee = amendment.fee + additional_fee.fee;

      -- Now determine which amendments use the amendment type that has a cost
      -- Since there is only one such amendment type at the time of the upgrade we can simply refer to this one type
      CREATE TEMPORARY TABLE amendment_fee
      SELECT
        amendment.id AS amendment_id,
        IFNULL( amendment_type.fee_canada, 0 ) AS fee_canada,
        IFNULL( amendment_type.fee_international, 0 ) AS fee_international
      FROM amendment
      JOIN reqn_version ON amendment.id = reqn_version.amendment_id AND version <=> (
        SELECT MAX(version)
        FROM reqn_version
        WHERE reqn_version.amendment_id = amendment.id
        GROUP BY reqn_version.reqn_id
        LIMIT 1
      )
      JOIN reqn_version_has_amendment_type ON reqn_version.id = reqn_version_has_amendment_type.reqn_version_id
      JOIN amendment_type
        ON reqn_version_has_amendment_type.amendment_type_id = amendment_type.id
        AND amendment_type.fee_canada > 0
      WHERE amendment.name != ".";
      ALTER TABLE amendment_fee ADD INDEX dk_amendment_id (amendment_id);

      -- Now determine the base cost for all non-base amendments
      UPDATE reqn
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      JOIN amendment ON reqn.id = amendment.reqn_id
      LEFT JOIN amendment_fee ON amendment.id = amendment_fee.amendment_id
      JOIN reqn_version ON amendment.id = reqn_version.amendment_id AND version <=> (
        SELECT MAX(version)
        FROM reqn_version
        WHERE reqn_version.amendment_id = amendment.id
        GROUP BY reqn_version.reqn_id
        LIMIT 1
      )
      SET amendment.fee = IF(
        reqn.trainee_user_id IS NOT NULL,
        -- when there is a trainee...
        IF(
          @base_country_id = IFNULL( reqn_version.trainee_country_id, @base_country_id ) AND
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          IF( IFNULL( reqn_version.waiver, "none" ) != "none", 0, IFNULL( amendment_fee.fee_canada, 0 ) ),
          IFNULL( amendment_fee.fee_international, 0 )
        ),
        -- when there is no trainee then just check if the applicant is local or international
        IF(
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          IFNULL( amendment_fee.fee_canada, 0 ),
          IFNULL( amendment_fee.fee_international, 0 )
        )
      )
      WHERE stage_type.phase != "new"
      AND amendment.name != ".";

      -- Finally, add the cost of all data selections

      -- Get the total non-combined selection cost for all amendments
      CREATE TEMPORARY TABLE selection_fee_total
      SELECT
        amendment.id AS amendment_id,
        amendment.reqn_id,
        amendment.name,
        SUM(IFNULL(data_selection.cost,0)) AS cost,
        GROUP_CONCAT(data_selection.id)
      FROM amendment
      JOIN reqn_version ON amendment.id = reqn_version.amendment_id AND version <=> (
        SELECT MAX(version)
        FROM reqn_version
        WHERE reqn_version.amendment_id = amendment.id
        GROUP BY reqn_version.reqn_id
        LIMIT 1
      )
      LEFT JOIN reqn_version_has_data_selection
        ON reqn_version.id = reqn_version_has_data_selection.reqn_version_id
        AND reqn_version_has_data_selection.data_selection_id NOT IN (
          SELECT id FROM data_selection WHERE cost_combined
        )
      LEFT JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      GROUP BY amendment.id
      ORDER BY amendment.reqn_id, amendment.name;
      ALTER TABLE selection_fee_total ADD INDEX dk_amendment_id (amendment_id);

      -- Now find the change in selection cost across amendments
      SET @prev_cost = 0;
      CREATE TEMPORARY TABLE selection_fee_change
      SELECT
        amendment_id,
        @prev_cost := IF(name=".", 0, @prev_cost) AS prev_cost_check, -- start prev_cost to 0 when new amendment
        cost - @prev_cost AS cost, -- calculate the change in cost, not the total cost
        @prev_cost := cost AS prev_cost -- update the prev_cost for the next amendment
      FROM selection_fee_total;
      ALTER TABLE selection_fee_change ADD INDEX dk_amendment_id (amendment_id);

      UPDATE amendment
      JOIN selection_fee_change ON amendment.id = selection_fee_change.amendment_id
      SET amendment.fee = amendment.fee + selection_fee_change.cost;

      DROP TABLE selection_fee_total;
      DROP TABLE selection_fee_change;

      -- Get the total combined selection cost for all amendments
      -- Note: this only works because there is only one data option with combined fees at the time of the upgrade
      CREATE TEMPORARY TABLE selection_fee_total
      SELECT
        amendment.id AS amendment_id,
        amendment.reqn_id,
        amendment.name,
        MAX(IFNULL(data_selection.cost,0)) AS cost,
        GROUP_CONCAT(data_selection.id)
      FROM amendment
      JOIN reqn_version ON amendment.id = reqn_version.amendment_id AND version <=> (
        SELECT MAX(version)
        FROM reqn_version
        WHERE reqn_version.amendment_id = amendment.id
        GROUP BY reqn_version.reqn_id
        LIMIT 1
      )
      LEFT JOIN reqn_version_has_data_selection
        ON reqn_version.id = reqn_version_has_data_selection.reqn_version_id
        AND reqn_version_has_data_selection.data_selection_id IN (
          SELECT id FROM data_selection WHERE cost_combined
        )
      LEFT JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      GROUP BY amendment.id
      ORDER BY amendment.reqn_id, amendment.name;
      ALTER TABLE selection_fee_total ADD INDEX dk_amendment_id (amendment_id);

      -- Now find the change in selection cost across amendments
      SET @prev_cost = 0;
      CREATE TEMPORARY TABLE selection_fee_change
      SELECT
        amendment_id,
        @prev_cost := IF(name=".", 0, @prev_cost) AS prev_cost_check, -- start prev_cost to 0 when new amendment
        cost - @prev_cost AS cost, -- calculate the change in cost, not the total cost
        @prev_cost := cost AS prev_cost -- update the prev_cost for the next amendment
      FROM selection_fee_total;
      ALTER TABLE selection_fee_change ADD INDEX dk_amendment_id (amendment_id);

      UPDATE amendment
      JOIN selection_fee_change ON amendment.id = selection_fee_change.amendment_id
      SET amendment.fee = amendment.fee + selection_fee_change.cost;

      DROP TABLE selection_fee_total;
      DROP TABLE selection_fee_change;

    END IF;

  END //
DELIMITER ;

CALL calculate_amendment_fees();
DROP PROCEDURE IF EXISTS calculate_amendment_fees;

