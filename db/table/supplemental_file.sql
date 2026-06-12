CREATE TABLE supplemental_file (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  name_en varchar(127) NOT NULL,
  name_fr varchar(127) NOT NULL,
  data_en longtext NOT NULL,
  data_fr longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name_en (name_en),
  UNIQUE KEY uq_name_fr (name_fr)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
