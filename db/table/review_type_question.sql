CREATE TABLE review_type_question (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  review_type_id INT(10) UNSIGNED NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  question TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_review_type_id_rank (review_type_id ASC, rank ASC),
  INDEX fk_review_type_id (review_type_id ASC),
  CONSTRAINT fk_review_type_question_review_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES magnolia.review_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
