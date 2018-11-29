DROP PROCEDURE IF EXISTS patch_footnote;
DELIMITER //
CREATE PROCEDURE patch_footnote()
  BEGIN

    SELECT "Adding new footnotes" AS "";

    SELECT COUNT(*) INTO @test FROM footnote WHERE note_en = "Self-reported Chronic Condition";
    IF @test = 0 THEN
      INSERT INTO footnote SET note_en = "Self-reported Chronic Condition", note_fr = "Problème de santé chronique autodéclaré";
    END IF;

    SELECT COUNT(*) INTO @test FROM footnote WHERE note_en = "Bio-Impedance by DEXA.";
    IF @test = 0 THEN
      INSERT INTO footnote SET note_en = "Bio-Impedance by DEXA.", note_fr = "Bio-impédance par DEXA.";
    END IF;

    SELECT COUNT(*) INTO @test FROM footnote WHERE note_en = "Bone Density by DEXA.";
    IF @test = 0 THEN
      INSERT INTO footnote SET note_en = "Bone Density by DEXA.", note_fr = "Densité osseuse par DEXA.";
    END IF;
  END //
DELIMITER ;

CALL patch_footnote();
DROP PROCEDURE IF EXISTS patch_footnote;

SELECT "Making small changes to footnotes" AS "";

UPDATE footnote
SET note_fr = "In order to assess Functional Status (FUL) in Comprehensive participants who benefited from an accommodation strategy (ex. DCS by phone), this questionnaire was administered. For 134 participants, the baseline DCS visit was completed by phone for various reasons including time constraints for recruitment fulfillment toward the end of Baseline data collection and some cases where the participants were unable to physically present at the DCS but wished to remain part of CLSA. For 2 participants, the Baseline DCS site visit was completed in person at the participant’s residence as a pilot for the DCS at home. For 1 participant, the Baseline DCS consisted of a DCS site visit for the collection of physical measures with the questionnaires being administered by phone."
WHERE note_en LIKE "In order to assess Functional Status %";

UPDATE footnote
SET note_en = CONCAT( "Disease Algorithms and Disease Symptoms - ", note_en ),
    note_fr = CONCAT( "Algorithmes et symptômes de maladies - ", note_fr )
WHERE note_en LIKE "The disease ascertainment %";
