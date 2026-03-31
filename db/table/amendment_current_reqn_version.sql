CREATE TABLE amendment_current_reqn_version (
  amendment_id INT(10) UNSIGNED NOT NULL,
  reqn_version_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (amendment_id),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  CONSTRAINT fk_amendment_current_reqn_version_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES magnolia.amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_amendment_current_reqn_version_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES magnolia.reqn_version (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
