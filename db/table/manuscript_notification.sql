CREATE TABLE manuscript_notification (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  notification_type_id INT(10) UNSIGNED NOT NULL,
  datetime DATETIME NOT NULL,
  sent TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  INDEX fk_manuscript_id (manuscript_id ASC),
  INDEX fk_notification_type_id (notification_type_id ASC),
  CONSTRAINT fk_manuscript_notification_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES magnolia.manuscript (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_manuscript_notification_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES magnolia.notification_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
