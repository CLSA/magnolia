CREATE TABLE role_has_review_type (
  role_id INT(10) UNSIGNED NOT NULL,
  review_type_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (role_id, review_type_id),
  INDEX fk_review_type_id (review_type_id ASC),
  INDEX fk_role_id (role_id ASC),
  CONSTRAINT fk_role_has_review_type_review_type_id
    FOREIGN KEY (review_type_id)
    REFERENCES magnolia.review_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_role_has_review_type_role_id
    FOREIGN KEY (role_id)
    REFERENCES cenozo.role (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
