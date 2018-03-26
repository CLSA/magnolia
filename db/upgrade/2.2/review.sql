SELECT "Creating new review table" AS "";

CREATE TABLE IF NOT EXISTS review (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  type ENUM('Admin', 'SAC') NOT NULL,
  description TEXT NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_type (reqn_id ASC, type ASC),
  CONSTRAINT fk_review_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
