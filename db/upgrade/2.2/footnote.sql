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
      ( "Height and Weight data collected as part of the assessments during the DCS visit.", "TRANSLATION REQUIRED" ),
      ( "In order to assess Functional Status (FUL) in Comprehensive participants who benefited from an accommodation strategy (ex. DCS by phone), this questionnaire was administered. For 134 participants, the baseline DCS visit was completed by phone for various reasons including time constraints for recruitment fulfillment toward the end of Baseline data collection and some cases where the participants were unable to physically present at the DCS but wished to remain part of CLSA. For 2 participants, the Baseline DCS site visit was completed in person at the participant’s residence as a pilot for the DCS at home. For 1 participant, the Baseline DCS consisted of a DCS site visit for the collection of physical measures with the questionnaires being administered by phone.", "Pour 135 participants de l’évaluation globale, la visite initiale au Site de collecte de données a été réalisée par téléphone pour diverses raisons, y compris des contraintes de temps liées au recrutement vers la fin de la collecte des données de départ ou des participants ne pouvant pas se présenter physiquement au site, mais souhaitant faire partie de l'ÉLCV. Pour 2 participants, la visite initiale au Site de collecte de données a été faite en personne à leur résidence dans le cadre de l’étude pilote de l’entrevue du site réalisée à domicile." ),
      ( "The disease ascertainment algorithms are being prepared but are not yet available; however, some of the data contributing to the algorithms are available.", "Les algorithmes diagnostiques ont été préparés, mais ne sont pas encore disponibles; toutefois, certaines données contribuant aux algorithmes ont été préparées et sont disponibles." ),
      ( "Raw data available through special request. For more information and for details on how to request these data, please contact access@clsa-elcv.ca", "Les données brutes sont disponibles sur demande spéciale. Pour en savoir plus sur ces données et comment en faire la demande, veuillez écrire à access@clsa-elcv.ca " ),
      ( "Open text data for occupation and industry are available. These data are not coded. Any coding of the released open text data has to be a coordinated effort between the Approved User and the CLSA. Please contact us for details access@clsa-elcv.ca", "Des données ouvertes pour la profession et l’industrie sont disponibles. Ces données ne sont pas codées. Toute codification de données ouvertes diffusées doit être coordonnée entre l’utilisateur autorisé et l’ÉLCV. Pour plus d’information, contactez-nous à access@clsa-elcv.ca." ),
      ( "For a detailed list of the physical assessment variables please consult the Physical Assessments Summary Table available in the Data and Sample Access Documents section of the CLSA website.", "Pour obtenir la liste complète des variables tirées d’évaluations physiques, veuillez consulter le Tableau sommaire à la section Documents d’accès aux données et aux échantillons du site Web de l’ÉLCV. " ),
      ( "Images are currently available by special request for Carotid Intima Media Thickness (cIMT), IVA Lateral Spine (DXA), Retinal Scan (RS), Electrocardiogram (ECG; tracings) and Spirometry (SPR, flow curves). To request image data, please use the ‘Comments’ box below and explain in Part 1 of the Application, why your project requires use of images. Please note that a request to receive image data from the CLSA will incur additional costs, beyond the current data access fee; it may prolong processing time of your application, and the time to receive your image data may be longer than the 6 months to receive alphanumeric data. For more information, please visit our website www.clsa-elcv.ca", "Il est maintenant possible d’obtenir les données en format image sur demande spéciale pour les mesures suivantes : épaisseur de l’intima-média carotidienne (cIMT), analyse intervertébrale (IVA) de la colonne vertébrale (DXA), balayage de la rétine (RS), électrocardiogramme (ECG, tracés) et spirométrie (SPR, courbes de débit). Pour demander des données en format images, utilisez la case « Commentaires » ci-dessous et, à la Partie 1 de la demande, expliquez pourquoi ces images seront utiles à votre projet. Veuillez noter qu'une demande d’obtention d’images de l’ÉLCV entraînera des coûts supplémentaires, au-delà des frais d'accès aux données actuels. Cette demande peut prolonger le temps nécessaire au traitement de votre demande et le délai de réception de vos images peut être plus long que les six mois prévus pour les données alphanumériques. Pour en savoir plus sur ces demandes, veuillez visiter notre site web www.clsa-elcv.ca. " ),
      ( "Raw data available through special request. For more information and for details on how to request these data, please contact access@clsa-elcv.ca", "Les données brutes sont disponibles sur demande spéciale. Pour en savoir plus sur ces données et comment en faire la demande, veuillez écrire à access@clsa-elcv.ca " ),
      ( "Alphanumeric data for Carotid Intima measures are available only for those images classified as useable.", "Les données alphanumériques des mesures de l’intima carotidienne sont uniquement disponibles pour les images classées comme étant utilisables." ),
      ( "Please note that a request to receive genomics data will incur additional costs for transfer of the data, beyond the current data access fee. (Shipping & associated fees to be discussed by SMT)", "TRANSLATION REQUIRED" ),
      ( "For a detailed list of the linked variables please consult the Linked Data Summary Table available in the Data and Sample Access Documents section of the CLSA website.", "Pour obtenir une liste détaillée des variables liées, veuillez consulter le tableau récapitulatif des données liées disponible à la section Documents d’accès aux données et aux échantillons du site Web de l'ÉLCV." ),
      ( "When requesting these data, please note that if your CLSA Data and Biospecimen Request Application is approved, you will be required to sign a Data Sharing and Use via Approved Third Party Agreement (available for consultation and download here: http://canue.ca/data/ ), and submit it to the CLSA and to CANUE.", "Lorsque vous demandez l’accès à ces données, veuillez noter que si votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV est approuvée, vous devrez signer une Entente de partage et d'utilisation des données via une tierce partie autorisée (disponible pour consultation et téléchargement ici : http://canue.ca/data/ ) et la soumettre à l'ÉLCV et à CANUE." );

    END IF;

  END //
DELIMITER ;

CALL patch_footnote();
DROP PROCEDURE IF EXISTS patch_footnote;
