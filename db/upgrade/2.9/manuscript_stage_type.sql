SELECT "Creating new manuscript_stage_type table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_stage_type (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  phase ENUM('new', 'review', 'complete') NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  status VARCHAR(45) NULL,
  notification_type_id INT(10) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX rank_UNIQUE (rank ASC),
  UNIQUE INDEX name_UNIQUE (name ASC),
  INDEX fk_notification_type_id (notification_type_id ASC),
  CONSTRAINT fk_manuscript_stage_type_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES notification_type (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO manuscript_stage_type (phase, rank, name, status) VALUES
("new", 1, "New", "New"),
("review", 2, "Admin Review", "Under Review"),
("review", 3, "DAO Review", "Under Review"),
("review", 4, "Decision Made", "Under Review"),
("review", 5, "Suggested Revisions", "Suggested Revisions"),
("complete", 6, "Complete", "Complete"),
("complete", 7, "Not Approved", "Not Approved");

UPDATE manuscript_stage_type
SET notification_type_id = (SELECT id FROM notification_type WHERE name = "Notice of decision (manuscript)")
WHERE name = "Decision Made";
