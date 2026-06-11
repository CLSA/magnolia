CREATE TABLE review_answer (
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  review_id int(10) unsigned NOT NULL,
  review_type_question_id int(10) unsigned NOT NULL,
  answer tinyint(1) DEFAULT NULL,
  comment text DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_review_id_review_type_question_id (review_id,review_type_question_id),
  KEY fk_review_id (review_id),
  KEY fk_review_type_question_id (review_type_question_id),
  CONSTRAINT fk_review_answer_review_id
    FOREIGN KEY (review_id)
    REFERENCES review (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_review_answer_review_type_question_id
    FOREIGN KEY (review_type_question_id)
    REFERENCES review_type_question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;