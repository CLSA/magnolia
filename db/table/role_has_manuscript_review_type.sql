CREATE TABLE role_has_manuscript_review_type (
  role_id int(10) unsigned NOT NULL,
  manuscript_review_type_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (role_id,manuscript_review_type_id),
  KEY fk_manuscript_review_type_id (manuscript_review_type_id),
  KEY fk_role_id (role_id),
  CONSTRAINT fk_role_has_manuscript_review_type_review_type_id
    FOREIGN KEY (manuscript_review_type_id)
    REFERENCES manuscript_review_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_role_has_manuscript_review_type_role_id
    FOREIGN KEY (role_id)
    REFERENCES cenozo_mg.role (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
