CREATE TABLE manuscript_notification_email (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_notification_id int(10) unsigned NOT NULL,
  email varchar(127) NOT NULL,
  name varchar(127) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_manuscript_notification_id_email (manuscript_notification_id,email),
  KEY fk_manuscript_notification_id (manuscript_notification_id),
  CONSTRAINT fk_manuscript_notification_email_manuscript_notification_id
    FOREIGN KEY (manuscript_notification_id)
    REFERENCES manuscript_notification (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
