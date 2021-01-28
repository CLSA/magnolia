DROP PROCEDURE IF EXISTS patch_production;
DELIMITER //
CREATE PROCEDURE patch_production()
  BEGIN

    SELECT "Renaming production_type_id column to output_type_id in production table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "production"
    AND column_name = "production_type_id";

    IF @test = 1 THEN
      ALTER TABLE production
      DROP CONSTRAINT fk_production_type_id1,
      DROP INDEX fk_production_type_id,
      CHANGE COLUMN production_type_id output_type_id INT(10) unsigned NOT NULL;

      ALTER TABLE production
      ADD INDEX fk_output_type_id (output_type_id ASC),
      ADD CONSTRAINT fk_output_output_type_id
        FOREIGN KEY (output_type_id)
        REFERENCES output_type (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
    END IF;

    SELECT "Renaming production table to output" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "production";

    IF @test = 1 THEN
      RENAME TABLE production TO output;
    END IF;

  END //
DELIMITER ;

CALL patch_production();
DROP PROCEDURE IF EXISTS patch_production;
