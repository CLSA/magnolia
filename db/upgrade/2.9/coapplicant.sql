DROP PROCEDURE IF EXISTS patch_coapplicant;
DELIMITER //
CREATE PROCEDURE patch_coapplicant()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = (
      SELECT unique_constraint_schema
      FROM information_schema.referential_constraints
      WHERE constraint_schema = DATABASE()
      AND constraint_name = "fk_access_site_id"
    );

    SELECT "Adding country_id column to coapplicant table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "coapplicant"
    AND column_name = "country_id";

    IF @test = 0 THEN
      ALTER TABLE coapplicant
      ADD COLUMN country_id INT UNSIGNED NULL DEFAULT NULL AFTER affiliation,
      ADD INDEX fk_country_id (country_id ASC);

      SET @sql = CONCAT(
        "ALTER TABLE coapplicant ",
        "ADD CONSTRAINT fk_coapplicant_country_id ",
          "FOREIGN KEY (country_id) ",
          "REFERENCES ", @cenozo, ".country (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "UPDATE coapplicant ",
        "JOIN ", @cenozo, ".country ON affiliation LIKE CONCAT( '%', country.name, '%' ) ",
        "SET country_id = country.id ",
        "WHERE country_id IS NULL"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "UPDATE coapplicant ",
        "SET country_id = (SELECT id FROM ", @cenozo, ".country WHERE name = 'Canada') ",
        "WHERE country_id IS NULL ",
        "AND affiliation RLIKE '\\\\b(Calgary|Simon Fraser|Québec|Quebec|Laval|Montréal|Montreal|BC|UBC|SFU|Western University|Ottawa|Ryerson|McMaster|Ontario|Manitoba|McGill|Saskatchewan|Sherbrook|Sherbrooke|Toronto|Dalhousie|Nova Scotia|Concordia|New Brunswick|Queen\\'s University|Newfoundland|Laurentian|Lakehead|Health Sciences North|York University|Memorial University|Waterloo|Wilfred Laurier|Victoria|British Columbia|Alberta|Brock|Canadian|Acadia|Carleton|CAMH)\\\\b'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;

      SET @sql = CONCAT(
        "UPDATE coapplicant ",
        "SET country_id = (SELECT id FROM ", @cenozo, ".country WHERE name = 'United States (USA)') ",
        "WHERE country_id IS NULL ",
        "AND affiliation RLIKE '\\\\b(Boston|Harvard|Philadelphia|Oakland|Hawaii|Johns Hopkins|Massachusetts|Mayo Clinic|Michigan|Oakland|Stanford|Buffalo|Florida|Carolina|Pittsburgh|New York|Washington)\\\\b'"
      );
      PREPARE statement FROM @sql;
      EXECUTE statement;
      DEALLOCATE PREPARE statement;
    END IF;

  END //
DELIMITER ;

CALL patch_coapplicant();
DROP PROCEDURE IF EXISTS patch_coapplicant;
