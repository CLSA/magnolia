CREATE TABLE review (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  amendment_id INT(10) UNSIGNED NOT NULL,
  review_type_id INT(10) UNSIGNED NOT NULL,
  user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  datetime DATETIME NOT NULL,
  recommendation_type_id INT(10) UNSIGNED NULL DEFAULT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_review_review_type_id (review_type_id ASC),
  INDEX fk_recommendation_type_id (recommendation_type_id ASC),
  INDEX fk_amendment_id (amendment_id ASC),
  INDEX uq_amenment_id_review_type_id (amendment_id ASC, review_type_id ASC),
  CONSTRAINT fk_review_recommendation_type_id
    FOREIGN KEY (recommendation_type_id)
    REFERENCES magnolia.recommendation_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_review_review_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES magnolia.review_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_review_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_review_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES magnolia.amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
