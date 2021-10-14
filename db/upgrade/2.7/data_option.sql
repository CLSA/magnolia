DROP PROCEDURE IF EXISTS patch_data_option;
DELIMITER //
CREATE PROCEDURE patch_data_option()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    -- make sure the old reqn_version_data_option triggers no longer exist
    DROP TRIGGER IF EXISTS reqn_version_data_option_AFTER_INSERT;
    DROP TRIGGER IF EXISTS reqn_version_data_option_AFTER_DELETE;

    SELECT "Renaming data_option_category_id to data_category_id in data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "data_option_category_id";

    IF 0 < @test THEN
      ALTER TABLE data_option
        DROP CONSTRAINT fk_data_option_data_option_category_id,
        DROP INDEX fk_data_option_category_id,
        DROP INDEX uq_data_option_category_id_rank;

      ALTER TABLE data_option CHANGE data_option_category_id data_category_id INT(10) UNSIGNED NOT NULL;
      ALTER TABLE data_option
        ADD INDEX fk_data_category_id (data_category_id ASC),
        ADD UNIQUE INDEX uq_data_category_id_rank (data_category_id ASC, rank ASC),
        ADD CONSTRAINT fk_data_option_data_category_id
          FOREIGN KEY (data_category_id)
          REFERENCES data_category (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;
    END IF;
  
    SELECT "Adding new combined_cost column to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "combined_cost";

    IF @test = 0 THEN
      ALTER TABLE data_option ADD COLUMN combined_cost TINYINT(1) NOT NULL DEFAULT 0 AFTER justification;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;
