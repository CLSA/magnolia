SELECT "Creating new update_manuscript_current_manuscript_version procedure" AS "";

DELIMITER $$

DROP PROCEDURE IF EXISTS update_manuscript_current_manuscript_version$$
CREATE DEFINER=CURRENT_USER PROCEDURE update_manuscript_current_manuscript_version(IN proc_manuscript_id INT(10) UNSIGNED)
BEGIN
  REPLACE INTO manuscript_current_manuscript_version( manuscript_id, manuscript_version_id )
  SELECT manuscript.id, manuscript_version.id
  FROM manuscript
  LEFT JOIN manuscript_version ON manuscript.id = manuscript_version.manuscript_id
  AND manuscript_version.version <=> (
    SELECT MAX( version )
    FROM manuscript_version
    WHERE manuscript.id = manuscript_version.manuscript_id
    GROUP BY manuscript_version.manuscript_id
    LIMIT 1
  )
  WHERE manuscript.id = proc_manuscript_id;
END$$

DELIMITER ;
