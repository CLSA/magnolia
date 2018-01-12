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
        "identifier VARCHAR(45) NULL, ",
        "name VARCHAR(255) NULL, ",
        "position VARCHAR(255) NULL, ",
        "affiliation VARCHAR(255) NULL, ",
        "address VARCHAR(511) NULL, ",
        "phone VARCHAR(45) NULL, ",
        "email VARCHAR(127) NULL, ",
        "graduate_name VARCHAR(255) NULL, ",
        "graduate_program VARCHAR(255) NULL, ",
        "gradualte_institution VARCHAR(255) NULL, ",
        "graduate_address VARCHAR(511) NULL, ",
        "graduate_phone VARCHAR(45) NULL, ",
        "graduate_email VARCHAR(127) NULL, ",
        "start_date DATE NULL, ",
        "duration VARCHAR(45) NULL, ",
        "title VARCHAR(511) NULL, ",
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
        "waiver ENUM('graduate','postdoc') NULL, ",
        "qnaire_comment TEXT NULL, ",
        "physical_comment TEXT NULL, ",
        "biomarker_comment TEXT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "UNIQUE INDEX uq_identifier (identifier ASC), ",
        "CONSTRAINT fk_requisition_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_requisition();
DROP PROCEDURE IF EXISTS patch_requisition;
