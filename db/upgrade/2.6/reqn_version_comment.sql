SELECT "Creating new reqn_version_comment table" AS "";

CREATE TABLE IF NOT EXISTS reqn_version_comment (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_version_id INT(10) UNSIGNED NOT NULL,
  data_option_category_id INT(10) UNSIGNED NOT NULL,
  description TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  INDEX fk_data_option_category_id (data_option_category_id ASC),
  UNIQUE INDEX uq_reqn_version_id_data_option_category_id (reqn_version_id ASC, data_option_category_id ASC),
  CONSTRAINT fk_reqn_version_comment_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_comment_data_option_category_id
    FOREIGN KEY (data_option_category_id)
    REFERENCES data_option_category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SELECT "Populating reqn_version_comment table based on data_option_category records with comments enabled" AS "";

INSERT IGNORE INTO reqn_version_comment( reqn_version_id, data_option_category_id )
SELECT reqn_version.id, data_option_category.id
FROM reqn_version, data_option_category
WHERE data_option_category.comment = true;
