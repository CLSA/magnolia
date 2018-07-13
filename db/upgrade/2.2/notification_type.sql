SELECT "Creating new notification_type table" AS "";

CREATE TABLE IF NOT EXISTS notification_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  message TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO notification_type( name, message ) VALUES
( "Action required", "TODO: This will be the message sent to the applicant to indicate that an action is required." ),
( "Notice of decision", "TODO: This will be the message sent to the applicant to indicate that a decision has been made regarding their requisition." ),
( "Progress report required", "TODO: This will be the message sent to the applicant to indicate that a progress report is required." );
