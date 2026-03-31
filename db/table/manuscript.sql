CREATE TABLE manuscript (
  id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  reqn_id INT(10) UNSIGNED NOT NULL,
  title VARCHAR(511) NOT NULL,
  deferred TINYINT(1) NOT NULL DEFAULT 0,
  deferred_date DATE NULL DEFAULT NULL,
  suggested_revisions TINYINT(1) NOT NULL DEFAULT 0,
  note TEXT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  UNIQUE INDEX uq_reqn_id_title (reqn_id ASC, title ASC),
  CONSTRAINT fk_manuscript_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
