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
          "datetime DATETIME NULL DEFAULT NULL, ",
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
  -- create any review associated with the stage_type
  INSERT IGNORE INTO review( create_timestamp, reqn_id, review_type_id )
  SELECT NULL, NEW.reqn_id, review_type.id
  FROM review_type
  JOIN stage_type ON review_type.stage_type_id = stage_type.id
  WHERE stage_type.id = NEW.stage_type_id;

  -- create the final report if we just created the report required stage
  SELECT name INTO @stage_type FROM stage_type WHERE id = NEW.stage_type_id;
  IF @stage_type = "Report Required" THEN
    INSERT IGNORE INTO final_report( create_timestamp, reqn_id )
    SELECT NULL, NEW.reqn_id;
  END IF;
END$$

DROP TRIGGER IF EXISTS stage_AFTER_DELETE $$
CREATE DEFINER = CURRENT_USER TRIGGER stage_AFTER_DELETE AFTER DELETE ON stage FOR EACH ROW
BEGIN
  -- delete all reviews associated with the stage_type
  DELETE FROM review
  WHERE review_type_id IN (
    SELECT review_type.id
    FROM review_type
    JOIN stage_type ON review_type.stage_type_id = stage_type.id
    WHERE stage_type.id = OLD.stage_type_id
  );
END$$

DELIMITER ;
