CREATE TABLE data_category (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  rank int(10) unsigned NOT NULL,
  comment tinyint(1) NOT NULL DEFAULT 0,
  name_en varchar(127) NOT NULL,
  name_fr varchar(127) NOT NULL,
  condition_en text DEFAULT NULL,
  condition_fr text DEFAULT NULL,
  note_en text DEFAULT NULL,
  note_fr text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_rank (rank),
  UNIQUE KEY uq_name_en (name_en),
  UNIQUE KEY uq_name_fr (name_fr)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
