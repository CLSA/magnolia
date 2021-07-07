DROP PROCEDURE IF EXISTS patch_amendment_justification;
DELIMITER //
CREATE PROCEDURE patch_amendment_justification()
  BEGIN

    SELECT "Creating new amendment_justification table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_justification";

    IF @test = 0 THEN
      CREATE TABLE amendment_justification (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        update_timestamp TIMESTAMP NOT NULL,
        create_timestamp TIMESTAMP NOT NULL,
        reqn_version_id INT(10) UNSIGNED NOT NULL,
        amendment_type_id INT(10) UNSIGNED NOT NULL,
        description TEXT NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX fk_reqn_version_id (reqn_version_id ASC),
        INDEX fk_amendment_type_id (amendment_type_id ASC),
        UNIQUE INDEX uq_reqn_version_id_amendment_type_id (reqn_version_id ASC, amendment_type_id ASC),
        CONSTRAINT fk_amendment_justification_reqn_version_id
          FOREIGN KEY (reqn_version_id)
          REFERENCES reqn_version (id)
          ON DELETE CASCADE
          ON UPDATE NO ACTION,
        CONSTRAINT fk_amendment_justification_amendment_type_id
          FOREIGN KEY (amendment_type_id)
          REFERENCES amendment_type (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION)
      ENGINE = InnoDB;

      -- copy justifications from the old reqn_version.amendment_justification column
      INSERT INTO amendment_justification( reqn_version_id, amendment_type_id, description )
      SELECT reqn_version.id, reqn_version_has_amendment_type.amendment_type_id, reqn_version.amendment_justification
      FROM reqn_version
      JOIN reqn_version_has_amendment_type ON reqn_version.id = reqn_version_has_amendment_type.reqn_version_id
      JOIN amendment_type ON reqn_version_has_amendment_type.amendment_type_id = amendment_type.id
      WHERE amendment_type.justification_prompt_en IS NOT NULL;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_justification();
DROP PROCEDURE IF EXISTS patch_amendment_justification;
