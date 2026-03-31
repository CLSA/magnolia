CREATE TABLE ethics_approval (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  filename VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reqn_id_date (reqn_id ASC, date ASC),
  INDEX fk_reqn_id (reqn_id ASC),
  CONSTRAINT fk_ethics_approval_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
