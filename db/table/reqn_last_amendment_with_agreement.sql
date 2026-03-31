CREATE TABLE reqn_last_amendment_with_agreement (
  reqn_id INT(10) UNSIGNED NOT NULL,
  amendment_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_id),
  INDEX fk_amendment_id (amendment_id ASC),
  CONSTRAINT fk_reqn_last_amendment_with_agreement_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_last_amendment_with_agreement_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES magnolia.amendment (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;
