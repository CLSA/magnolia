CREATE TABLE notice_has_user (
  notice_id int(10) unsigned NOT NULL,
  user_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (notice_id,user_id),
  KEY fk_user_id (user_id),
  KEY fk_notice_id (notice_id),
  CONSTRAINT fk_notice_has_user_notice_id
    FOREIGN KEY (notice_id)
    REFERENCES notice (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_notice_has_user_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
