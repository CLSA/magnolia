CREATE TABLE manuscript_stage_type (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  phase enum('new','review','complete') NOT NULL,
  rank int(10) unsigned NOT NULL,
  name varchar(45) NOT NULL,
  status varchar(45) DEFAULT NULL,
  notification_type_id int(10) unsigned DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY rank_UNIQUE (rank),
  UNIQUE KEY name_UNIQUE (name),
  KEY fk_notification_type_id (notification_type_id),
  CONSTRAINT fk_manuscript_stage_type_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES notification_type (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;