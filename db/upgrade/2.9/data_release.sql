DROP PROCEDURE IF EXISTS patch_data_release;
DELIMITER //
CREATE PROCEDURE patch_data_release()
  BEGIN

    SELECT "Adding new unique key to data_release table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.KEY_COLUMN_USAGE
    WHERE constraint_schema = DATABASE()
    AND constraint_name = "uq_reqn_id_data_version_id_date";

    IF @test = 0 THEN
      -- delete all duplicates
      DELETE duplicate
      FROM data_release AS duplicate
      INNER JOIN data_release USING (reqn_id, data_version_id, date)
      WHERE duplicate.id != data_release.id;

      -- now add the unique index
      ALTER TABLE data_release
      ADD UNIQUE INDEX uq_reqn_id_data_version_id_date (reqn_id, data_version_id, date );
    END IF;

  END //
DELIMITER ;

CALL patch_data_release();
DROP PROCEDURE IF EXISTS patch_data_release;
