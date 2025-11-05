DROP PROCEDURE IF EXISTS patch_amendment;
DELIMITER //
CREATE PROCEDURE patch_amendment()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "amendment";

    IF @test = 0 THEN
      SELECT "Creating new amendment table" AS "";

      CREATE TABLE IF NOT EXISTS amendment (
        id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
        update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
        create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
        reqn_id INT(10) UNSIGNED NOT NULL,
        name CHAR(1) NOT NULL,
        fee INT(10) NULL DEFAULT NULL,
        override_fee INT(10) NULL DEFAULT NULL,
        PRIMARY KEY (id),
        INDEX fk_reqn_id (reqn_id ASC),
        UNIQUE INDEX uq_reqn_id_name (reqn_id ASC, name ASC),
        CONSTRAINT fk_amendment_reqn_id
          FOREIGN KEY (reqn_id)
          REFERENCES reqn (id)
          ON DELETE CASCADE
          ON UPDATE CASCADE)
      ENGINE = InnoDB
      COLLATE=utf8mb4_general_ci;

      SELECT "Creating all new amendment records" AS "";

      INSERT INTO amendment (reqn_id, name) SELECT DISTINCT reqn_id, amendment FROM reqn_version;
    END IF;

  END //
DELIMITER ;

CALL patch_amendment();
DROP PROCEDURE IF EXISTS patch_amendment;
