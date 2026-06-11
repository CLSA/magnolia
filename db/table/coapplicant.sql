CREATE TABLE coapplicant (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_version_id int(10) unsigned NOT NULL,
  name varchar(63) NOT NULL,
  position varchar(255) NOT NULL,
  affiliation varchar(255) NOT NULL,
  country_id int(10) unsigned DEFAULT NULL,
  email varchar(127) NOT NULL,
  role varchar(45) NOT NULL,
  trainee tinyint(1) NOT NULL DEFAULT 0,
  access tinyint(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_version_id_name (reqn_version_id,name),
  KEY fk_reqn_version_id (reqn_version_id),
  KEY fk_country_id (country_id),
  CONSTRAINT fk_coapplicant_country_id
    FOREIGN KEY (country_id)
    REFERENCES cenozo_mg.country (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_coapplicant_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;