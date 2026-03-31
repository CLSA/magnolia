CREATE TABLE reqn_last_ethics_approval (
  reqn_id INT(10) UNSIGNED NOT NULL,
  ethics_approval_id INT(10) UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (reqn_id),
  INDEX fk_ethics_approval_id (ethics_approval_id ASC),
  CONSTRAINT fk_reqn_last_ethics_approval_ethics_approval_id
    FOREIGN KEY (ethics_approval_id)
    REFERENCES magnolia.ethics_approval (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_last_ethics_approval_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES magnolia.reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
