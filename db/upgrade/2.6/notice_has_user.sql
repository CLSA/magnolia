DROP PROCEDURE IF EXISTS patch_notice_has_user;
DELIMITER //
CREATE PROCEDURE patch_notice_has_user()
  BEGIN

    -- determine the cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Creating new ethics_approval table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS notice_has_user ( ",
        "notice_id INT(10) UNSIGNED NOT NULL, ",
        "user_id INT(10) UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "PRIMARY KEY (notice_id, user_id), ",
        "INDEX fk_user_id (user_id ASC), ",
        "INDEX fk_notice_id (notice_id ASC), ",
        "CONSTRAINT fk_notice_has_user_notice_id ",
          "FOREIGN KEY (notice_id) ",
          "REFERENCES notice (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION, ",
        "CONSTRAINT fk_notice_has_user_user_id ",
          "FOREIGN KEY (user_id) ",
          "REFERENCES ", @cenozo, ".user (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB"
    );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    SELECT COUNT(*) INTO @total
    FROM notice_has_user;

    IF 0 = @total THEN
      SET @sql = CONCAT(
        "INSERT INTO notice_has_user( notice_id, user_id ) ",
        "SELECT notice.id, user.id ",
        "FROM notice ",
        "JOIN reqn ON notice.reqn_id = reqn.id ",
        "JOIN ", @cenozo, ".user ON user.id IN ( reqn.user_id, reqn.trainee_user_id )"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_notice_has_user();
DROP PROCEDURE IF EXISTS patch_notice_has_user;
