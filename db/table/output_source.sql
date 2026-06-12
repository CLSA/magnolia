CREATE TABLE output_source (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  output_id int(10) unsigned NOT NULL,
  filename varchar(255) DEFAULT NULL,
  data longtext DEFAULT NULL,
  url varchar(1023) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_output_id (output_id),
  CONSTRAINT fk_output_source_output_id
    FOREIGN KEY (output_id)
    REFERENCES output (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
