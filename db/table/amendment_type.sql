CREATE TABLE amendment_type (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  rank INT(10) UNSIGNED NOT NULL,
  new_user ENUM("applicant", "trainee") NULL DEFAULT NULL,
  show_in_description TINYINT(1) NOT NULL DEFAULT 0,
  reason_en VARCHAR(127) NOT NULL,
  reason_fr VARCHAR(127) NOT NULL,
  justification_prompt_en TEXT NULL DEFAULT NULL,
  justification_prompt_fr TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_reason_en (reason_en ASC),
  UNIQUE INDEX uq_reason_fr (reason_fr ASC),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
