DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    SELECT "Replacing part2_e_comment with individual columns in reqn_version table" AS "";
    
    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_e_comment";

    IF @test = 1 THEN
      ALTER TABLE reqn_version
      ADD COLUMN cimt TINYINT(1) NOT NULL DEFAULT 0 AFTER part2_d_comment,
      ADD COLUMN cimt_justification TEXT NULL DEFAULT NULL AFTER cimt,
      ADD COLUMN dxa TINYINT(1) NOT NULL DEFAULT 0 AFTER cimt_justification,
      ADD COLUMN dxa_justification TEXT NULL DEFAULT NULL AFTER dxa,
      ADD COLUMN ecg TINYINT(1) NOT NULL DEFAULT 0 AFTER dxa_justification,
      ADD COLUMN ecg_justification TEXT NULL DEFAULT NULL AFTER ecg,
      ADD COLUMN retinal TINYINT(1) NOT NULL DEFAULT 0 AFTER ecg_justification,
      ADD COLUMN retinal_justification TEXT NULL DEFAULT NULL AFTER retinal,
      ADD COLUMN spirometry TINYINT(1) NOT NULL DEFAULT 0 AFTER retinal_justification,
      ADD COLUMN spirometry_justification TEXT NULL DEFAULT NULL AFTER spirometry,
      ADD COLUMN tonometry TINYINT(1) NOT NULL DEFAULT 0 AFTER spirometry_justification,
      ADD COLUMN tonometry_justification TEXT NULL DEFAULT NULL AFTER tonometry,
      ADD COLUMN fsa TINYINT(1) NOT NULL DEFAULT 0 AFTER tonometry_justification,
      ADD COLUMN fsa_justification TEXT NULL DEFAULT NULL AFTER fsa,
      ADD COLUMN csd TINYINT(1) NOT NULL DEFAULT 0 AFTER fsa_justification,
      ADD COLUMN csd_justification TEXT NULL DEFAULT NULL AFTER csd;

      SELECT "Moving all part2e comments to the cimt justification" AS "";

      UPDATE reqn_version SET cimt = 1, cimt_justification = part2_e_comment;

      ALTER TABLE reqn_version DROP COLUMN part2_e_comment;`
    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
