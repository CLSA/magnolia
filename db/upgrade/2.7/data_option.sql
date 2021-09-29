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

    SELECT "Adding new data-options" AS "";

    SELECT COUNT(*) INTO @test FROM data_option WHERE name_en = "cIMT Still image";

    IF @test = 0 THEN

      SELECT id INTO @data_option_category_id FROM data_option_category WHERE name_en = "Additional Data";

      -- move all existing data options' ranks out of the way
      UPDATE data_option SET rank = rank + 100 WHERE data_option_category_id = @data_option_category_id;

      -- create the new data options
      INSERT INTO data_option( data_option_category_id, rank, justification, name_en, name_fr, note_en, note_fr ) VALUES
      ( @data_option_category_id, 1, 1, "cIMT Still image", "cIMT Image fixe", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),
      ( @data_option_category_id, 2, 1, "cIMT Cineloops", "cIMT animations en boucle", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),

      ( @data_option_category_id, 3, 1, "DXA Forearm", "DEXA avant-bras", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),
      ( @data_option_category_id, 4, 1, "DXA Hip", "DEXA hanche", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),
      ( @data_option_category_id, 5, 1, "DXA Whole Body", "DEXA corps entier", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),
      ( @data_option_category_id, 6, 1, "DXA IVA Lateral Spine", "DEXA colonne latérale IVA", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),

      ( @data_option_category_id, 7, 1, "ECG RAW+", "ECG RAW+", NULL, NULL ),
      ( @data_option_category_id, 8, 1, "ECG Images", "ECG images", NULL, NULL ),

      ( @data_option_category_id, 10, 1, "Spirometry RAW+", "Spirométrie RAW+", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." ),
      ( @data_option_category_id, 11, 1, "Spirometry Images", "Spirométrie images", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "Vous trouverez des informations supplémentaires et les conditions associées à la demande de ces données dans le tableau de disponibilité des données de l’ÉLCV sur notre site Web." );

      -- move back the data options that we're going to keep
      UPDATE data_option SET rank = 9 WHERE name_en = "Retinal Scan (Image)";
      UPDATE data_option SET rank = 12 WHERE name_en = "Tonometry (Pressure and applination data)";
      UPDATE data_option SET rank = 13 WHERE name_en = "Cognition (Raw data)";

      -- set the new data_option_detail data
      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Still image (DICOM)', 'Image fixe (DICOM)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'cIMT Still image' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Cineloops (DICOM)', 'Animations en boucle (DICOM)', 'Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.', 'Veuillez consulter le tableau de disponibilité des données de l’ÉLCV sur notre site Web pour obtenir des informations supplémentaires et connaître les conditions pour demander ces données.' ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'cIMT Cineloops' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Forearm (image - jpg)', 'Avant-bras (image - jpg)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'DXA Forearm' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Hip (image - jpg)', 'Hanche (image - jpg)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'DXA Hip' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Whole Body (image - jpg)', 'Corps entier (image - jpg)', 'Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.', 'Veuillez consulter le tableau de disponibilité des données de l’ÉLCV sur notre site Web pour obtenir des informations supplémentaires et connaître les conditions pour demander ces données.' ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'DXA Whole Body' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code = 'bl'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'IVA Lateral Spine (DICOM)', 'Colonne latérale IVA (DICOM)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'DXA IVA Lateral Spine' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Raw+ (ECG Waveforms)', 'Raw (courbes de l’ECG)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'ECG RAW+' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Images (ECG Tracing - jpg)', 'Images (tracé de l’ECG - jpg)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'ECG Images' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'RAW+ (Flow + Volume curves - text)', 'RAW (Courbes débit-volume - texte)', NULL, NULL ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'Spirometry RAW+' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) ",
        "SELECT data_option.id, study_phase.id, 1, 'Images (Summary Report - pdf)', 'Images (Rapport sommaire - pdf)', 'Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.', 'Veuillez consulter le tableau de disponibilité des données de l’ÉLCV sur notre site Web pour obtenir des informations supplémentaires et connaître les conditions pour demander ces données.' ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'Spirometry Images' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code = 'f1'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      -- set the new data_option_has_study_phase data
      SET @sql = CONCAT(
        "INSERT INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
        "SELECT data_option.id, study_phase.id ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en IN( ",
          "'cIMT Still image', 'cIMT Cineloops', 'DXA Forearm', 'DXA Hip', ",
          "'DXA IVA Lateral Spine', 'ECG RAW+', 'ECG Images', 'Spirometry RAW+' ",
        ") ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code IN ( 'bl', 'f1' )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
        "SELECT data_option.id, study_phase.id ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'DXA Whole Body' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code = 'bl'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "INSERT INTO data_option_has_study_phase( data_option_id, study_phase_id ) ",
        "SELECT data_option.id, study_phase.id ",
        "FROM data_option, ", @cenozo, ".study ",
        "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
        "WHERE data_option.name_en = 'Spirometry Images' ",
        "AND study.name = 'CLSA' ",
        "AND study_phase.code ='f1'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

    -- fill in which reqn versions have selected the new data options
    CREATE TEMPORARY TABLE new_reqn_version_data_option
    SELECT reqn_version_id, new_data_option.id AS data_option_id, reqn_version_data_option.study_phase_id
    FROM data_option AS new_data_option
    JOIN data_option_has_study_phase ON new_data_option.id = data_option_has_study_phase.data_option_id
    JOIN reqn_version_data_option ON data_option_has_study_phase.study_phase_id = reqn_version_data_option.study_phase_id
    JOIN data_option ON reqn_version_data_option.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "cIMT Still image", "cIMT Cineloops" )
    AND data_option.name_en = "cIMT (Still image / Cineloops)";

    INSERT INTO new_reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
    SELECT reqn_version_id, new_data_option.id, reqn_version_data_option.study_phase_id
    FROM data_option AS new_data_option
    JOIN data_option_has_study_phase ON new_data_option.id = data_option_has_study_phase.data_option_id
    JOIN reqn_version_data_option ON data_option_has_study_phase.study_phase_id = reqn_version_data_option.study_phase_id
    JOIN data_option ON reqn_version_data_option.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "DXA Forearm", "DXA Hip", "DXA Whole Body", "DXA IVA Lateral Spine" )
    AND data_option.name_en = "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)";

    INSERT INTO new_reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
    SELECT reqn_version_id, new_data_option.id, reqn_version_data_option.study_phase_id
    FROM data_option AS new_data_option
    JOIN data_option_has_study_phase ON new_data_option.id = data_option_has_study_phase.data_option_id
    JOIN reqn_version_data_option ON data_option_has_study_phase.study_phase_id = reqn_version_data_option.study_phase_id
    JOIN data_option ON reqn_version_data_option.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "ECG RAW+", "ECG Images" )
    AND data_option.name_en = "ECG (RAW+ / Images)";

    INSERT INTO new_reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
    SELECT reqn_version_id, new_data_option.id, reqn_version_data_option.study_phase_id
    FROM data_option AS new_data_option
    JOIN data_option_has_study_phase ON new_data_option.id = data_option_has_study_phase.data_option_id
    JOIN reqn_version_data_option ON data_option_has_study_phase.study_phase_id = reqn_version_data_option.study_phase_id
    JOIN data_option ON reqn_version_data_option.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "Spirometry RAW+", "Spirometry Images" )
    AND data_option.name_en = "Spirometry (RAW+ / Images)";

    INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
    SELECT * FROM new_reqn_version_data_option;

    -- fill in the new data_option_justification data
    CREATE TEMPORARY TABLE new_data_option_justification
    SELECT reqn_version_id, new_data_option.id AS data_option_id, description
    FROM data_option AS new_data_option, data_option_justification
    JOIN data_option ON data_option_justification.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "cIMT Still image", "cIMT Cineloops" )
    AND data_option.name_en = "cIMT (Still image / Cineloops)";

    INSERT INTO new_data_option_justification
    SELECT reqn_version_id, new_data_option.id, description
    FROM data_option AS new_data_option, data_option_justification
    JOIN data_option ON data_option_justification.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "DXA Forearm", "DXA Hip", "DXA Whole Body", "DXA IVA Lateral Spine" )
    AND data_option.name_en = "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)";

    INSERT INTO new_data_option_justification
    SELECT reqn_version_id, new_data_option.id, description
    FROM data_option AS new_data_option, data_option_justification
    JOIN data_option ON data_option_justification.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "ECG RAW+", "ECG Images" )
    AND data_option.name_en = "ECG (RAW+ / Images)";

    INSERT INTO new_data_option_justification
    SELECT reqn_version_id, new_data_option.id, description
    FROM data_option AS new_data_option, data_option_justification
    JOIN data_option ON data_option_justification.data_option_id = data_option.id
    WHERE new_data_option.name_en IN ( "Spirometry RAW+", "Spirometry Images" )
    AND data_option.name_en = "Spirometry (RAW+ / Images)";

    UPDATE data_option_justification
    JOIN new_data_option_justification USING( reqn_version_id, data_option_id )
    SET data_option_justification.description = new_data_option_justification.description;

    -- clean up by deleting defunct data options and their sub-data
    DELETE FROM data_option_justification
    WHERE data_option_id IN ( SELECT id FROM data_option WHERE name_en IN (
      "cIMT (Still image / Cineloops)",
      "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)",
      "ECG (RAW+ / Images)",
      "Spirometry (RAW+ / Images)"
    ) );

    DELETE FROM reqn_version_data_option
    WHERE data_option_id IN ( SELECT id FROM data_option WHERE name_en IN (
      "cIMT (Still image / Cineloops)",
      "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)",
      "ECG (RAW+ / Images)",
      "Spirometry (RAW+ / Images)"
    ) );

    DELETE FROM data_option_has_study_phase
    WHERE data_option_id IN ( SELECT id FROM data_option WHERE name_en IN (
      "cIMT (Still image / Cineloops)",
      "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)",
      "ECG (RAW+ / Images)",
      "Spirometry (RAW+ / Images)"
    ) );

    DELETE FROM data_option_detail
    WHERE data_option_id IN ( SELECT id FROM data_option WHERE name_en IN (
      "cIMT (Still image / Cineloops)",
      "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)",
      "ECG (RAW+ / Images)",
      "Spirometry (RAW+ / Images)"
    ) );

    DELETE FROM data_option
    WHERE name_en IN (
      "cIMT (Still image / Cineloops)",
      "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)",
      "ECG (RAW+ / Images)",
      "Spirometry (RAW+ / Images)"
    );

    SELECT "Adding new cost column to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "cost";

    IF @test = 0 THEN
      ALTER TABLE data_option ADD COLUMN cost INT(10) UNSIGNED NOT NULL DEFAULT 0 AFTER justification;

      UPDATE data_option SET cost = 500 WHERE name_en IN(
        "cIMT Still image", "DXA Forearm", "DXA Hip", "DXA Whole Body", "DXA IVA Lateral Spine",
        "ECG RAW+", "ECG Images", "Retinal Scan (Image)", "Spirometry RAW+", "Spirometry Images" 
      );
      UPDATE data_option SET cost = 3000 WHERE name_en = "cIMT Cineloops";
    END IF;

    SELECT "Adding new combined_cost column to data_option table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "data_option"
    AND column_name = "combined_cost";

    IF @test = 0 THEN
      ALTER TABLE data_option ADD COLUMN combined_cost TINYINT(1) NOT NULL DEFAULT 0 AFTER cost;

      UPDATE data_option SET combined_cost = 1 WHERE name_en = "cIMT Cineloops";
    END IF;

  END //
DELIMITER ;

CALL patch_data_option();
DROP PROCEDURE IF EXISTS patch_data_option;
