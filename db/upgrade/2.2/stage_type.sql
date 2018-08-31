SELECT "Creating new stage_type table" AS "";

CREATE TABLE IF NOT EXISTS stage_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  phase ENUM('new', 'review', 'agreement', 'complete') NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL,
  decision TINYINT(1) NOT NULL DEFAULT 0,
  notification_type_id INT UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_rank (rank ASC),
  INDEX fk_notification_type_id (notification_type_id ASC),
  CONSTRAINT fk_stage_type_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES notification_type (id)
    ON DELETE SET NULL 
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO stage_type( phase, rank, name, status, decision ) VALUES
( "new", 1, "New", "New", 0 ),
( "review", 2, "Admin Review", "Under Review", 0 ),
( "review", 3, "SAC Review", "Under Review", 0 ),
( "review", 4, "DSAC Selection", "Under Review", 1 ),
( "review", 5, "DSAC Review", "Under Review", 1 ),
( "review", 6, "SMT Decision", "Under Review", 1 ),
( "review", 7, "Revision Required", "Under Review", 0 ),
( "review", 8, "Second DSAC Decision", "Under Review", 0 ),
( "review", 9, "Second SMT Decision", "Under Review", 1 ),
( "review", 10, "Decision Made", "Under Review", 0 ),
( "agreement", 11, "Agreement", "Agreement in Preparation", 0 ),
( "agreement", 12, "Data Release", "Preparing Data", 0 ),
( "agreement", 13, "Active", "Active", 0 ),
( "agreement", 14, "Report Required", "Report Required", 0 ),
( "complete", 15, "Not Approved", "Not Approved", 0 ),
( "complete", 16, "Complete", "Complete", 0 );

UPDATE stage_type, notification_type
SET notification_type_id = notification_type.id
WHERE stage_type.name IN( "Agreement", "Not Approved" )
AND notification_type.name = "Notice of decision";

UPDATE stage_type, notification_type
SET notification_type_id = notification_type.id
WHERE stage_type.name = "Report Required"
AND notification_type.name = "Progress report required";
