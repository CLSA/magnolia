DROP PROCEDURE IF EXISTS patch_data_option_category;
DELIMITER //
CREATE PROCEDURE patch_data_option_category()
  BEGIN

    SELECT "Removing Genomics data option category" AS "";

    SELECT COUNT(*) INTO @test
    FROM data_option_category
    WHERE name_en = "Genomics";

    IF @test THEN
      DELETE FROM data_option_category WHERE name_en = "Genomics";
      UPDATE data_option_category SET rank = 4 WHERE rank = 5;
      UPDATE data_option_category SET rank = 5 WHERE rank = 6;
    END IF;

  END //
DELIMITER ;

CALL patch_data_option_category();
DROP PROCEDURE IF EXISTS patch_data_option_category;
