CREATE TABLE manuscript_stage_type_has_manuscript_stage_type (
  manuscript_stage_type_id int(10) unsigned NOT NULL,
  next_manuscript_stage_type_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (manuscript_stage_type_id,next_manuscript_stage_type_id),
  KEY fk_manuscript_stage_type_id (next_manuscript_stage_type_id),
  KEY fk_next_manuscript_stage_type_id (manuscript_stage_type_id),
  CONSTRAINT fk_mst_has_mst_manuscript_stage_type_id
    FOREIGN KEY (manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_mst_has_mst_next_manuscript_stage_type_id
    FOREIGN KEY (next_manuscript_stage_type_id)
    REFERENCES manuscript_stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
