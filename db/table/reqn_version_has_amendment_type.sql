CREATE TABLE reqn_version_has_amendment_type (
  reqn_version_id INT(10) UNSIGNED NOT NULL,
  amendment_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_version_id, amendment_type_id),
  INDEX fk_amendment_type_id (amendment_type_id ASC),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  CONSTRAINT fk_reqn_version_has_amendment_type_amendment_type_id
    FOREIGN KEY (amendment_type_id)
    REFERENCES magnolia.amendment_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_version_has_amendment_type_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES magnolia.reqn_version (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
