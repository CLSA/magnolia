SELECT "Creating new notification_type_email table" AS "";

CREATE TABLE IF NOT EXISTS notification_type_email (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  notification_type_id INT UNSIGNED NOT NULL,
  email VARCHAR(127) NULL,
  blind TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_notification_type_id (notification_type_id ASC),
  INDEX uq_notification_type_id_email (notification_type_id ASC, email ASC),
  CONSTRAINT fk_notification_type_email_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES notification_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;
