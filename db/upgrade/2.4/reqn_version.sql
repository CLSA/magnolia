DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    SELECT "Creating new reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = 'reqn_version';

    IF @test = 0 THEN

      CREATE TABLE IF NOT EXISTS reqn_version (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        update_timestamp TIMESTAMP NOT NULL,
        create_timestamp TIMESTAMP NOT NULL,
        reqn_id INT UNSIGNED NOT NULL,
        amendment CHAR(1) NOT NULL DEFAULT '.',
        version INT UNSIGNED NOT NULL DEFAULT 1,
        datetime DATETIME NOT NULL,
        amendment_type_id INT UNSIGNED NULL DEFAULT NULL,
        applicant_position VARCHAR(255) NULL DEFAULT NULL,
        applicant_affiliation VARCHAR(255) NULL DEFAULT NULL,
        applicant_address VARCHAR(511) NULL DEFAULT NULL,
        applicant_phone VARCHAR(45) NULL DEFAULT NULL,
        graduate_program VARCHAR(255) NULL DEFAULT NULL,
        graduate_institution VARCHAR(255) NULL DEFAULT NULL,
        graduate_address VARCHAR(511) NULL DEFAULT NULL,
        graduate_phone VARCHAR(45) NULL DEFAULT NULL,
        start_date DATE NULL DEFAULT NULL,
        duration ENUM('2 years', '3 years') NULL DEFAULT NULL,
        title VARCHAR(511) NULL DEFAULT NULL,
        keywords VARCHAR(255) NULL DEFAULT NULL,
        lay_summary VARCHAR(2047) NULL DEFAULT NULL,
        background TEXT NULL DEFAULT NULL,
        objectives TEXT NULL DEFAULT NULL,
        methodology TEXT NULL DEFAULT NULL,
        analysis TEXT NULL DEFAULT NULL,
        funding ENUM('yes', 'no', 'requested') NULL DEFAULT NULL,
        funding_filename VARCHAR(255) NULL DEFAULT NULL,
        funding_agency VARCHAR(255) NULL DEFAULT NULL,
        grant_number VARCHAR(45) NULL DEFAULT NULL,
        ethics TINYINT(1) NULL DEFAULT NULL,
        ethics_date DATE NULL DEFAULT NULL,
        ethics_filename VARCHAR(255) NULL DEFAULT NULL,
        waiver ENUM('graduate', 'postdoc') NULL DEFAULT NULL,
        comprehensive TINYINT(1) NULL DEFAULT NULL,
        tracking TINYINT(1) NULL DEFAULT NULL,
        agreement_filename VARCHAR(255) NULL DEFAULT NULL,
        part2_a_comment TEXT NULL DEFAULT NULL,
        part2_b_comment TEXT NULL DEFAULT NULL,
        part2_c_comment TEXT NULL DEFAULT NULL,
        part2_d_comment TEXT NULL DEFAULT NULL,
        part2_e_comment TEXT NULL DEFAULT NULL,
        part2_f_comment TEXT NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX fk_reqn_id (reqn_id ASC),
        UNIQUE INDEX uq_reqn_id_version (reqn_id ASC, version ASC),
        INDEX fk_amendment_type_id (amendment_type_id ASC),
        CONSTRAINT fk_reqn_version_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_reqn_version_amendment_type_id
          FOREIGN KEY (amendment_type_id)
          REFERENCES amendment_type (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
      ENGINE = InnoDB;

      ALTER TABLE reqn_version AUTO_INCREMENT = 1001;

      -- transfer reqn data into first version
      INSERT INTO reqn_version(
        reqn_id, version, datetime,
        applicant_position, applicant_affiliation, applicant_address, applicant_phone,
        graduate_program, graduate_institution, graduate_address, graduate_phone,
        start_date, duration,
        title, keywords, lay_summary, background, objectives, methodology, analysis,
        funding, funding_filename, funding_agency,
        grant_number,
        ethics, ethics_date, ethics_filename,
        waiver,
        comprehensive, tracking,
        part2_a_comment, part2_b_comment, part2_c_comment, part2_d_comment, part2_e_comment, part2_f_comment )
      SELECT
        id, 1, UTC_TIMESTAMP(),
        applicant_position, applicant_affiliation, applicant_address, applicant_phone,
        graduate_program, graduate_institution, graduate_address, graduate_phone,
        start_date, duration,
        title, keywords, lay_summary, background, objectives, methodology, analysis,
        funding, funding_filename, funding_agency,
        grant_number,
        ethics, ethics_date, ethics_filename,
        waiver,
        comprehensive, tracking,
        part2_a_comment, part2_b_comment, part2_c_comment, part2_d_comment, part2_e_comment, part2_f_comment
      FROM reqn;

    END IF;

    SELECT "Adding amendment column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "amendment";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN amendment CHAR(1) NOT NULL DEFAULT '.' AFTER reqn_id;

      ALTER TABLE reqn_version
      DROP KEY uq_reqn_id_version,
      ADD UNIQUE KEY uq_reqn_id_amendment_version (reqn_id, amendment, version);
    END IF;

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "amendment_type_id";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN amendment_type_id INT UNSIGNED NULL DEFAULT NULL AFTER datetime;

      ALTER TABLE reqn_version
      ADD INDEX fk_amendment_type_id (amendment_type_id ASC),
      ADD CONSTRAINT fk_reqn_version_amendment_type_id
        FOREIGN KEY (amendment_type_id)
        REFERENCES amendment_type (id)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION;
    END IF;

    SELECT "Adding agreement_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "agreement_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN agreement_filename VARCHAR(255) NULL DEFAULT NULL AFTER tracking;

      -- make sure the old update trigger doesn't exist, otherwise the following update won't work
      DROP TRIGGER IF EXISTS reqn_version_AFTER_UPDATE;

      UPDATE reqn
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      JOIN reqn_version ON reqn_current_reqn_version.reqn_version_id = reqn_version.id
      SET reqn_version.agreement_filename = reqn.agreement_filename
      WHERE reqn.agreement_filename IS NOT NULL;
    END IF;

    SELECT "Adding data_sharing_filename column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "data_sharing_filename";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN data_sharing_filename VARCHAR(255) NULL DEFAULT NULL AFTER tracking;
    END IF;

    SELECT "Adding last_identifier column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "last_identifier";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN last_identifier CHAR(10) NULL DEFAULT NULL AFTER tracking;
    END IF;

    SELECT "Adding longitudinal column to reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "longitudinal";

    IF @test = 0 THEN
      ALTER TABLE reqn_version ADD COLUMN longitudinal TINYINT(1) NULL DEFAULT NULL AFTER tracking;

      UPDATE reqn_version
      JOIN reqn ON reqn_version.reqn_id = reqn.id
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      SET reqn_version.longitudinal = false
      WHERE stage_type.name != "New";
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;


DELIMITER $$

DROP TRIGGER IF EXISTS reqn_version_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_INSERT AFTER INSERT ON reqn_version FOR EACH ROW
BEGIN
  CALL update_reqn_current_reqn_version( NEW.reqn_id );
END$$

DROP TRIGGER IF EXISTS reqn_version_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_DELETE AFTER DELETE ON reqn_version FOR EACH ROW
BEGIN
  CALL update_reqn_current_reqn_version( OLD.reqn_id );
END$$

DELIMITER ;

