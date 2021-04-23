DROP PROCEDURE IF EXISTS patch_reqn_last_reqn_version_with_agreement;
DELIMITER //
CREATE PROCEDURE patch_reqn_last_reqn_version_with_agreement()
  BEGIN

    SELECT "Adding new reqn_last_reqn_version_with_agreement table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_last_reqn_version_with_agreement";

    IF @test = 0 THEN
      CREATE TABLE reqn_last_reqn_version_with_agreement (
        reqn_id INT(10) UNSIGNED NOT NULL,
        reqn_version_id INT(10) UNSIGNED NULL DEFAULT NULL,
        update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        create_timestamp TIMESTAMP NOT NULL DEFAULT '0000-00-00 00:00:00',
        PRIMARY KEY (reqn_id),
        INDEX fk_reqn_version_id (reqn_version_id ASC),
        CONSTRAINT fk_reqn_last_reqn_version_with_agreement_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_reqn_last_reqn_version_with_agreement_reqn_version_id
          FOREIGN KEY (reqn_version_id)
          REFERENCES reqn_version (id)
          ON DELETE SET NULL
          ON UPDATE CASCADE)
      ENGINE = InnoDB;

      INSERT INTO reqn_last_reqn_version_with_agreement( reqn_id, reqn_version_id )
      SELECT reqn.id, reqn_version.id
      FROM reqn 
      LEFT JOIN reqn_version ON reqn.id = reqn_version.reqn_id
      AND CONCAT( reqn_version.amendment, reqn_version.version ) <=> (
        SELECT MAX( CONCAT( amendment, version ) )
        FROM reqn_version
        WHERE reqn.id = reqn_version.reqn_id
        AND reqn_version.agreement_filename IS NOT NULL 
        GROUP BY reqn_version.reqn_id
        LIMIT 1
      );
    END IF;
  END //
DELIMITER ;

CALL patch_reqn_last_reqn_version_with_agreement();
DROP PROCEDURE IF EXISTS patch_reqn_last_reqn_version_with_agreement;
