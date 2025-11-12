DROP PROCEDURE IF EXISTS patch_reqn_current_amendment;
DELIMITER //
CREATE PROCEDURE patch_reqn_current_amendment()
  BEGIN

    SELECT "Creating new reqn_current_amendment table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_current_amendment";

    IF @test = 0 THEN
      CREATE TABLE IF NOT EXISTS reqn_current_amendment (
        reqn_id INT(10) UNSIGNED NOT NULL,
        amendment_id INT(10) UNSIGNED NULL DEFAULT NULL,
        update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        PRIMARY KEY (reqn_id),
        INDEX fk_amendment_id (amendment_id ASC),
        CONSTRAINT fk_reqn_current_amendment_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE,
        CONSTRAINT fk_reqn_current_amendment_amendment_id
          FOREIGN KEY (amendment_id)
          REFERENCES amendment (id)
          ON DELETE SET NULL
          ON UPDATE CASCADE)
      ENGINE = InnoDB;

      INSERT INTO reqn_current_amendment( reqn_id, amendment_id )
      SELECT reqn.id, amendment.id
      FROM reqn
      LEFT JOIN amendment ON reqn.id = amendment.reqn_id
      AND amendment.name <=> (
        SELECT MAX( name )
        FROM amendment
        WHERE reqn.id = amendment.reqn_id
      );
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_current_amendment();
DROP PROCEDURE IF EXISTS patch_reqn_current_amendment;
