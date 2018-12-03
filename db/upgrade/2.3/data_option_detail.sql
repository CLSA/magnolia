DROP PROCEDURE IF EXISTS add_data_option_detail;
DELIMITER //
CREATE PROCEDURE add_data_option_detail( option VARCHAR(127), detail_en VARCHAR(127), detail_fr VARCHAR(127) )
  BEGIN

    SELECT COUNT(*) INTO @total FROM data_option_detail WHERE name_en = detail_en;
    IF @total = 0 THEN
      SELECT id INTO @data_option_id FROM data_option WHERE name_en = option;
      SELECT MAX( rank ) + 1 INTO @rank FROM data_option_detail WHERE data_option_id = @data_option_id;
      INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
      ( @data_option_id, @rank, detail_en, detail_fr );

      -- add footnotes to the new data_option_details
      IF option = "Bone Density by DEXA" THEN
        INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
        SELECT data_option_detail.id, footnote.id
        FROM data_option_detail, footnote
        WHERE data_option_detail.id = LAST_INSERT_ID()
        AND data_option_detail.name_en NOT LIKE "Medication%"
        AND (
          footnote.note_en = "Bone Density by DEXA." OR
          footnote.note_en LIKE "Images and raw data are available %"
        )
        ORDER BY footnote.note_en;
      ELSEIF option = "Physical Health II" THEN
        INSERT IGNORE INTO data_option_detail_has_footnote( data_option_detail_id, footnote_id )
        SELECT data_option_detail.id, footnote.id
        FROM data_option_detail, footnote
        WHERE data_option_detail.id = LAST_INSERT_ID()
        AND data_option_detail.name_en NOT LIKE "Medication%"
        AND footnote.note_en LIKE "Disease Algorithms and Disease Symptoms - %";
      END IF;

    END IF;

  END //
DELIMITER ;

DROP PROCEDURE IF EXISTS move_data_option_details;
DELIMITER //
CREATE PROCEDURE move_data_option_details( old_data_option VARCHAR(127), new_data_option VARCHAR(127) )
  BEGIN

    SELECT id INTO @old_data_option_id FROM data_option WHERE name_en = old_data_option;
    SELECT id INTO @new_data_option_id FROM data_option WHERE name_en = new_data_option;
    IF @old_data_option_id IS NOT NULL THEN
      SELECT MAX(rank) INTO @max_rank FROM data_option_detail WHERE data_option_id = @new_data_option_id;
      UPDATE data_option_detail
      SET rank = rank + @max_rank, data_option_id = @new_data_option_id
      WHERE data_option_id = @old_data_option_id;
    END IF;

  END //
DELIMITER ;

DELETE FROM data_option_detail WHERE name_en = "Disease Algorithms and Disease Symptoms";

CALL add_data_option_detail( "Socio-Demographic Characteristics", "Gender Identity (GED)", "" );
CALL add_data_option_detail( "Lifestyle and Behaviour", "Dietary Supplement Use (DSU; TRM)", "Usage de suppléments alimentaires (DSU; TRM)" );
CALL add_data_option_detail( "Physical Health I", "Preventative Health Behaviours (PHB)", "" );
CALL add_data_option_detail( "Physical Health I", "Hearing Handicap Inventory for the Elderly (HRG)", "" );
CALL add_data_option_detail( "Physical Health I", "Unmet Health Care Needs (MET)", "" );
CALL add_data_option_detail( "Physical Health II", "Epilepsy (EPI)", "" );
CALL add_data_option_detail( "Psychological Health", "Loneliness Scale (LON)", "" );
CALL add_data_option_detail( "Psychological Health", "Childhood Maltreatment and Health Across the Lifespan (CEX)", "" );
CALL add_data_option_detail( "Psychological Health", "Elder Abuse (PSY)", "" );
CALL add_data_option_detail( "Cognition - metadata & scores", "Meta Memory (MEM)", "" );
CALL add_data_option_detail( "Cognition - metadata & scores", "Subjective Cognitive Decline (SCD)", "" );
CALL add_data_option_detail( "Labour Force", "Work Limitations Questionnaire (WLQ)", "" );
CALL add_data_option_detail( "Social Health", "Social Cohesion (SPA)", "" );
CALL add_data_option_detail( "Bone Density by DEXA", "Dual Hip (not yet available)", "Deux hanches (pas encore disponible)" );
CALL add_data_option_detail( "Bone Density by DEXA", "Forearm (not yet available)", "Avant-bras (pas encore disponible)" );
DROP PROCEDURE add_data_option_detail;

SELECT "Moving data_option_details from defunct data_options" AS "";

CALL move_data_option_details( "Self-reported Chronic Conditions", "Physical Health I" );
CALL move_data_option_details( "Bio-Impedance by DEXA", "Physical Assessments I" );
CALL move_data_option_details( "Bone Density by DEXA", "Physical Assessments II" );
DROP PROCEDURE move_data_option_details;
