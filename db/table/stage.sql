CREATE TABLE stage (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  amendment_id INT(10) UNSIGNED NOT NULL,
  stage_type_id INT(10) UNSIGNED NOT NULL,
  user_id INT(10) UNSIGNED NULL DEFAULT NULL,
  datetime DATETIME NULL DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX fk_stage_type_id (stage_type_id ASC),
  INDEX fk_user_id (user_id ASC),
  INDEX fk_amendment_id (amendment_id ASC),
  UNIQUE INDEX uq_amendment_id_stage_type_id (amendment_id ASC, stage_type_id ASC),
  CONSTRAINT fk_stage_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES magnolia.stage_type (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo.user (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_stage_amendment_id
    FOREIGN KEY (amendment_id)
    REFERENCES magnolia.amendment (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
