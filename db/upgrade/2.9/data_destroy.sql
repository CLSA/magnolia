DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "data_destroy";

    IF @test = 0 THEN

      SELECT "Creating new data_destroy table" AS "";

      CREATE TABLE data_destroy (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        update_timestamp TIMESTAMP NOT NULL,
        create_timestamp TIMESTAMP NOT NULL,
        reqn_id INT(10) UNSIGNED NOT NULL,
        name VARCHAR(127) NOT NULL,
        datetime DATETIME NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX fk_reqn_id (reqn_id ASC),
        UNIQUE INDEX uq_reqn_id_name (reqn_id ASC, name ASC),
        CONSTRAINT fk_data_destry_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
      ENGINE = InnoDB;

      SELECT "Populating new data_destroy table" AS "";

      INSERT INTO data_destroy( reqn_id, name )
      SELECT DISTINCT reqn.id, data_version.name
      FROM reqn
      JOIN stage ON reqn.id = stage.reqn_id AND stage.datetime IS NULL
      JOIN stage_type ON stage.stage_type_id = stage_type.id
      JOIN data_release ON reqn.id = data_release.reqn_id
      JOIN data_version ON data_release.data_version_id = data_version.id
      WHERE stage_type.name = "Pre Data Destruction";

    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
