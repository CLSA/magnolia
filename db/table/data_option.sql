CREATE TABLE data_option (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  data_category_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  cost_combined tinyint(1) NOT NULL DEFAULT 0,
  justification tinyint(1) NOT NULL DEFAULT 0,
  name_en varchar(127) NOT NULL,
  name_fr varchar(127) NOT NULL,
  condition_en text DEFAULT NULL,
  condition_fr text DEFAULT NULL,
  note_en text DEFAULT NULL,
  note_fr text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name_en (name_en),
  UNIQUE KEY uq_name_fr (name_fr),
  UNIQUE KEY uq_data_category_id_rank (data_category_id,rank),
  KEY fk_data_category_id (data_category_id),
  CONSTRAINT fk_data_option_data_category_id
    FOREIGN KEY (data_category_id)
    REFERENCES data_category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;