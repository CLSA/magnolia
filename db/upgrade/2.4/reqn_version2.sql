DROP PROCEDURE IF EXISTS patch_reqn_version;
DELIMITER //
CREATE PROCEDURE patch_reqn_version()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn_version"
    AND column_name = "part2_f_comment";

    IF @test THEN

      SELECT "Merging comments from part2 c and d" AS "";

      UPDATE reqn_version
      SET part2_c_comment = CONCAT_WS( "\n", part2_c_comment, part2_d_comment )
      WHERE part2_c_comment IS NOT NULL
         OR part2_d_comment IS NOT NULL;

      SELECT "Transferring comments back by one category" AS "";

      UPDATE reqn_version SET part2_d_comment = part2_e_comment;
      UPDATE reqn_version SET part2_e_comment = part2_f_comment;

      SELECT "Removing part2_f_comment column from reqn_version table" AS "";

      ALTER TABLE reqn_version DROP COLUMN part2_f_comment;

    END IF;

  END //
DELIMITER ;

CALL patch_reqn_version();
DROP PROCEDURE IF EXISTS patch_reqn_version;
