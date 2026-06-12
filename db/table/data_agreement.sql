CREATE TABLE data_agreement (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  institution varchar(127) NOT NULL,
  cross_institution_data_access tinyint(1) NOT NULL DEFAULT 1,
  start_date date NOT NULL,
  end_date date DEFAULT NULL,
  data longtext NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_institution_start_date (institution,start_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
