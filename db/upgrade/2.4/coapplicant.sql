DROP PROCEDURE IF EXISTS patch_coapplicant;
DELIMITER //
CREATE PROCEDURE patch_coapplicant()
  BEGIN

    SELECT "Changing foreign key in coapplicant table from reqn to reqn_version" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "coapplicant"
    AND column_name = "reqn_id";

    IF @test THEN

      ALTER TABLE coapplicant
      ADD COLUMN reqn_version_id INT UNSIGNED NOT NULL AFTER reqn_id,
      ADD INDEX fk_reqn_version_id (reqn_version_id ASC);

      UPDATE coapplicant
      JOIN reqn ON coapplicant.reqn_id = reqn.id
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      SET coapplicant.reqn_version_id = reqn_current_reqn_version.reqn_version_id;

      ALTER TABLE coapplicant
      ADD UNIQUE INDEX uq_reqn_version_id_name (reqn_version_id ASC, name ASC),
      ADD CONSTRAINT fk_coapplicant_reqn_version_id
      FOREIGN KEY (reqn_version_id)
      REFERENCES reqn_version (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

      ALTER TABLE coapplicant
      DROP INDEX uq_reqn_id_name,
      DROP FOREIGN KEY fk_coapplicant_reqn_id,
      DROP INDEX fk_reqn_id,
      DROP COLUMN reqn_id;

    END IF;

  END //
DELIMITER ;

CALL patch_coapplicant();
DROP PROCEDURE IF EXISTS patch_coapplicant;
