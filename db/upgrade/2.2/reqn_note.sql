DROP PROCEDURE IF EXISTS patch_reqn_note;
DELIMITER //
CREATE PROCEDURE patch_reqn_note()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new reqn_note table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS reqn_note ( ",
        "id INT UNSIGNED NOT NULL AUTO_INCREMENT, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "reqn_id INT UNSIGNED NOT NULL, ",
        "property VARCHAR(31) NOT NULL, ",
        "public TINYINT(1) NOT NULL DEFAULT 0, ",
        "note VARCHAR(1023) NOT NULL, ",
        "PRIMARY KEY (id), ",
        "INDEX fk_reqn_id (reqn_id ASC), ",
        "UNIQUE INDEX dk_reqn_id_property (reqn_id ASC, property ASC), ",
        "CONSTRAINT fk_reqn_note_reqn_id ",
          "FOREIGN KEY (reqn_id) ",
          "REFERENCES reqn (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

  END //
DELIMITER ;

CALL patch_reqn_note();
DROP PROCEDURE IF EXISTS patch_reqn_note;
