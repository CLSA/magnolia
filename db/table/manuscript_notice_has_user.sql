CREATE TABLE manuscript_notice_has_user (
  manuscript_notice_id int(10) unsigned NOT NULL,
  user_id int(10) unsigned NOT NULL,
  update_timestamp timestamp NOT NULL DEFAULT current_timestamp()
    ON UPDATE current_timestamp(),
  create_timestamp timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (manuscript_notice_id,user_id),
  KEY fk_user_id (user_id),
  KEY fk_manuscript_notice_id (manuscript_notice_id),
  CONSTRAINT fk_manuscript_notice_has_user_manuscript_notice_id
    FOREIGN KEY (manuscript_notice_id)
    REFERENCES manuscript_notice (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_manuscript_notice_has_user_user_id
    FOREIGN KEY (user_id)
    REFERENCES cenozo_mg.user (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;