CREATE TABLE stage_type (
  id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP(),
  create_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP(),
  phase ENUM('new', 'review', 'active', 'finalization', 'complete') NOT NULL,
  rank INT(10) UNSIGNED NOT NULL,
  name VARCHAR(45) NOT NULL,
  status VARCHAR(45) NOT NULL,
  notification_type_id INT(10) UNSIGNED NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC),
  UNIQUE INDEX uq_rank (rank ASC),
  INDEX fk_notification_type_id (notification_type_id ASC),
  CONSTRAINT fk_stage_type_notification_type_id
    FOREIGN KEY (notification_type_id)
    REFERENCES magnolia.notification_type (id)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4;
