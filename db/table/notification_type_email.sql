CREATE TABLE notification_type_email (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  notification_type_id INT(10) UNSIGNED NOT NULL,
  email VARCHAR(127) NULL DEFAULT NULL,
  blind TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_notification_type_id_email (notification_type_id ASC, email ASC),
  INDEX fk_notification_type_id (notification_type_id ASC),
  CONSTRAINT fk_notification_type_email_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES magnolia.notification_type (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
