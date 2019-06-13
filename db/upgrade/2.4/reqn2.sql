DROP PROCEDURE IF EXISTS patch_reqn;
DELIMITER //
CREATE PROCEDURE patch_reqn()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.COLUMNS
    WHERE table_schema = DATABASE()
    AND table_name = "reqn"
    AND column_name = "deferral_note_2f";

    IF @test THEN

      SELECT "Merging deferral notes from part2 c and d" AS "";

      UPDATE reqn
      SET deferral_note_2c = CONCAT_WS( "\n", deferral_note_2c, deferral_note_2d )
      WHERE deferral_note_2c IS NOT NULL
         OR deferral_note_2d IS NOT NULL;

      SELECT "Transferring deferral notes back by one category" AS "";

      UPDATE reqn SET deferral_note_2d = deferral_note_2e;
      UPDATE reqn SET deferral_note_2e = deferral_note_2f;

      SELECT "Removing deferral_note_2f column from reqn table" AS "";

      ALTER TABLE reqn DROP COLUMN deferral_note_2f;

    END IF;

  END //
DELIMITER ;

CALL patch_reqn();
DROP PROCEDURE IF EXISTS patch_reqn;
