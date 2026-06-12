CREATE TABLE output_type (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  name_en varchar(127) NOT NULL,
  name_fr varchar(127) NOT NULL,
  note_en varchar(255) DEFAULT NULL,
  note_fr varchar(255) DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name_en (name_en),
  UNIQUE KEY uq_name_fr (name_fr)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
