DROP PROCEDURE IF EXISTS patch_manuscript_version;
DELIMITER //
CREATE PROCEDURE patch_manuscript_version()
  BEGIN

    SELECT "Altering authors column in manuscript_version table" AS "";

    SELECT column_type = "varchar(45)" INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "manuscript_version"
    AND column_name = "authors";

    IF @test = 1 THEN
      ALTER TABLE manuscript_version MODIFY COLUMN authors varchar(1023) DEFAULT NULL;
    END IF;

    SELECT column_type = "varchar(45)" INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "manuscript_version"
    AND column_name = "journal";

    IF @test = 1 THEN
      ALTER TABLE manuscript_version MODIFY COLUMN journal varchar(511) DEFAULT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_manuscript_version();
DROP PROCEDURE IF EXISTS patch_manuscript_version;
