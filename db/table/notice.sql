CREATE TABLE notice (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  reqn_id int(10) unsigned NOT NULL,
  datetime datetime NOT NULL,
  title varchar(127) NOT NULL,
  description text NOT NULL,
  PRIMARY KEY (id),
  KEY fk_reqn_id (reqn_id),
  CONSTRAINT fk_notice_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;