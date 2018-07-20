SELECT "Creating new notification_type table" AS "";

CREATE TABLE IF NOT EXISTS notification_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  message_en TEXT NOT NULL,
  message_fr TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO notification_type( name, message_en, message_fr ) VALUES
( "Action required", "TODO: This will be the message sent to the applicant to indicate that an action is required.", "TRANSLATION REQUIRED" ),
( "Requisition Reactivated", "TODO: This will be the message sent to the applicant to indicate that an abandoned requisition has been reactivated and must be re-submitted.", "TRANSLATION REQUIRED" ),
( "Notice of decision", "TODO: This will be the message sent to the applicant to indicate that a decision has been made regarding their requisition.", "TRANSLATION REQUIRED" ),
( "Progress report required", "TODO: This will be the message sent to the applicant to indicate that a progress report is required.", "TRANSLATION REQUIRED" );
