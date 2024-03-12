DROP PROCEDURE IF EXISTS patch_reqn_type;
DELIMITER //
CREATE PROCEDURE patch_reqn_type()
  BEGIN

    SELECT "Adding description column to reqn_type table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_type"
    AND column_name = "description";

    IF @test = 0 THEN
      ALTER TABLE reqn_type ADD COLUMN description TEXT DEFAULT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_type();
DROP PROCEDURE IF EXISTS patch_reqn_type;

SELECT "Creating new Program of Research reqn type" AS "";

INSERT IGNORE INTO reqn_type SET name = "Program of Research";
