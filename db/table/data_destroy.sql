CREATE TABLE data_destroy (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  name varchar(127) NOT NULL,
  datetime datetime DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reqn_id_name (reqn_id,name),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_data_destry_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;