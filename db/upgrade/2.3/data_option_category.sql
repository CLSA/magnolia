DROP PROCEDURE IF EXISTS patch_data_option_category;
DELIMITER //
CREATE PROCEDURE patch_data_option_category()
  BEGIN

    SET SESSION group_concat_max_len = 1000000;

    SELECT "Removing comprehensive column from data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "comprehensive";

    IF @test THEN
      ALTER TABLE data_option_category DROP COLUMN comprehensive;
    END IF;

    SELECT "Removing tracking column from data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "tracking";

    IF @test THEN
      ALTER TABLE data_option_category DROP COLUMN tracking;
    END IF;

    SELECT "Adding new note_en columns to the data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "note_en";

    IF @test = 0 THEN
      ALTER TABLE data_option_category ADD COLUMN note_en TEXT NULL DEFAULT NULL;

      UPDATE data_option_category
      JOIN (
        SELECT data_option_category.id, REPLACE( GROUP_CONCAT( footnote.note_en order by footnote.id separator "\n" ), "<br>", "\n" ) AS note_en
        FROM data_option_category
        JOIN data_option_category_has_footnote ON data_option_category.id = data_option_category_has_footnote.data_option_category_id
        JOIN footnote ON data_option_category_has_footnote.footnote_id = footnote.id
        GROUP BY data_option_category.id
      ) AS note USING( id )
      SET data_option_category.note_en = note.note_en;
    END IF;

    SELECT "Adding new note_fr columns to the data_option_category table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "note_fr";

    IF @test = 0 THEN
      ALTER TABLE data_option_category ADD COLUMN note_fr TEXT NULL DEFAULT NULL;

      UPDATE data_option_category
      JOIN (
        SELECT data_option_category.id, REPLACE( GROUP_CONCAT( footnote.note_fr order by footnote.id separator "\n" ), "<br>", "\n" ) AS note_fr
        FROM data_option_category
        JOIN data_option_category_has_footnote ON data_option_category.id = data_option_category_has_footnote.data_option_category_id
        JOIN footnote ON data_option_category_has_footnote.footnote_id = footnote.id
        GROUP BY data_option_category.id
      ) AS note USING( id )
      SET data_option_category.note_fr = note.note_fr;
    END IF;

    SELECT "Adding new unique key on name_en column in the data_option_category table" AS "";

    SELECT COLUMN_KEY INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "name_en";

    IF @test != "UNI" THEN
      ALTER TABLE data_option_category ADD UNIQUE KEY uq_name_en (name_en);
    END IF;

    SELECT "Adding new unique key on name_fr column in the data_option_category table" AS "";

    SELECT COLUMN_KEY INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option_category"
    AND column_name = "name_fr";

    IF @test != "UNI" THEN
      ALTER TABLE data_option_category ADD UNIQUE KEY uq_name_fr (name_fr);
    END IF;

  END //
DELIMITER ;

CALL patch_data_option_category();
DROP PROCEDURE IF EXISTS patch_data_option_category;

SELECT "Adding new footnotes to data_option_category records" AS "";

UPDATE data_option_category
SET note_en = "For a detailed list of the linked variables please consult the Linked Data Summary Table available in the Data and Sample Access Documents under the Data Access tab of the CLSA website.",
    note_fr = "Pour obtenir une liste détaillée des variables liées, veuillez consulter le tableau récapitulatif des données liées disponible à la section Documents d’accès aux données et aux échantillons de l’onglet Accès aux données du site Web de l'ÉLCV."
WHERE name_en = "Linked Data";
