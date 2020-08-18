SELECT "Creating new reqn_last_ethics_approval table" AS "";

CREATE TABLE IF NOT EXISTS reqn_last_ethics_approval (
  reqn_id INT UNSIGNED NOT NULL,
  ethics_approval_id INT UNSIGNED NULL DEFAULT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_id),
  INDEX fk_ethics_approval_id (ethics_approval_id ASC),
  CONSTRAINT fk_reqn_last_ethics_approval_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_last_ethics_approval_ethics_approval_id
    FOREIGN KEY (ethics_approval_id)
    REFERENCES ethics_approval (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

INSERT IGNORE INTO reqn_last_ethics_approval( reqn_id, ethics_approval_id )
SELECT reqn.id, NULL
FROM reqn;
