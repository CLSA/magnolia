DROP PROCEDURE IF EXISTS patch_amendment_current_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_amendment_current_reqn_version()
  BEGIN

    SELECT "Creating new amendment_current_reqn_version table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "amendment_current_reqn_version";

    IF @test = 0 THEN
      CREATE TABLE IF NOT EXISTS amendment_current_reqn_version (
        amendment_id INT(10) UNSIGNED NOT NULL,
        reqn_version_id INT(10) UNSIGNED NULL DEFAULT NULL,
        update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        PRIMARY KEY (amendment_id),
        INDEX fk_reqn_version_id (reqn_version_id ASC),
        CONSTRAINT fk_amendment_current_reqn_version_amendment_id
          FOREIGN KEY (amendment_id)
          REFERENCES amendment (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_amendment_current_reqn_version_reqn_version_id
          FOREIGN KEY (reqn_version_id)
          REFERENCES reqn_version (id)
          ON DELETE SET NULL
          ON UPDATE CASCADE)
      ENGINE = InnoDB;

      INSERT INTO amendment_current_reqn_version( amendment_id, reqn_version_id )
      SELECT amendment.id, reqn_version.id
      FROM amendment
      LEFT JOIN reqn_version ON amendment.id = reqn_version.amendment_id
      AND reqn_version.version <=> (
        SELECT MAX( version )
        FROM reqn_version
        WHERE amendment.id = reqn_version.amendment_id
      );
    END IF;

  END //
DELIMITER ;

CALL patch_amendment_current_reqn_version();
DROP PROCEDURE IF EXISTS patch_amendment_current_reqn_version;
