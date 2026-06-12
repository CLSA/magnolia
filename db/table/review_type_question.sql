CREATE TABLE review_type_question (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  review_type_id int(10) unsigned NOT NULL,
  rank int(10) unsigned NOT NULL,
  question text NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_type_id_rank (review_type_id,rank),
  KEY fk_review_type_id (review_type_id),
  CONSTRAINT fk_review_type_question_review_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES review_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
