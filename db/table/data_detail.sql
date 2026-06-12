CREATE TABLE data_detail (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  data_selection_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  name_en varchar(127) NOT NULL,
  name_fr varchar(127) NOT NULL,
  note_en text DEFAULT NULL,
  note_fr text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_data_selection_id_rank (data_selection_id,rank),
  KEY fk_data_selection_id (data_selection_id),
  CONSTRAINT fk_data_detail_data_selection_id
    FOREIGN KEY (data_selection_id)
    REFERENCES data_selection (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
