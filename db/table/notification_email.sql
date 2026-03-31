CREATE TABLE notification_email (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  notification_id INT(10) UNSIGNED NOT NULL,
  email VARCHAR(127) NOT NULL,
  name VARCHAR(127) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_notification_id_email (notification_id ASC, email ASC),
  INDEX fk_notification_id (notification_id ASC),
  CONSTRAINT fk_notification_email_notification_id
    FOREIGN KEY (notification_id)
    REFERENCES magnolia.notification (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
