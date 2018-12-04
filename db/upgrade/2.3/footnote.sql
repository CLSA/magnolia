DROP PROCEDURE IF EXISTS patch_footnote;
DELIMITER //
CREATE PROCEDURE patch_footnote()
  BEGIN

    SELECT COUNT(*) INTO @test
    FROM information_schema.TABLES
    WHERE table_schema = DATABASE()
    AND table_name = "footnote";

    IF @test THEN
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

      SELECT "Making small changes to footnotes" AS "";

      UPDATE footnote
      SET note_fr = "In order to assess Functional Status (FUL) in Comprehensive participants who benefited from an accommodation strategy (ex. DCS by phone), this questionnaire was administered. For 134 participants, the baseline DCS visit was completed by phone for various reasons including time constraints for recruitment fulfillment toward the end of Baseline data collection and some cases where the participants were unable to physically present at the DCS but wished to remain part of CLSA. For 2 participants, the Baseline DCS site visit was completed in person at the participant’s residence as a pilot for the DCS at home. For 1 participant, the Baseline DCS consisted of a DCS site visit for the collection of physical measures with the questionnaires being administered by phone."
      WHERE note_en LIKE "In order to assess Functional Status %";

      UPDATE footnote
      SET note_en = "Height and Weight data are collected during the DCS visit.",
          note_fr = "Les données sur la taille et le poids font partie des mesures prises lors de la visite au Site de collecte de données."
      WHERE note_en LIKE "Height and Weight %";

      UPDATE footnote
      SET note_en = "Baseline - To assess Functional Status (FUL) in Comprehensive participants who benefited from an accommodation strategy (e.g. DCS by phone), this questionnaire was administered. For 134 participants, the baseline DCS visit was completed by phone for various reasons including time constraints for recruitment fulfillment toward the end of Baseline data collection and some cases where the participants were unable to physically present at the DCS but wished to remain part of CLSA. For 2 participants, the Baseline DCS site visit was completed in person at the participant’s residence as a pilot for the DCS at home. For 1 participant, the Baseline DCS consisted of a DCS site visit for the collection of physical measures with the questionnaires being administered by phone.",
          note_fr = "Vague de départ – Les participants de l’évaluation globale ayant bénéficié d'un accommodement (p. ex. entrevue par téléphone) ont fait ce questionnaire afin d'évaluer leur état fonctionnel (FUL). Pour 134 participants de l’évaluation globale, la visite initiale au Site de collecte de données a été réalisée par téléphone pour diverses raisons, y compris des contraintes de temps liées au recrutement vers la fin de la collecte des données de départ ou des participants ne pouvant pas se présenter physiquement au site, mais souhaitant faire partie de l'ÉLCV. Pour 2 participants, la visite initiale au Site de collecte de données a été faite en personne à leur résidence dans le cadre de l’étude pilote de l’entrevue du site réalisée à domicile. Pour 1 participant, la visite initiale au Site de collecte de données a servi uniquement à prendre les mesures physiques et les questionnaires ont été faits par téléphone."
      WHERE note_en LIKE "In order to assess %";

      UPDATE footnote
      SET note_en = "For a detailed list of the linked variables please consult the Linked Data Summary Table available in the Data and Sample Access Documents under the Data Access tab of the CLSA website.",
          note_fr = "Pour obtenir une liste détaillée des variables liées, veuillez consulter le tableau récapitulatif des données liées disponible à la section Documents d’accès aux données et aux échantillons de l’onglet Accès aux données du site Web de l'ÉLCV."
      WHERE note_en LIKE "For a detailed list of the linked variables %";

      UPDATE footnote
      SET note_en = "When requesting these data, please note that if your CLSA Data and Biospecimen Request Application is approved, you will also be required to sign a Data Sharing and Use via Approved Third Party Agreement (available for consultation and download here: http://canue.ca/data/ ), and submit it to the CLSA.",
          note_fr = "Lorsque vous demandez l’accès à ces données, veuillez noter que si votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV est approuvée, vous devrez également signer une Entente de partage et d'utilisation des données via une tierce partie autorisée (disponible pour consultation et téléchargement ici : http://canue.ca/data/ ) et la soumettre à l'ÉLCV."
      WHERE note_en LIKE "When requesting these data, %";

      UPDATE footnote
      SET note_en = CONCAT( "Disease Algorithms and Disease Symptoms - ", note_en ),
          note_fr = CONCAT( "Algorithmes et symptômes de maladies - ", note_fr )
      WHERE note_en LIKE "The disease ascertainment %";

      DELETE FROM footnote
      WHERE note_en LIKE "Please note that a request to receive genomics %"
      OR note_en LIKE "Although MEDI data are not yet available, %";
    END IF;

  END //
DELIMITER ;

CALL patch_footnote();
DROP PROCEDURE IF EXISTS patch_footnote;
