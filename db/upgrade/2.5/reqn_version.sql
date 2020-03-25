DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Renaming graduate_program column to trainee_program in reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "graduate_program";

    IF @test = 1 THEN
      ALTER TABLE reqn_version CHANGE graduate_program trainee_program VARCHAR(255) NULL DEFAULT NULL;
    END IF;

    SELECT "Renaming graduate_institution column to trainee_institution in reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "graduate_institution";

    IF @test = 1 THEN
      ALTER TABLE reqn_version CHANGE graduate_institution trainee_institution VARCHAR(255) NULL DEFAULT NULL;
    END IF;

    SELECT "Renaming graduate_address column to trainee_address in reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "graduate_address";

    IF @test = 1 THEN
      ALTER TABLE reqn_version CHANGE graduate_address trainee_address VARCHAR(511) NULL DEFAULT NULL;
    END IF;

    SELECT "Renaming graduate_phone column to trainee_phone in reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "graduate_phone";

    IF @test = 1 THEN
      ALTER TABLE reqn_version CHANGE graduate_phone trainee_phone VARCHAR(45) NULL DEFAULT NULL;
    END IF;

    SELECT "Adding new coapplicant_agreement_filename column to reqn_version table" AS "";
    
    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "coapplicant_agreement_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version
      ADD COLUMN coapplicant_agreement_filename VARCHAR(255) NULL DEFAULT NULL
      AFTER trainee_phone;
    END IF;

    SELECT "Replacing part2_e_comment with individual columns in reqn_version table" AS "";
    
    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_e_comment";

    IF @test = 1 THEN
      ALTER TABLE reqn_version
      ADD COLUMN cimt TINYINT(1) NOT NULL DEFAULT 0 AFTER part2_d_comment,
      ADD COLUMN cimt_justification TEXT NULL DEFAULT NULL AFTER cimt,
      ADD COLUMN dxa TINYINT(1) NOT NULL DEFAULT 0 AFTER cimt_justification,
      ADD COLUMN dxa_justification TEXT NULL DEFAULT NULL AFTER dxa,
      ADD COLUMN ecg TINYINT(1) NOT NULL DEFAULT 0 AFTER dxa_justification,
      ADD COLUMN ecg_justification TEXT NULL DEFAULT NULL AFTER ecg,
      ADD COLUMN retinal TINYINT(1) NOT NULL DEFAULT 0 AFTER ecg_justification,
      ADD COLUMN retinal_justification TEXT NULL DEFAULT NULL AFTER retinal,
      ADD COLUMN spirometry TINYINT(1) NOT NULL DEFAULT 0 AFTER retinal_justification,
      ADD COLUMN spirometry_justification TEXT NULL DEFAULT NULL AFTER spirometry,
      ADD COLUMN tonometry TINYINT(1) NOT NULL DEFAULT 0 AFTER spirometry_justification,
      ADD COLUMN tonometry_justification TEXT NULL DEFAULT NULL AFTER tonometry,
      ADD COLUMN fsa TINYINT(1) NOT NULL DEFAULT 0 AFTER tonometry_justification,
      ADD COLUMN fsa_justification TEXT NULL DEFAULT NULL AFTER fsa,
      ADD COLUMN csd TINYINT(1) NOT NULL DEFAULT 0 AFTER fsa_justification,
      ADD COLUMN csd_justification TEXT NULL DEFAULT NULL AFTER csd;

      SELECT "Moving all part2e comments to the cimt justification" AS "";

      UPDATE reqn_version SET cimt = 1, cimt_justification = part2_e_comment WHERE part2_e_comment IS NOT NULL;

      ALTER TABLE reqn_version DROP COLUMN part2_e_comment;
    END IF;

    SELECT "Adding new 'exempt' option to ethics column in reqn_version table" AS "";

    SELECT data_type INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "ethics";

    IF @test != "enum" THEN
      CREATE TEMPORARY TABLE reqn_version_cache
      SELECT id, ethics
      FROM reqn_version;
      
      UPDATE reqn_version SET ethics = NULL;

      ALTER TABLE reqn_version
      MODIFY COLUMN ethics ENUM('yes', 'no', 'exempt') NULL DEFAULT NULL;

      UPDATE reqn_version
      JOIN reqn_version_cache USING( id )
      SET reqn_version.ethics = IF( reqn_version_cache.ethics IS NULL, NULL, IF( reqn_version_cache.ethics, "yes", "no" ) );
    END IF;

    SELECT "Adding new new_user_id column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "new_user_id";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN new_user_id INT UNSIGNED NULL DEFAULT NULL AFTER reqn_id;
      ALTER TABLE reqn_version ADD INDEX fk_new_user_id (new_user_id ASC);
      SET @sql = CONCAT(
        "ALTER TABLE reqn_version ADD CONSTRAINT fk_reqn_version_new_user_id ",
        "FOREIGN KEY (new_user_id) ",
        "REFERENCES ", @cenozo, ".user (id) ",
        "ON DELETE NO ACTION ",
        "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
