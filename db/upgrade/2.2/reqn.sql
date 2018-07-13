DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new reqn table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS reqn ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "user_id INT UNSIGNED NOT NULL, ",
        "chair_user_id INT UNSIGNED NULL, ",
        "reviewer1_user_id INT UNSIGNED NULL, ",
        "reviewer2_user_id INT UNSIGNED NULL, ",
        "language_id INT UNSIGNED NOT NULL, ",
        "deadline_id INT UNSIGNED NOT NULL, ",
        "identifier VARCHAR(45) NOT NULL, ",
        "state ENUM('deferred', 'abandoned') NULL DEFAULT NULL, ",
        "applicant_name VARCHAR(63) NULL, ",
        "applicant_position VARCHAR(255) NULL, ",
        "applicant_affiliation VARCHAR(255) NULL, ",
        "applicant_address VARCHAR(511) NULL, ",
        "applicant_phone VARCHAR(45) NULL, ",
        "applicant_email VARCHAR(127) NULL, ",
        "graduate_name VARCHAR(63) NULL, ",
        "graduate_program VARCHAR(255) NULL, ",
        "graduate_institution VARCHAR(255) NULL, ",
        "graduate_address VARCHAR(511) NULL, ",
        "graduate_phone VARCHAR(45) NULL, ",
        "graduate_email VARCHAR(127) NULL, ",
        "start_date DATE NULL, ",
        "duration VARCHAR(45) NULL, ",
        "title VARCHAR(511) NULL, ",
        "keywords VARCHAR(255) NULL, ",
        "lay_summary VARCHAR(2047) NULL, ",
        "background TEXT NULL, ",
        "objectives TEXT NULL, ",
        "methodology TEXT NULL, ",
        "analysis TEXT NULL, ",
        "funding ENUM('yes', 'no', 'requested') NULL, ",
        "funding_agency VARCHAR(255) NULL, ",
        "grant_number VARCHAR(45) NULL, ",
        "ethics TINYINT(1) NULL, ",
        "ethics_date DATE NULL, ",
        "ethics_filename VARCHAR(255) NULL, ",
        "waiver ENUM('graduate', 'postdoc') NULL, ",
        "qnaire TINYINT(1) NOT NULL DEFAULT 0, ",
        "qnaire_comment TEXT NULL, ",
        "physical TINYINT(1) NOT NULL DEFAULT 0, ",
        "physical_comment TEXT NULL, ",
        "biomarker TINYINT(1) NOT NULL DEFAULT 0, ",
        "biomarker_comment TEXT NULL, ",
        "deferral_note_part1_a1 TEXT NULL DEFAULT NULL, "
        "deferral_note_part1_a2 TEXT NULL DEFAULT NULL, "
        "deferral_note_part1_a3 TEXT NULL DEFAULT NULL, "
        "deferral_note_part1_a4 TEXT NULL DEFAULT NULL, "
        "deferral_note_part1_a5 TEXT NULL DEFAULT NULL, "
        "deferral_note_part1_a6 TEXT NULL DEFAULT NULL, "
        "deferral_note_part2_a TEXT NULL DEFAULT NULL, "
        "deferral_note_part2_b TEXT NULL DEFAULT NULL, "
        "deferral_note_part2_c TEXT NULL DEFAULT NULL, "
        "PRIMARY KEY (id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "INDEX fk_chair_user_id (chair_user_id ASC), ",
        "INDEX fk_reviewer1_user_id (reviewer1_user_id ASC), ",
        "INDEX fk_reviewer2_user_id (reviewer2_user_id ASC), ",
        "UNIQUE INDEX uq_identifier (identifier ASC), ",
        "INDEX fk_language_id (language_id ASC), ",
        "INDEX dk_state (state ASC), ",
        "INDEX fk_deadline_id (deadline_id ASC), ",
        "CONSTRAINT fk_reqn_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_reqn_language_id ",
          "FOREIGN KEY (language_id) ",
          "REFERENCES ", @cenozo, ".language (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_reqn_deadline_id ",
          "FOREIGN KEY (deadline_id) ",
          "REFERENCES deadline (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_reqn_chair_user_id ",
          "FOREIGN KEY (chair_user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_reqn_reviewer1_user_id ",
          "FOREIGN KEY (reviewer1_user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_reqn_reviewer2_user_id ",
          "FOREIGN KEY (reviewer2_user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @test = ( SELECT COUNT(*) FROM reqn );
    IF @test = 0 THEN
      ALTER TABLE reqn AUTO_INCREMENT = 1001;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
