DROP PROCEDURE IF EXISTS patch_requisition;
DELIMITER //
CREATE PROCEDURE patch_requisition()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new requisition table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS requisition ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "user_id INT UNSIGNED NOT NULL, ",
        "language_id INT UNSIGNED NOT NULL, ",
        "deadline_id INT UNSIGNED NOT NULL, ",
        "identifier VARCHAR(45) NOT NULL, ",
        "state ENUM('deferred', 'rejected', 'abandoned') NULL DEFAULT NULL, ",
        "name VARCHAR(63) NULL, ",
        "position VARCHAR(255) NULL, ",
        "affiliation VARCHAR(255) NULL, ",
        "address VARCHAR(511) NULL, ",
        "phone VARCHAR(45) NULL, ",
        "email VARCHAR(127) NULL, ",
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
        "PRIMARY KEY (id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "UNIQUE INDEX uq_identifier (identifier ASC), ",
        "INDEX fk_language_id (language_id ASC), ",
        "INDEX dk_state (state ASC), ",
        "INDEX fk_deadline_id (deadline_id ASC), ",
        "CONSTRAINT fk_requisition_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_requisition_language_id ",
          "FOREIGN KEY (language_id) ",
          "REFERENCES ", @cenozo, ".language (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_requisition_deadline_id ",
          "FOREIGN KEY (deadline_id) ",
          "REFERENCES deadline (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SET @test = ( SELECT COUNT(*) FROM requisition );
    IF @test = 0 THEN
      ALTER TABLE requisition AUTO_INCREMENT = 1001;
    END IF;

  END //
DELIMITER ;

CALL patch_requisition();
DROP PROCEDURE IF EXISTS patch_requisition;
