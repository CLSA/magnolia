CREATE TABLE review_answer (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  review_id INT(10) UNSIGNED NOT NULL,
  review_type_question_id INT(10) UNSIGNED NOT NULL,
  answer TINYINT(1) NULL DEFAULT NULL,
  comment TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_review_id_review_type_question_id (review_id ASC, review_type_question_id ASC),
  INDEX fk_review_id (review_id ASC),
  INDEX fk_review_type_question_id (review_type_question_id ASC),
  CONSTRAINT fk_review_answer_review_id
    FOREIGN KEY (review_id)
    REFERENCES magnolia.review (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_review_answer_review_type_question_id
    FOREIGN KEY (review_type_question_id)
    REFERENCES magnolia.review_type_question (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
