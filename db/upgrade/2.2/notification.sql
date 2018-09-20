SELECT "Creating new notification table" AS "";

CREATE TABLE IF NOT EXISTS notification (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  notification_type_id INT UNSIGNED NOT NULL,
  email VARCHAR(127) NOT NULL,
  datetime DATETIME NOT NULL,
  sent TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  INDEX fk_notification_type_id (notification_type_id ASC),
  CONSTRAINT fk_notification_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_notification_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES notification_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;
