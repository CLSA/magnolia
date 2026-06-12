CREATE TABLE manuscript_review (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  manuscript_id int(10) unsigned NOT NULL,
  manuscript_review_type_id int(10) unsigned NOT NULL,
  user_id int(10) unsigned DEFAULT NULL,
  datetime datetime NOT NULL,
  manuscript_recommendation_type_id int(10) unsigned DEFAULT NULL,
  note text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_manuscript_id_manuscript_review_type_id (manuscript_id,manuscript_review_type_id),
  KEY fk_user_id (user_id),
  KEY fk_manuscript_review_type_id (manuscript_review_type_id),
  KEY fk_manuscript_recommendation_type_id (manuscript_recommendation_type_id),
  KEY fk_manuscript_id (manuscript_id),
  CONSTRAINT fk_manuscript_review_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES manuscript (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT fk_manuscript_review_manuscript_recommendation_type_id
    FOREIGN KEY (manuscript_recommendation_type_id)
    REFERENCES manuscript_recommendation_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_review_manuscript_review_type_id
    FOREIGN KEY (manuscript_review_type_id)
    REFERENCES manuscript_review_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_review_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
