SELECT "Creating new notification_email table" AS "";

CREATE TABLE IF NOT EXISTS notification_email (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  notification_id INT UNSIGNED NOT NULL,
  email VARCHAR(127) NOT NULL,
  name VARCHAR(127) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_notification_id (notification_id ASC),
  UNIQUE INDEX uq_notification_id_email (notification_id ASC, email ASC),
  CONSTRAINT fk_notification_email_notification_id
    FOREIGN KEY (notification_id)
    REFERENCES notification (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
