CREATE TABLE manuscript_notice_has_user (
  manuscript_notice_id INT(10) UNSIGNED NOT NULL,
  user_id INT(10) UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  PRIMARY KEY (manuscript_notice_id, user_id),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_manuscript_notice_id (manuscript_notice_id ASC),
  CONSTRAINT fk_manuscript_notice_has_user_manuscript_notice_id
    FOREIGN KEY (manuscript_notice_id)
    REFERENCES magnolia.manuscript_notice (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_notice_has_user_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_general_ci;
