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
        version INT UNSIGNED NOT NULL DEFAULT 1,
        datetime DATETIME NOT NULL,
        applicant_position VARCHAR(255) NULL DEFAULT NULL,
        applicant_affiliation VARCHAR(255) NULL DEFAULT NULL,
        applicant_address VARCHAR(511) NULL DEFAULT NULL,
        applicant_phone VARCHAR(45) NULL DEFAULT NULL,
        graduate_program VARCHAR(255) NULL DEFAULT NULL,
        graduate_institution VARCHAR(255) NULL DEFAULT NULL,
        graduate_address VARCHAR(511) NULL DEFAULT NULL,
        graduate_phone VARCHAR(45) NULL DEFAULT NULL,
        start_date DATE NULL DEFAULT NULL,
        duration VARCHAR(45) NULL DEFAULT NULL,
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
        part2_a_comment TEXT NULL DEFAULT NULL,
        part2_b_comment TEXT NULL DEFAULT NULL,
        part2_c_comment TEXT NULL DEFAULT NULL,
        part2_d_comment TEXT NULL DEFAULT NULL,
        part2_e_comment TEXT NULL DEFAULT NULL,
        part2_f_comment TEXT NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX fk_reqn_id (reqn_id ASC),
        UNIQUE INDEX uq_reqn_id_version (reqn_id ASC, version ASC),
        CONSTRAINT fk_reqn_version_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE)
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

DROP TRIGGER IF EXISTS reqn_version_AFTER_UPDATE $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_UPDATE AFTER UPDATE ON reqn_version FOR EACH ROW
BEGIN
  CALL update_reqn_current_reqn_version( NEW.reqn_id );
END$$

DROP TRIGGER IF EXISTS reqn_version_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER reqn_version_AFTER_DELETE AFTER DELETE ON reqn_version FOR EACH ROW
BEGIN
  CALL update_reqn_current_reqn_version( OLD.reqn_id );
END$$

DELIMITER ;

