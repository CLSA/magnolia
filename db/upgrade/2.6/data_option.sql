DROP PROCEDURE IF EXISTS patch_data_option;
DELIMITER //
CREATE PROCEDURE patch_data_option()
  BEGIN

    SELECT "Adding new justification column to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "justification";

    IF @test = 0 THEN
      ALTER TABLE data_option
      ADD COLUMN justification TINYINT(1) NOT NULL DEFAULT 0 AFTER rank;
    END IF;

    SELECT "Adding new condition_en and condition_fr columns to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "condition_en";

    IF @test = 0 THEN
      ALTER TABLE data_option
      ADD COLUMN condition_fr TEXT NULL DEFAULT NULL AFTER name_fr,
      ADD COLUMN condition_en TEXT NULL DEFAULT NULL AFTER name_fr;
    END IF;

    SELECT "Adding new Medications data option" AS "";

    SELECT COUNT(*) INTO @test FROM data_option WHERE name_en = "Medications";

    IF @test = 0 THEN
      SELECT data_option_category_id, rank INTO @data_option_category_id, @rank
      FROM data_option WHERE name_en = "Physical Health II";

      UPDATE data_option SET rank = rank + 1
      WHERE data_option_category_id = @data_option_category_id AND rank > @rank
      ORDER BY rank DESC;

      INSERT INTO data_option SET
        data_option_category_id = @data_option_category_id,
        rank = @rank + 1,
        name_en = "Medications",
        name_fr = "TODO: TRANSLATION",
        note_en = "Medications Module (MEDI) includes information on prescription and non-prescription medications used regularly by CLSA Comprehensive Cohort participants. Main variables include: DIN, name, dosage, frequency, start date & duration of use, reason of use.",
        note_fr = "TODO: TRANSLATION";
    END IF;

    SELECT "Adding new data options for additional data, geographic indicators and COVID-19" AS "";

    SELECT ad.id, gi.id, co.id INTO @ad_id, @gi_id, @co_id
    FROM data_option_category ad, data_option_category gi, data_option_category co
    WHERE ad.name_en = "Additional Data"
    AND gi.name_en = "Geographic Indicators"
    AND co.name_en = "COVID-19 Data";

    INSERT IGNORE INTO data_option ( data_option_category_id, rank, justification, name_en, name_fr, note_en, note_fr ) VALUES (
      @ad_id,
      1,
      true,
      "cIMT (Still image / Cineloops)",
      "cIMT (image fixe / Cineloops)",
      "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data",
      "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web."
    ), (
      @ad_id,
      2,
      true,
      "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)",
      "DEXA (avant-bras / hanche / colonne latérale IVA / colonne vertébrale lombaire AP (1er suivi) / corps entier)",
      "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data",
      "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web."
    ), (
      @ad_id, 3, true, "ECG (RAW+ / Images)", "ECG (RAW+ / Images)", NULL, NULL
    ), (
      @ad_id, 4, true, "Retinal Scan (Image)", "Scan rétinien (image)", NULL, NULL
    ), (
      @ad_id,
      5,
      true,
      "Spirometry (RAW+ / Images)",
      "Spirométrie (RAW+ / Images)",
      "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data",
      "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web."
    ), (
      @ad_id, 6, true, "Tonometry (Pressure and applination data)", "Tonométrie (données sur la pression et l’aplanissement)", NULL, NULL
    ), (
      @gi_id, 1, true, "FSA", "RTA", NULL, NULL
    ), (
      @gi_id, 2, true, "CSD", "SDR", NULL, NULL
    ), (
      @co_id, 1, false, "COVID-19 Questionnaire Study Data", "TODO: TRANSLATE", NULL, NULL
    );

  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;
