DROP PROCEDURE IF EXISTS patch_pdf_form;
DELIMITER //
CREATE PROCEDURE patch_pdf_form()
  BEGIN

    SELECT "Replacing filename with data column in pdf_form table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "pdf_form"
    AND column_name = "filename";

    IF @test = 1 THEN
      ALTER TABLE pdf_form DROP COLUMN filename;
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "pdf_form"
    AND column_name = "data";

    IF @test = 0 THEN
      ALTER TABLE pdf_form ADD COLUMN data MEDIUMTEXT NOT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_pdf_form();
DROP PROCEDURE IF EXISTS patch_pdf_form;
