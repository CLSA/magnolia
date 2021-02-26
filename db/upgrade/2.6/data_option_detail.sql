DROP PROCEDURE IF EXISTS patch_data_option_detail;
DELIMITER //
CREATE PROCEDURE patch_data_option_detail()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding data_option_detail records to new data_options" AS "";

    SET @sql = CONCAT(
      "SELECT cimt.id, dxa.id, ecg.id, retinal.id, spirometry.id, tonometry.id , bl.id, f1.id ",
      "INTO @cimt_id, @dxa_id, @ecg_id, @retinal_id, @spirometry_id, @tonometry_id, @bl_id, @f1_id ",
      "FROM data_option AS cimt, ",
           "data_option AS dxa, ",
           "data_option AS ecg, ",
           "data_option AS retinal, ",
           "data_option AS spirometry, ",
           "data_option AS tonometry, ",
           @cenozo, ".study "
      "JOIN ", @cenozo, ".study_phase bl ON study.id = bl.study_id AND bl.code = 'bl' "
      "JOIN ", @cenozo, ".study_phase f1 ON study.id = f1.study_id AND f1.code = 'f1' ",
      "WHERE cimt.name_en = 'cIMT (Still image / Cineloops)' ",
      "AND dxa.name_en = 'DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)' ",
      "AND ecg.name_en = 'ECG (RAW+ / Images)' ",
      "AND retinal.name_en = 'Retinal Scan (Image)' ",
      "AND spirometry.name_en = 'Spirometry (RAW+ / Images)' ",
      "AND tonometry.name_en = 'Tonometry (Pressure and applination data)'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    INSERT IGNORE INTO data_option_detail( data_option_id, study_phase_id, rank, name_en, name_fr, note_en, note_fr ) VALUES
    ( @cimt_id, @bl_id, 1, "Still image (DICOM)", "TODO: TRANSLATE", NULL, NULL ),
    ( @cimt_id, @f1_id, 1, "Still image (DICOM)", "TODO: TRANSLATE", NULL, NULL ),
    ( @cimt_id, @bl_id, 2, "Cineloops (DICOM)", "TODO: TRANSLATE", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "TODO: TRANSLATE" ),
    ( @cimt_id, @f1_id, 2, "Cineloops (DICOM)", "TODO: TRANSLATE", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "TODO: TRANSLATE" ),
    ( @dxa_id, @bl_id, 1, "Forearm (image - jpg)", "", NULL, NULL ),
    ( @dxa_id, @f1_id, 1, "Forearm (image - jpg)", "", NULL, NULL ),
    ( @dxa_id, @bl_id, 2, "Hip (image - jpg)", "", NULL, NULL ),
    ( @dxa_id, @f1_id, 2, "Hip (image - jpg)", "", NULL, NULL ),
    ( @dxa_id, @bl_id, 3, "Whole Body (image - jpg)", "", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "TODO: TRANSLATE" ),
    ( @dxa_id, @bl_id, 4, "IVA Lateral Spine (DICOM)", "", NULL, NULL ),
    ( @dxa_id, @f1_id, 4, "IVA Lateral Spine (DICOM)", "", NULL, NULL ),
    ( @ecg_id, @bl_id, 1, "Raw+ (ECG Waveforms)", "", NULL, NULL ),
    ( @ecg_id, @f1_id, 1, "Raw+ (ECG Waveforms)", "", NULL, NULL ),
    ( @ecg_id, @bl_id, 2, "Images (ECG Tracing - jpg)", "", NULL, NULL ),
    ( @ecg_id, @f1_id, 2, "Images (ECG Tracing - jpg)", "", NULL, NULL ),
    ( @retinal_id, @bl_id, 1, "Retinal Scan (image - jpg)", "", NULL, NULL ),
    ( @retinal_id, @f1_id, 1, "Retinal Scan (image - jpg)", "", NULL, NULL ),
    ( @spirometry_id, @bl_id, 1, "RAW+ (Flow + Volume curves - text)", "", NULL, NULL ),
    ( @spirometry_id, @f1_id, 1, "RAW+ (Flow + Volume curves - text)", "", NULL, NULL ),
    ( @spirometry_id, @f1_id, 2, "Images (Summary Report - pdf)", "", "Please consult the CLSA Data Availability Table on our website for additional information/conditions if requesting these data.", "TODO: TRANSLATE" ),
    ( @tonometry_id, @bl_id, 1, "Pressure and applanation data", "", NULL, NULL ),
    ( @tonometry_id, @f1_id, 1, "Pressure and applanation data", "", NULL, NULL );

  END //
DELIMITER ;

CALL patch_data_option_detail();
DROP PROCEDURE IF EXISTS patch_data_option_detail;
