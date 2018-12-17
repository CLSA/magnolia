DROP PROCEDURE IF EXISTS patch_reference;
DELIMITER //
CREATE PROCEDURE patch_reference()
  BEGIN

    SELECT "Changing foreign key in reference table from reqn to reqn_version" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reference"
    AND column_name = "reqn_id";

    IF @test THEN

      ALTER TABLE reference
      ADD COLUMN reqn_version_id INT UNSIGNED NOT NULL AFTER reqn_id,
      ADD INDEX fk_reqn_version_id (reqn_version_id ASC);

      UPDATE reference
      JOIN reqn ON reference.reqn_id = reqn.id
      JOIN reqn_current_reqn_version ON reqn.id = reqn_current_reqn_version.reqn_id
      SET reference.reqn_version_id = reqn_current_reqn_version.reqn_version_id;

      ALTER TABLE reference
      ADD UNIQUE INDEX uq_reqn_version_id_rank (reqn_version_id ASC, rank ASC),
      ADD CONSTRAINT fk_reference_reqn_version_id
      FOREIGN KEY (reqn_version_id)
      REFERENCES reqn_version (id)
      ON DELETE CASCADE
      ON UPDATE CASCADE;

      ALTER TABLE reference
      DROP INDEX uq_reqn_id_rank,
      DROP FOREIGN KEY fk_reference_reqn_id,
      DROP INDEX fk_reqn_id,
      DROP COLUMN reqn_id;

    END IF;

  END //
DELIMITER ;

CALL patch_reference();
DROP PROCEDURE IF EXISTS patch_reference;
