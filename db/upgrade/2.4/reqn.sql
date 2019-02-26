DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Removing reqn.applicant_name column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "applicant_name";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN applicant_name;
    END IF;

    SELECT "Removing reqn.applicant_position column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "applicant_position";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN applicant_position;
    END IF;

    SELECT "Removing reqn.applicant_affiliation column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "applicant_affiliation";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN applicant_affiliation;
    END IF;

    SELECT "Removing reqn.applicant_address column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "applicant_address";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN applicant_address;
    END IF;

    SELECT "Removing reqn.applicant_phone column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "applicant_phone";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN applicant_phone;
    END IF;

    SELECT "Removing reqn.applicant_email column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "applicant_email";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN applicant_email;
    END IF;

    SELECT "Removing reqn.graduate_name column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_name";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN graduate_name;
    END IF;

    SELECT "Removing reqn.graduate_program column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_program";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN graduate_program;
    END IF;

    SELECT "Removing reqn.graduate_institution column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_institution";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN graduate_institution;
    END IF;

    SELECT "Removing reqn.graduate_address column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_address";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN graduate_address;
    END IF;

    SELECT "Removing reqn.graduate_phone column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_phone";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN graduate_phone;
    END IF;

    SELECT "Removing reqn.graduate_email column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_email";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN graduate_email;
    END IF;

    SELECT "Removing reqn.start_date column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "start_date";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN start_date;
    END IF;

    SELECT "Removing reqn.duration column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "duration";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN duration;
    END IF;

    SELECT "Removing reqn.title column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "title";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN title;
    END IF;

    SELECT "Removing reqn.keywords column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "keywords";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN keywords;
    END IF;

    SELECT "Removing reqn.lay_summary column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "lay_summary";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN lay_summary;
    END IF;

    SELECT "Removing reqn.background column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "background";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN background;
    END IF;

    SELECT "Removing reqn.objectives column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "objectives";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN objectives;
    END IF;

    SELECT "Removing reqn.methodology column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "methodology";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN methodology;
    END IF;

    SELECT "Removing reqn.analysis column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "analysis";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN analysis;
    END IF;

    SELECT "Removing reqn.funding column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "funding";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN funding;
    END IF;

    SELECT "Removing reqn.funding_filename column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "funding_filename";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN funding_filename;
    END IF;

    SELECT "Removing reqn.funding_agency column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "funding_agency";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN funding_agency;
    END IF;

    SELECT "Removing reqn.grant_number column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "grant_number";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN grant_number;
    END IF;

    SELECT "Removing reqn.ethics column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "ethics";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN ethics;
    END IF;

    SELECT "Removing reqn.ethics_date column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "ethics_date";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN ethics_date;
    END IF;

    SELECT "Removing reqn.ethics_filename column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "ethics_filename";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN ethics_filename;
    END IF;

    SELECT "Removing reqn.waiver column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "waiver";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN waiver;
    END IF;

    SELECT "Removing reqn.comprehensive column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "comprehensive";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN comprehensive;
    END IF;

    SELECT "Removing reqn.tracking column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "tracking";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN tracking;
    END IF;

    SELECT "Removing reqn.part2_a_comment column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "part2_a_comment";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN part2_a_comment;
    END IF;

    SELECT "Removing reqn.part2_b_comment column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "part2_b_comment";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN part2_b_comment;
    END IF;

    SELECT "Removing reqn.part2_c_comment column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "part2_c_comment";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN part2_c_comment;
    END IF;

    SELECT "Removing reqn.part2_d_comment column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "part2_d_comment";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN part2_d_comment;
    END IF;

    SELECT "Removing reqn.part2_e_comment column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "part2_e_comment";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN part2_e_comment;
    END IF;

    SELECT "Removing reqn.part2_f_comment column" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "part2_f_comment";

    IF @test THEN
      ALTER TABLE reqn DROP COLUMN part2_f_comment;
    END IF;

    SELECT "Renaming deferral_note_part1_a1 column to deferral_note_1a in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part1_a1";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part1_a1 deferral_note_1a text;
    END IF;

    SELECT "Renaming deferral_note_part1_a2 column to deferral_note_1b in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part1_a2";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part1_a2 deferral_note_1b text;
    END IF;

    SELECT "Renaming deferral_note_part1_a3 column to deferral_note_1c in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part1_a3";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part1_a3 deferral_note_1c text;
    END IF;

    SELECT "Renaming deferral_note_part1_a4 column to deferral_note_1d in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part1_a4";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part1_a4 deferral_note_1d text;
    END IF;

    SELECT "Renaming deferral_note_part1_a5 column to deferral_note_1e in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part1_a5";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part1_a5 deferral_note_1e text;
    END IF;

    SELECT "Renaming deferral_note_part1_a6 column to deferral_note_1f in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part1_a6";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part1_a6 deferral_note_1f text;
    END IF;

    SELECT "Renaming deferral_note_part2_a column to deferral_note_2a in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part2_a";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part2_a deferral_note_2a text;
    END IF;

    SELECT "Renaming deferral_note_part2_b column to deferral_note_2b in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part2_b";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part2_b deferral_note_2b text;
    END IF;

    SELECT "Renaming deferral_note_part2_c column to deferral_note_2c in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part2_c";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part2_c deferral_note_2c text;
    END IF;

    SELECT "Renaming deferral_note_part2_d column to deferral_note_2d in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part2_d";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part2_d deferral_note_2d text;
    END IF;

    SELECT "Renaming deferral_note_part2_e column to deferral_note_2e in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part2_e";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part2_e deferral_note_2e text;
    END IF;

    SELECT "Renaming deferral_note_part2_f column to deferral_note_2f in reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_part2_f";

    IF @test THEN
      ALTER TABLE reqn CHANGE deferral_note_part2_f deferral_note_2f text;
    END IF;

    SELECT "Adding new graduate_id column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "graduate_id";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN graduate_id INT UNSIGNED NULL DEFAULT NULL AFTER user_id,
      ADD INDEX fk_graduate_id (graduate_id ASC),
      ADD CONSTRAINT fk_graduate_id
          FOREIGN KEY (graduate_id)
          REFERENCES graduate (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;
    END IF;

    SELECT "Adding new note column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "note";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN note TEXT NULL DEFAULT NULL;
    END IF;

    SELECT "Adding new reqn_type_id column to reqn table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "reqn_type_id";

    IF @test = 0 THEN
      ALTER TABLE reqn
      ADD COLUMN reqn_type_id INT UNSIGNED NOT NULL AFTER create_timestamp;

      UPDATE reqn SET reqn_type_id = ( SELECT id FROM reqn_type WHERE name = "Standard" );

      ALTER TABLE reqn
      ADD INDEX fk_reqn_type_id (reqn_type_id ASC),
      ADD CONSTRAINT fk_reqn_type_id
          FOREIGN KEY (reqn_type_id)
          REFERENCES reqn_type (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
