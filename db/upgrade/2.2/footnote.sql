DROP PROCEDURE IF EXISTS patch_footnote;
DELIMITER //
CREATE PROCEDURE patch_footnote()
  BEGIN

    SELECT "Creating new footnote table" AS "";

    SELECT COUNT(*) INTO @test
    FROM INFORMATION_SCHEMA.TABLES
    WHERE TABLE_SCHEMA = DATABASE()
    AND TABLE_NAME = "footnote";

    IF @test = 0 THEN

      CREATE TABLE footnote (
        id INT UNSIGNED NOT NULL AUTO_INCREMENT,
        update_timestamp TIMESTAMP NOT NULL,
        create_timestamp TIMESTAMP NOT NULL,
        note_en VARCHAR(1023) NOT NULL,
        note_fr VARCHAR(1023) NOT NULL,
        PRIMARY KEY (id))
      ENGINE = InnoDB;

      INSERT INTO footnote( note_en, note_fr ) VALUES
      ( "Determined using the Postal Code Conversion File (PCCF) from Statistics Canada.", "Déterminé à l’aide du Fichier de conversion des codes postaux (FCCP) de Statistique Canada." ),
      ( "Open text data under review – in preparation for future release. (Please see Variables under review)", "Les données ouvertes sont en cours d’examen – en préparation pour une diffusion ultérieure. (Voir les variables en cours d’examen)" ),
      ( "Height and Weight data collected as part of the assessments during the DCS visit.", "Les données sur la taille et le poids font partie des mesures prises lors de la visite au Site de collecte de données." ),
      ( "In order to assess Functional Status (FUL) in Comprehensive participants who benefited from an accommodation strategy (ex. DCS by phone), this questionnaire was administered. For 134 participants, the baseline DCS visit was completed by phone for various reasons including time constraints for recruitment fulfillment toward the end of Baseline data collection and some cases where the participants were unable to physically present at the DCS but wished to remain part of CLSA. For 2 participants, the Baseline DCS site visit was completed in person at the participant’s residence as a pilot for the DCS at home. For 1 participant, the Baseline DCS consisted of a DCS site visit for the collection of physical measures with the questionnaires being administered by phone.", "Pour 135 participants de l’évaluation globale, la visite initiale au Site de collecte de données a été réalisée par téléphone pour diverses raisons, y compris des contraintes de temps liées au recrutement vers la fin de la collecte des données de départ ou des participants ne pouvant pas se présenter physiquement au site, mais souhaitant faire partie de l’ÉLCV. Pour 2 participants, la visite initiale au Site de collecte de données a été faite en personne à leur résidence dans le cadre de l’étude pilote de l’entrevue du site réalisée à domicile." ),
      ( "The disease ascertainment algorithms are being prepared but are not yet available; however, some of the data contributing to the algorithms are available.", "Les algorithmes diagnostiques ont été préparés, mais ne sont pas encore disponibles; toutefois, certaines données contribuant aux algorithmes ont été préparées et sont disponibles." ),
      ( "Raw data are available by special request. To request raw data, please go to the Additional Data section.", "Les données brutes sont disponibles sur demande spéciale. Pour demander les données brutes, visitez la section Données supplémentaires." ),
      ( "Open text data for occupation and industry are not coded. Any coding of the released open text data has to be a coordinated effort between the Approved User and the CLSA. Please contact us for details access@clsa-elcv.ca.", "Des données ouvertes pour la profession et l’industrie ne sont pas codées. Toute codification de données ouvertes diffusées doit être coordonnée entre l’utilisateur autorisé et l’ÉLCV. Pour plus d’information, contactez-nous à access@clsa-elcv.ca." ),
      ( "For a detailed list of the physical assessment variables please consult the Physical Assessments Summary Table available in the Data and Sample Access Documents section of the CLSA website.", "Pour obtenir la liste complète des variables tirées d’évaluations physiques, veuillez consulter le Tableau sommaire à la section Documents d’accès aux données et aux échantillons du site Web de l’ÉLCV. " ),
      ( "Images are available by special request. To request images, please go to the Additional Data section.", "Il est maintenant possible d’obtenir les données en format image sur demande spéciale. Pour demander des données en format images, visitez la section Données supplémentaires." ),
      ( "Alphanumeric data for Carotid Intima measures are available only for those images classified as useable.", "Les données alphanumériques des mesures de l’intima carotidienne sont uniquement disponibles pour les images classées comme étant utilisables." ),
      ( "please note that a request to receive genomics data may incur additional costs for transfer of the data, beyond the current data access fee. shipping & associated fees to be determined.", "Veuillez noter que des coûts supplémentaires sont associés à la réception de données génomiques en plus des frais actuels d’accès aux données. (Frais d’expédition et frais associés à déterminer)" ),
      ( "For a detailed list of the linked variables please consult the Linked Data Summary Table available in the Data and Sample Access Documents section of the CLSA website.", "Pour obtenir une liste détaillée des variables liées, veuillez consulter le tableau récapitulatif des données liées disponible à la section Documents d’accès aux données et aux échantillons du site Web de l’ÉLCV." ),
      ( "When requesting these data, please note that if your CLSA Data and Biospecimen Request Application is approved, you will be required to sign a Data Sharing and Use via Approved Third Party Agreement (available for consultation and download here: http://canue.ca/data/ ), and submit it to the CLSA.", "Lorsque vous demandez l’accès à ces données, veuillez noter que si votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV est approuvée, vous devrez signer une Entente de partage et d’utilisation des données via une tierce partie autorisée (disponible pour consultation et téléchargement ici : http://canue.ca/data/ ) et la soumettre à l’ÉLCV." ),
      ( "Although MEDI data are not yet available, they may be requested in the Comments box below. If your project is approved, you will receive these data once they become available.", "Bien que les données du module MEDI ne soient pas encore disponibles, il est possible d’en faire la demande à la section Commentaires ci-dessous. Si votre projet est approuvé, vous recevrez ces données dès qu’elles seront disponibles." ),
      ( "Electrocardiogram (ECG) tracings are available by special request. To request ECG tracings, please go to the Additional Data section.", "Il est maintenant possible d’obtenir les tracés d’électrocardiogramme (ECG) sur demande spéciale. Pour demander les tracés d’ECG , visitez la section Données supplémentaires." ),
      ( "Spirometry (SPR) flow curves are available by special request. To request SPR flow curves, please go to the Additional Data section.", "Il est maintenant possible d’obtenir les courbes de débit de spirométrie (SPR). Pour demander les courbes de débit de SPR, visitez la section Données supplémentaires." ),
      ( "Images and raw data are available by special request. To request images or raw data, please go to the Additional Data section.", "Il est maintenant possible d’obtenir les données en format image et les données brutes sur demande spéciale. Pour demander des données en format images ou les données brutes, visitez la section Données supplémentaires." );

    END IF;

  END //
DELIMITER ;

CALL patch_footnote();
DROP PROCEDURE IF EXISTS patch_footnote;
