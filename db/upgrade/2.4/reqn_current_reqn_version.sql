SELECT "Creating new reqn_current_reqn_version table" AS "";

CREATE TABLE IF NOT EXISTS reqn_current_reqn_version (
  reqn_id INT UNSIGNED NOT NULL,
  reqn_version_id INT UNSIGNED NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_id),
  INDEX fk_reqn_version_id (reqn_version_id ASC),
  CONSTRAINT fk_reqn_current_reqn_version_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_reqn_current_reqn_version_reqn_version_id
    FOREIGN KEY (reqn_version_id)
    REFERENCES reqn_version (id)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;

REPLACE INTO reqn_current_reqn_version( reqn_id, reqn_version_id )
SELECT reqn.id, reqn_version.id
FROM reqn
LEFT JOIN reqn_version ON reqn.id = reqn_version.reqn_id
AND reqn_version.version <=> (
  SELECT MAX( version )
  FROM reqn_version
  WHERE reqn.id = reqn_version.reqn_id
  GROUP BY reqn_version.reqn_id
  LIMIT 1
);
