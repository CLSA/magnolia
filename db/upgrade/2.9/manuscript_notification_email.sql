SELECT "Creating new manuscript_notification_email table" AS "";

CREATE TABLE IF NOT EXISTS manuscript_notification_email (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_notification_id INT(10) UNSIGNED NOT NULL,
  email VARCHAR(127) NOT NULL,
  name VARCHAR(127) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_manuscript_notification_id (manuscript_notification_id ASC),
  UNIQUE INDEX uq_manuscript_notification_id_email (manuscript_notification_id ASC, email ASC),
  CONSTRAINT fk_manuscript_notification_email_manuscript_notification_id
    FOREIGN KEY (manuscript_notification_id)
    REFERENCES manuscript_notification (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
