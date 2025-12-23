DROP PROCEDURE IF EXISTS patch_reqn_last_amendment_with_agreement;
DELIMITER //
CREATE PROCEDURE patch_reqn_last_amendment_with_agreement()
  BEGIN

    SELECT "Creating new reqn_last_amendment_with_agreement table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_last_amendment_with_agreement";

    IF @test = 0 THEN
      CREATE TABLE IF NOT EXISTS reqn_last_amendment_with_agreement (
        reqn_id INT(10) UNSIGNED NOT NULL,
        amendment_id INT(10) UNSIGNED NULL DEFAULT NULL,
        update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        PRIMARY KEY (reqn_id),
        INDEX fk_amendment_id (amendment_id ASC),
        CONSTRAINT fk_reqn_last_amendment_with_agreement_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_reqn_last_amendment_with_agreement_amendment_id
          FOREIGN KEY (amendment_id)
          REFERENCES amendment (id)
          ON DELETE SET NULL 
          ON UPDATE CASCADE)
      ENGINE = InnoDB;

      INSERT INTO reqn_last_amendment_with_agreement( reqn_id, amendment_id )
      SELECT reqn.id, amendment.id
      FROM reqn
      LEFT JOIN amendment ON reqn.id = amendment.reqn_id
      AND amendment.name <=> (
        SELECT MAX( amendment.name )
        FROM amendment
        JOIN amendment_current_reqn_version
          ON amendment.id = amendment_current_reqn_version.amendment_id
        JOIN reqn_version ON amendment_current_reqn_version.reqn_version_id = reqn_version.id
        WHERE reqn.id = amendment.reqn_id
        AND reqn_version.agreement_filename IS NOT NULL
      );
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_last_amendment_with_agreement();
DROP PROCEDURE IF EXISTS patch_reqn_last_amendment_with_agreement;
