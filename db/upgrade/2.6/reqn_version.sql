DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding new agreement_start_date column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_start_date";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_start_date DATE NULL DEFAULT NULL AFTER agreement_filename;
    END IF;

    SELECT "Adding new agreement_end_date column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_end_date";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_end_date DATE NULL DEFAULT NULL AFTER agreement_start_date;
    END IF;

    SET @sql = CONCAT(
      "SELECT study_phase.id INTO @study_phase_id ",
      "FROM ", @cenozo, ".study ",
      "JOIN ", @cenozo, ".study_phase ON study.id = study_phase.study_id ",
      "WHERE study.name = 'CLSA' ",
      "AND study_phase.code = 'bl'"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT "Replacing part2_a_comment column with rows in reqn_ersion_comment" AS "";

    SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 1;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_a_comment";

    IF @test = 1 THEN
      UPDATE reqn_version_comment
      JOIN reqn_version ON reqn_version_comment.reqn_version_id = reqn_version.id
      SET description = part2_a_comment
      WHERE reqn_version_comment.data_option_category_id = @data_option_category_id;

      ALTER TABLE reqn_version DROP COLUMN part2_a_comment;
    END IF;

    SELECT "Replacing part2_b_comment column with rows in reqn_ersion_comment" AS "";

    SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 2;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_b_comment";

    IF @test = 1 THEN
      UPDATE reqn_version_comment
      JOIN reqn_version ON reqn_version_comment.reqn_version_id = reqn_version.id
      SET description = part2_b_comment
      WHERE reqn_version_comment.data_option_category_id = @data_option_category_id;

      ALTER TABLE reqn_version DROP COLUMN part2_b_comment;
    END IF;

    SELECT "Replacing part2_c_comment column with rows in reqn_ersion_comment" AS "";

    SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 3;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_c_comment";

    IF @test = 1 THEN
      UPDATE reqn_version_comment
      JOIN reqn_version ON reqn_version_comment.reqn_version_id = reqn_version.id
      SET description = part2_c_comment
      WHERE reqn_version_comment.data_option_category_id = @data_option_category_id;

      ALTER TABLE reqn_version DROP COLUMN part2_c_comment;
    END IF;

    SELECT "Replacing part2_d_comment column with rows in reqn_ersion_comment" AS "";

    SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 4;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_d_comment";

    IF @test = 1 THEN
      UPDATE reqn_version_comment
      JOIN reqn_version ON reqn_version_comment.reqn_version_id = reqn_version.id
      SET description = part2_d_comment
      WHERE reqn_version_comment.data_option_category_id = @data_option_category_id;

      ALTER TABLE reqn_version DROP COLUMN part2_d_comment;
    END IF;

    SELECT "Replacing cimt column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "cIMT (Still image / Cineloops)";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "cimt";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE cimt_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN cimt;
    END IF;

    SELECT "Replacing cimt_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "cimt_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, cimt_justification
      FROM reqn_version
      WHERE cimt_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN cimt_justification;
    END IF;

    SELECT "Replacing dxa column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option
    WHERE name_en = "DXA (Forearm / Hip / IVA Lateral Spine / AP Lumbar Spine / Whole Body)";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "dxa";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE dxa_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN dxa;
    END IF;

    SELECT "Replacing dxa_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "dxa_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, dxa_justification
      FROM reqn_version
      WHERE dxa_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN dxa_justification;
    END IF;

    SELECT "Replacing ecg column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "ECG (RAW+ / Images)";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "ecg";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE ecg_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN ecg;
    END IF;

    SELECT "Replacing ecg_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "ecg_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, ecg_justification
      FROM reqn_version
      WHERE ecg_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN ecg_justification;
    END IF;

    SELECT "Replacing retinal column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Retinal Scan (Image)";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "retinal";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE retinal_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN retinal;
    END IF;

    SELECT "Replacing retinal_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "retinal_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, retinal_justification
      FROM reqn_version
      WHERE retinal_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN retinal_justification;
    END IF;

    SELECT "Replacing spirometry column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Spirometry (RAW+ / Images)";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "spirometry";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE spirometry_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN spirometry;
    END IF;

    SELECT "Replacing spirometry_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "spirometry_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, spirometry_justification
      FROM reqn_version
      WHERE spirometry_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN spirometry_justification;
    END IF;

    SELECT "Replacing tonometry column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Tonometry (Pressure and applination data)";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "tonometry";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE tonometry_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN tonometry;
    END IF;

    SELECT "Replacing tonometry_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "tonometry_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, tonometry_justification
      FROM reqn_version
      WHERE tonometry_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN tonometry_justification;
    END IF;

    SELECT "Replacing fsa column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "FSA";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "fsa";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE fsa_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN fsa;
    END IF;

    SELECT "Replacing fsa_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "fsa_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, fsa_justification
      FROM reqn_version
      WHERE fsa_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN fsa_justification;
    END IF;

    SELECT "Replacing csd column with rows in reqn_version_data_option" AS "";

    SELECT id INTO @data_option_id FROM data_option WHERE name_en = "CSD";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "csd";

    IF @test = 1 THEN
      INSERT INTO reqn_version_data_option( reqn_version_id, data_option_id, study_phase_id )
      SELECT id, @data_option_id, @study_phase_id
      FROM reqn_version
      WHERE csd_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN csd;
    END IF;

    SELECT "Replacing csd_justification column with rows in new reqn_version_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "csd_justification";

    IF @test = 1 THEN
      INSERT INTO reqn_version_justification( reqn_version_id, data_option_id, description )
      SELECT id, @data_option_id, csd_justification
      FROM reqn_version
      WHERE csd_justification IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN csd_justification;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
