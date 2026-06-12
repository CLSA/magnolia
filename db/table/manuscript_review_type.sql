CREATE TABLE manuscript_review_type (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  name varchar(45) NOT NULL,
  manuscript_stage_type_id int(10) unsigned NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_name (name),
  KEY fk_manuscript_stage_type_id (manuscript_stage_type_id),
  CONSTRAINT fk_manuscript_review_type_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
