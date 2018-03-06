DROP PROCEDURE IF EXISTS patch_requisition_has_stage;
DELIMITER //
CREATE PROCEDURE patch_requisition_has_stage()
  BEGIN

    -- determine cenozo's database name
    SET @cenozo = ( 
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id" );

    SET @test = ( 
      SELECT COUNT(*)
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = "requisition_has_stage" );
    IF @test = 0 THEN

      SELECT "Creating new requisition_has_stage table" AS "";

      SET @sql = CONCAT(
        "CREATE TABLE IF NOT EXISTS requisition_has_stage ( ",
          "requisition_id INT UNSIGNED NOT NULL, ",
          "stage_id INT UNSIGNED NOT NULL, ",
          "update_timestamp TIMESTAMP NOT NULL, ",
          "create_timestamp TIMESTAMP NOT NULL, ",
          "datetime DATETIME NOT NULL, ",
          "user_id INT UNSIGNED NOT NULL, ",
          "prepared TINYINT(1) NOT NULL DEFAULT 0, ",
          "PRIMARY KEY (requisition_id, stage_id), ",
          "INDEX fk_stage_id (stage_id ASC), ",
          "INDEX fk_requisition_id (requisition_id ASC), ",
          "INDEX fk_user_id (user_id ASC), ",
          "CONSTRAINT fk_requisition_has_stage_requisition_id ",
            "FOREIGN KEY (requisition_id) ",
            "REFERENCES requisition (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION, ",
          "CONSTRAINT fk_requisition_has_stage_stage_id ",
            "FOREIGN KEY (stage_id) ",
            "REFERENCES stage (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION, ",
          "CONSTRAINT fk_requisition_has_stage_user_id ",
            "FOREIGN KEY (user_id) ",
            "REFERENCES ", @cenozo, ".user (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION) ",
        "ENGINE = InnoDB" );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

    END IF;

  END //
DELIMITER ;

CALL patch_requisition_has_stage();
DROP PROCEDURE IF EXISTS patch_requisition_has_stage;
