SELECT "Creating new notification_type table" AS "";

CREATE TABLE IF NOT EXISTS notification_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  title_en VARCHAR(127) NOT NULL,
  title_fr VARCHAR(127) NOT NULL,
  message_en TEXT NOT NULL,
  message_fr TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO notification_type( name, title_en, title_fr, message_en, message_fr ) VALUES
(
  "Action required",
  "",
  "",
  "",
  ""
), (
  "Requisition Reactivated",
  "",
  "",
  "",
  ""
), (
  "Notice of decision",
  "",
  "",
  "",
  ""
), (
  "Final report required",
  "",
  "",
  "",
  ""
);
