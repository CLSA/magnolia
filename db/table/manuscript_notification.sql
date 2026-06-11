CREATE TABLE manuscript_notification (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_id int(10) unsigned NOT NULL,
  notification_type_id int(10) unsigned NOT NULL,
  datetime datetime NOT NULL,
  sent tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  KEY fk_manuscript_id (manuscript_id),
  KEY fk_notification_type_id (notification_type_id),
  CONSTRAINT fk_manuscript_notification_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_manuscript_notification_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES notification_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;