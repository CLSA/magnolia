DROP PROCEDURE IF EXISTS patch_pdf_form;
DELIMITER //
CREATE PROCEDURE patch_pdf_form()
  BEGIN

    SELECT "Adding new Co-Applicant Agreement PDF form" AS "";

    SELECT COUNT(*) INTO @test
    FROM pdf_form
    JOIN pdf_form_type ON pdf_form.pdf_form_type_id = pdf_form_type.id
    WHERE pdf_form_type.name = "Co-Applicant Agreement";

    IF @test = 0 THEN
      UPDATE pdf_form
      JOIN pdf_form_type ON pdf_form.pdf_form_type_id = pdf_form_type.id
      SET active = 0
      WHERE pdf_form_type.name = "Co-Applicant Agreement"
      AND version < DATE( NOW() );

      INSERT IGNORE INTO pdf_form( pdf_form_type_id, version, active )
      SELECT pdf_form_type.id, DATE( NOW() ), 1
      FROM pdf_form_type
      WHERE name = "Co-Applicant Agreement";
    END IF;

    SELECT "Adding new Data Checklist PDF form" AS "";

    SELECT COUNT(*) INTO @test
    FROM pdf_form
    JOIN pdf_form_type ON pdf_form.pdf_form_type_id = pdf_form_type.id
    WHERE pdf_form_type.name = "Data Checklist";

    IF @test = 3 THEN
      UPDATE pdf_form
      JOIN pdf_form_type ON pdf_form.pdf_form_type_id = pdf_form_type.id
      SET active = 0
      WHERE pdf_form_type.name = "Data Checklist"
      AND version < DATE( NOW() );

      INSERT IGNORE INTO pdf_form( pdf_form_type_id, version, active )
      SELECT pdf_form_type.id, DATE( NOW() ), 1
      FROM pdf_form_type
      WHERE name = "Data Checklist";
    END IF;

  END //
DELIMITER ;

CALL patch_pdf_form();
DROP PROCEDURE IF EXISTS patch_pdf_form;
