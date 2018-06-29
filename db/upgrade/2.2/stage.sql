DROP PROCEDURE IF EXISTS patch_stage;
DELIMITER //
CREATE PROCEDURE patch_stage()
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
      AND TABLE_NAME = "stage" );
    IF @test = 0 THEN

      SELECT "Creating new stage table" AS "";

      SET @sql = CONCAT(
        "CREATE TABLE IF NOT EXISTS stage ( ",
          "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
          "update_timestamp TIMESTAMP NOT NULL, ",
          "create_timestamp TIMESTAMP NOT NULL, ",
          "reqn_id INT UNSIGNED NOT NULL, ",
          "stage_type_id INT UNSIGNED NOT NULL, ",
          "user_id INT UNSIGNED NULL DEFAULT NULL, ",
          "datetime DATETIME NOT NULL, ",
          "unprepared TINYINT(1) NOT NULL DEFAULT 0, ",
          "PRIMARY KEY (id), ",
          "INDEX fk_reqn_id (reqn_id ASC), ",
          "INDEX fk_stage_type_id (stage_type_id ASC), ",
          "INDEX fk_user_id (user_id ASC), ",
          "CONSTRAINT fk_stage_reqn_id ",
            "FOREIGN KEY (reqn_id) ",
            "REFERENCES reqn (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION, ",
          "CONSTRAINT fk_stage_stage_type_id ",
            "FOREIGN KEY (stage_type_id) ",
            "REFERENCES stage_type (id) ",
            "ON DELETE NO ACTION ",
            "ON UPDATE NO ACTION, ",
          "CONSTRAINT fk_stage_user_id ",
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

CALL patch_stage();
DROP PROCEDURE IF EXISTS patch_stage;

DELIMITER $$

DROP TRIGGER IF EXISTS stage_AFTER_INSERT $$
CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_INSERT AFTER INSERT ON stage FOR EACH ROW
BEGIN
  CALL update_reqn_last_stage( NEW.reqn_id );
END$$


DROP TRIGGER IF EXISTS stage_AFTER_UPDATE $$
CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_UPDATE AFTER UPDATE ON stage FOR EACH ROW
BEGIN
  CALL update_reqn_last_stage( NEW.reqn_id );
END$$


DROP TRIGGER IF EXISTS stage_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_DELETE AFTER DELETE ON stage FOR EACH ROW
BEGIN
  CALL update_reqn_last_stage( OLD.reqn_id );
END$$

DELIMITER ;
