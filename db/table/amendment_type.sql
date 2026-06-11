CREATE TABLE amendment_type (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  rank int(10) unsigned NOT NULL,
  new_user enum('applicant','trainee') DEFAULT NULL,
  show_in_description tinyint(1) NOT NULL DEFAULT 0,
  reason_en varchar(127) NOT NULL,
  reason_fr varchar(127) NOT NULL,
  justification_prompt_en text DEFAULT NULL,
  justification_prompt_fr text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_reason_en (reason_en),
  UNIQUE KEY uq_reason_fr (reason_fr),
  UNIQUE KEY uq_rank (rank)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;