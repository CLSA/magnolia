CREATE TABLE manuscript_review (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  manuscript_id INT(10) UNSIGNED NOT NULL,
  manuscript_review_type_id INT(10) UNSIGNED NOT NULL,
  user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  datetime DATETIME NOT NULL,
  manuscript_recommendation_type_id INT(10) UNSIGNED NULL DEFAULT NULL,
  note TEXT NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_manuscript_review_type_id (manuscript_review_type_id ASC),
  INDEX fk_manuscript_recommendation_type_id (manuscript_recommendation_type_id ASC),
  UNIQUE INDEX uq_manuscript_id_manuscript_review_type_id (manuscript_id ASC, manuscript_review_type_id ASC),
  INDEX fk_manuscript_id (manuscript_id ASC),
  CONSTRAINT fk_manuscript_review_manuscript_recommendation_type_id
    FOREIGN KEY (manuscript_recommendation_type_id)
    REFERENCES magnolia.manuscript_recommendation_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_review_manuscript_review_type_id
    FOREIGN KEY (manuscript_review_type_id)
    REFERENCES magnolia.manuscript_review_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_review_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_review_manuscript_id
    FOREIGN KEY (manuscript_id)
    REFERENCES magnolia.manuscript (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
