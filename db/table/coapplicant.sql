CREATE TABLE coapplicant (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_version_id INT(10) UNSIGNED NOT NULL,
  name VARCHAR(63) NOT NULL,
  position VARCHAR(255) NOT NULL,
  affiliation VARCHAR(255) NOT NULL,
  country_id INT(10) UNSIGNED NULL DEFAULT NULL,
  email VARCHAR(127) NOT NULL,
  role VARCHAR(45) NOT NULL,
  trainee TINYINT(1) NOT NULL DEFAULT 0,
  access TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reqn_version_id_name (reqn_version_id ASC, name ASC),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  INDEX fk_country_id (country_id ASC),
  CONSTRAINT fk_coapplicant_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES magnolia.reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_coapplicant_country_id
    FOREIGN KEY (country_id)
    REFERENCES cenozo.country (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
