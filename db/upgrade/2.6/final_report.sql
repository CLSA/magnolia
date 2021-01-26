DROP PROCEDURE IF EXISTS patch_final_report;
DELIMITER //
CREATE PROCEDURE patch_final_report()
  BEGIN

    SELECT "Adding new version column to final_report table" AS "";

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "final_report"
    AND column_name = "version";

    IF @test = 0 THEN
      ALTER TABLE final_report
      ADD COLUMN version INT(10) UNSIGNED NOT NULL DEFAULT 1
      AFTER reqn_id;

      ALTER TABLE final_report
      DROP INDEX uq_reqn_id,
      ADD UNIQUE INDEX uq_reqn_id_version (reqn_id ASC, version ASC);
    END IF;

  END //
DELIMITER ;

CALL patch_final_report();
DROP PROCEDURE IF EXISTS patch_final_report;


DELIMITER $$

DROP TRIGGER IF EXISTS final_report_AFTER_INSERT$$
CREATE DEFINER = CURRENT_USER TRIGGER final_report_AFTER_INSERT AFTER INSERT ON final_report FOR EACH ROW
BEGIN
  CALL update_reqn_current_final_report( NEW.reqn_id );
END$$

DROP TRIGGER IF EXISTS final_report_AFTER_DELETE$$
CREATE DEFINER = CURRENT_USER TRIGGER final_report_AFTER_DELETE AFTER DELETE ON final_report FOR EACH ROW
BEGIN
  CALL update_reqn_current_final_report( OLD.reqn_id );
END$$

DELIMITER ;
