DROP PROCEDURE IF EXISTS patch_pdf_form;
DELIMITER //
CREATE PROCEDURE patch_pdf_form()
  BEGIN

    SELECT "Adding new filename column to pdf_form table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "pdf_form"
    AND column_name = "filename";

    IF @test = 0 THEN
      ALTER TABLE pdf_form ADD COLUMN filename VARCHAR(255) NOT NULL;
      UPDATE pdf_form
      JOIN pdf_form_type ON pdf_form.pdf_form_type_id = pdf_form_type.id
      SET filename = CONCAT( pdf_form_type.name, " ", date_format( pdf_form.version, "%b%Y" ), ".pdf" );
    END IF;

  END //
DELIMITER ;

CALL patch_pdf_form();
DROP PROCEDURE IF EXISTS patch_pdf_form;
