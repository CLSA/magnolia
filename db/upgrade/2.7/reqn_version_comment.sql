DROP PROCEDURE IF EXISTS patch_reqn_version_comment;
DELIMITER //
CREATE PROCEDURE patch_reqn_version_comment()
  BEGIN

    SELECT "Renaming data_option_category table to data_category" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version_comment"
    AND column_name = "data_option_category_id";

    IF 0 < @test THEN
      ALTER TABLE reqn_version_comment
        DROP CONSTRAINT fk_reqn_version_comment_data_option_category_id,
        DROP INDEX fk_data_option_category_id,
        DROP INDEX uq_reqn_version_id_data_option_category_id;

      ALTER TABLE reqn_version_comment CHANGE data_option_category_id data_category_id INT(10) UNSIGNED NOT NULL;
      ALTER TABLE reqn_version_comment
        ADD INDEX fk_data_category_id (data_category_id ASC),
        ADD UNIQUE INDEX uq_reqn_version_id_data_category_id (reqn_version_id ASC, data_category_id ASC),
        ADD CONSTRAINT fk_reqn_version_comment_data_category_id
          FOREIGN KEY (data_category_id)
          REFERENCES data_category (id)
          ON DELETE NO ACTION
          ON UPDATE NO ACTION;
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version_comment();
DROP PROCEDURE IF EXISTS patch_reqn_version_comment;
