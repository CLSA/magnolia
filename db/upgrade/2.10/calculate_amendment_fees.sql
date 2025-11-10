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

      -- Start with the base cost
      UPDATE reqn
      JOIN stage ON reqn.id = stage.reqn_id
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      JOIN amendment AS first_amendment ON stage.amendment_id = first_amendment.id
      JOIN fee_schedule ON first_amendment.fee_schedule_id = fee_schedule.id
      JOIN amendment ON reqn.id = amendment.reqn_id
      JOIN amendment_current_reqn_version ON amendment.id = amendment_current_reqn_version.amendment_id
      JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
      SET amendment.fee = IF(
        reqn.trainee_user_id IS NOT NULL,
        -- when there is a trainee...
        IF(
          @base_country_id = IFNULL( reqn_version.trainee_country_id, @base_country_id ) AND
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          -- either 0 for waivers, or local price if not
          IF( IFNULL( reqn_version.waiver, "none" ) != "none", 0, fee_schedule.fee_national ),
          5000 -- international price
        ),
        -- when there is no trainee then just check if the applicant is local or international
        IF(
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          fee_schedule.fee_national,
          fee_schedule.fee_international
        )
      )
      WHERE first_amendment.name = ".";

      -- Now add any additional fees
      DROP TABLE IF EXISTS temp_additional_fee;
      CREATE TEMPORARY TABLE temp_additional_fee
      SELECT amendment.id AS amendment_id, SUM(additional_fee_fee_schedule.fee) AS fee
      FROM amendment
      JOIN reqn_has_additional_fee USING (reqn_id)
      JOIN additional_fee ON reqn_has_additional_fee.additional_fee_id = additional_fee.id
      JOIN additional_fee_fee_schedule
        ON additional_fee.id = additional_fee_fee_schedule.additional_fee_id
        AND amendment.fee_schedule_id = additional_fee_fee_schedule.fee_schedule_id
      GROUP BY amendment.id;
      ALTER TABLE temp_additional_fee ADD INDEX dk_amendment_id (amendment_id);

      UPDATE amendment
      JOIN temp_additional_fee ON amendment.id = temp_additional_fee.amendment_id
      SET amendment.fee = amendment.fee + temp_additional_fee.fee;

      -- Next, add the cost of all non-combined data selections
      DROP TABLE IF EXISTS temp_selection_fee;
      CREATE TEMPORARY TABLE temp_selection_fee
      SELECT amendment.id AS amendment_id, SUM(IFNULL(data_selection_fee_schedule.fee,0)) AS fee
      FROM amendment
      JOIN amendment_current_reqn_version ON amendment.id = amendment_current_reqn_version.amendment_id
      JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
      LEFT JOIN reqn_version_has_data_selection
        ON reqn_version.id = reqn_version_has_data_selection.reqn_version_id
        AND reqn_version_has_data_selection.data_selection_id NOT IN (
          SELECT id FROM data_selection WHERE cost_combined
        )
      LEFT JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      LEFT JOIN data_selection_fee_schedule
        ON data_selection.id = data_selection_fee_schedule.data_selection_id
        AND amendment.fee_schedule_id = data_selection_fee_schedule.fee_schedule_id
      WHERE amendment.fee IS NOT NULL
      GROUP BY amendment.id
      ORDER BY amendment.reqn_id, amendment.name;
      ALTER TABLE temp_selection_fee ADD INDEX dk_amendment_id (amendment_id);

      UPDATE amendment
      JOIN temp_selection_fee ON amendment.id = temp_selection_fee.amendment_id
      SET amendment.fee = amendment.fee + temp_selection_fee.fee;

      -- Next, add the cost of all combined data selections
      -- Note: this only works because there is only one data option with combined fees at the time of the upgrade
      DROP TABLE IF EXISTS temp_selection_fee;
      CREATE TEMPORARY TABLE temp_selection_fee
      SELECT amendment.id AS amendment_id, MAX(IFNULL(data_selection_fee_schedule.fee,0)) AS fee
      FROM amendment
      JOIN amendment_current_reqn_version ON amendment.id = amendment_current_reqn_version.amendment_id
      JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
      LEFT JOIN reqn_version_has_data_selection
        ON reqn_version.id = reqn_version_has_data_selection.reqn_version_id
        AND reqn_version_has_data_selection.data_selection_id IN (
          SELECT id FROM data_selection WHERE cost_combined
        )
      LEFT JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      LEFT JOIN data_selection_fee_schedule
        ON data_selection.id = data_selection_fee_schedule.data_selection_id
        AND amendment.fee_schedule_id = data_selection_fee_schedule.fee_schedule_id
      WHERE amendment.fee IS NOT NULL
      GROUP BY amendment.id
      ORDER BY amendment.reqn_id, amendment.name;
      ALTER TABLE temp_selection_fee ADD INDEX dk_amendment_id (amendment_id);

      UPDATE amendment
      JOIN temp_selection_fee ON amendment.id = temp_selection_fee.amendment_id
      SET amendment.fee = amendment.fee + temp_selection_fee.fee;

      -- At this point we've calculated the total fee for each amendment, but we need to convert to how the
      -- amendment changed the fee, so we'll need to subtract the previous amendment's fee from every amendment
      SET @prev_fee = 0;
      CREATE TEMPORARY TABLE temp_amendment
      SELECT
        amendment.id,
        reqn_id,
        name,
        @prev_fee := IF(name=".", 0, @prev_fee) AS prev_fee_check, -- restart prev_fee for each reqn
        fee - @prev_fee AS fee, -- calculate the change in fee, not the total fee
        @prev_fee := fee AS prev_fee -- update the prev_fee for the next amendment
      FROM amendment
      ORDER BY amendment.reqn_id, amendment.name;
      ALTER TABLE temp_amendment ADD INDEX dk_id (id);

      UPDATE amendment
      JOIN temp_amendment USING (id)
      SET amendment.fee = temp_amendment.fee;

      -- Finally, determine which amendments use the amendment type that has a cost
      DROP TABLE IF EXISTS temp_amendment_fee;
      CREATE TEMPORARY TABLE temp_amendment_fee
      SELECT
        amendment.id AS amendment_id,
        SUM(amendment_type_fee_schedule.fee_national) AS fee_national,
        SUM(amendment_type_fee_schedule.fee_international) AS fee_international
      FROM amendment
      JOIN amendment_current_reqn_version ON amendment.id = amendment_current_reqn_version.amendment_id
      JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
      JOIN reqn_version_has_amendment_type ON reqn_version.id = reqn_version_has_amendment_type.reqn_version_id
      JOIN amendment_type ON reqn_version_has_amendment_type.amendment_type_id = amendment_type.id
      JOIN amendment_type_fee_schedule
        ON amendment_type.id = amendment_type_fee_schedule.amendment_type_id
        AND amendment.fee_schedule_id = amendment_type_fee_schedule.fee_schedule_id
      WHERE amendment.name != "."
      GROUP BY amendment.id;
      ALTER TABLE temp_amendment_fee ADD INDEX dk_amendment_id (amendment_id);

      -- Now add the base cost to all non-base amendments
      UPDATE reqn
      JOIN amendment ON reqn.id = amendment.reqn_id
      JOIN temp_amendment_fee ON amendment.id = temp_amendment_fee.amendment_id
      JOIN amendment_current_reqn_version ON amendment.id = amendment_current_reqn_version.amendment_id
      JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
      SET amendment.fee = amendment.fee + IF(
        reqn.trainee_user_id IS NOT NULL,
        -- when there is a trainee...
        IF(
          @base_country_id = IFNULL( reqn_version.trainee_country_id, @base_country_id ) AND
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          IF( IFNULL( reqn_version.waiver, "none" ) != "none", 0, temp_amendment_fee.fee_national ),
          temp_amendment_fee.fee_international
        ),
        -- when there is no trainee then just check if the applicant is local or international
        IF(
          @base_country_id = IFNULL( reqn_version.applicant_country_id, @base_country_id ),
          temp_amendment_fee.fee_national,
          temp_amendment_fee.fee_international
        )
      )
      WHERE amendment.name != ".";

    END IF;

  END //
DELIMITER ;

CALL calculate_amendment_fees();
DROP PROCEDURE IF EXISTS calculate_amendment_fees;

