DROP PROCEDURE IF EXISTS patch_data_category;
DELIMITER //
CREATE PROCEDURE patch_data_category()
  BEGIN

    SELECT COUNT(*) INTO @test FROM data_category WHERE name_en = "Core CLSA Data";
    IF 0 = @test THEN
      
      SELECT "Creating new Core CLSA Data data_category" AS "";

      SELECT id INTO @data_category_id FROM data_category WHERE name_en = "Questionnaires";
      UPDATE data_category SET name_en = "Core CLSA Data" WHERE id = @data_category_id;
      
      -- move the existing data-options ranks out of the way
      UPDATE data_option SET rank = rank + 100 WHERE data_category_id = @data_category_id;

      -- create the new data-options
      INSERT INTO data_option( data_category_id, rank, name_en, name_fr, note_en, note_fr ) VALUES
      ( @data_category_id, 1, "Questionnaire Data", "Données du questionnaire", "For a detailed list of the questionnaire data variables please consult the Data Availability Table on the CLSA website", "Pour une liste détaillée des variables de données du questionnaire, veuillez consulter le tableau de disponibilité des données sur le site Web de l’ÉLCV." ),
      ( @data_category_id, 2, "Physical Assessment", "Évaluations physiques", "For a detailed list of the physical assessment variables please consult the Physical Assessments Summary Table available in the Data and Biospecimens section of the CLSA website.", "Pour une liste détaillée des variables d’évaluations physiques, veuillez consulter le tableau récapitulatif des évaluations physiques disponible à la section Données et échantillons biologiques du site Web de l’ÉLCV."  ),
      ( @data_category_id, 3, "Blood Biomarkers (Hematology and Chemistry)", "Biomarqueurs sanguins (hématologie et chimie)", "For a detailed list of the blood biomarkers variables please consult the Data Availability Table on the CLSA website.", "Pour une liste détaillée des variables de biomarqueurs sanguins, veuillez consulter le tableau de disponibilité des données sur le site Web de l’ÉLCV." );

      UPDATE data_option SET data_category_id = @data_category_id, rank = 4 WHERE name_en = "Genomics (N = 26,622)";
      UPDATE data_option SET data_category_id = @data_category_id, rank = 5 WHERE name_en = "Epigenetics (N = 1,479)";
      UPDATE data_option SET data_category_id = @data_category_id, rank = 6, name_en = "Metabolomics (N = ~9,500)"
      WHERE name_en = "Metabolomics (N= ~9,500)";

      -- create the new data-selections
      INSERT INTO data_selection( data_option_id, study_phase_id )
      SELECT data_option.id, study_phase_id
      FROM data_option
      JOIN data_category ON data_option.data_category_id = data_category.id
      JOIN data_category_has_study_phase ON data_category.id = data_category_has_study_phase.data_category_id
      WHERE data_option.name_en IN( "Questionnaire Data", "Physical Assessment", "Blood Biomarkers (Hematology and Chemistry)" );

      -- create the new data-details
      SELECT MIN( study_phase_id ), MAX( study_phase_id ) INTO @study_phase1_id, @study_phase2_id
      FROM data_category_has_study_phase
      WHERE data_category_id = @data_category_id;

      -- questionnaire
      SELECT data_selection.id INTO @data_selection1_id
      FROM data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en = "Questionnaire Data"
      AND data_selection.study_phase_id = @study_phase1_id;

      SELECT data_selection.id INTO @data_selection2_id
      FROM data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en = "Questionnaire Data"
      AND data_selection.study_phase_id = @study_phase2_id;

      INSERT INTO data_detail( data_selection_id, rank, name_en, name_fr, note_en, note_fr ) VALUES
      ( @data_selection1_id, 1, "Socio-Demographic Characteristics", "Caractéristiques sociodémographiques", NULL, NULL ),
      ( @data_selection2_id, 1, "Socio-Demographic Characteristics", "Caractéristiques sociodémographiques", NULL, NULL ),
      ( @data_selection1_id, 2, "Lifestyle and Behaviour", "Style et vie et comportement", NULL, NULL ),
      ( @data_selection2_id, 2, "Lifestyle and Behaviour", "Style et vie et comportement", NULL, NULL ),
      ( @data_selection1_id, 3, "Physical Health", "Santé physique", NULL, NULL ),
      ( @data_selection2_id, 3, "Physical Health", "Santé physique", NULL, NULL ),
      ( @data_selection1_id, 4, "Medications", "Médicaments", "Medications Module (MEDI) includes information on prescription and non-prescription medications used regularly by CLSA Comprehensive Cohort participants. Main variables include: DIN, name, dosage, frequency, start date & duration of use, reason of use.", "Le module Médicaments (MEDI) comprend des informations sur les médicaments sur ordonnance et en vente libre utilisés régulièrement par les participants à la cohorte globale de l’ÉLCV. Les principales variables comprennent : DIN, nom, posologie, fréquence, date de début et durée d’utilisation, raison de l’utilisation." ),
      ( @data_selection1_id, 5, "Psychological Health", "Santé mentale", NULL, NULL ),
      ( @data_selection2_id, 5, "Psychological Health", "Santé mentale", NULL, NULL ),
      ( @data_selection1_id, 6, "Cognition - metadata & scores", "Cognition - métadonnées et cotation", "Raw data are available by special request. To request raw data, please go to the Additional Data section.", "Les données brutes sont disponibles sur demande spéciale. Pour demander des données brutes, veuillez consulter la section Données additionnelles." ),
      ( @data_selection2_id, 6, "Cognition - metadata & scores", "Cognition - métadonnées et cotation", "Raw data are available by special request. To request raw data, please go to the Additional Data section.", "Les données brutes sont disponibles sur demande spéciale. Pour demander des données brutes, veuillez consulter la section Données additionnelles." ),
      ( @data_selection1_id, 7, "Labour Force", "Population active", NULL, NULL ),
      ( @data_selection2_id, 7, "Labour Force", "Population active", NULL, NULL ),
      ( @data_selection1_id, 8, "Social Health", "Santé sociale", NULL, NULL ),
      ( @data_selection2_id, 8, "Social Health", "Santé sociale", NULL, NULL );

      -- blood biomarkers
      SELECT data_selection.id INTO @data_selection1_id
      FROM data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en = "Blood Biomarkers (Hematology and Chemistry)"
      AND data_selection.study_phase_id = @study_phase1_id;

      SELECT data_selection.id INTO @data_selection2_id
      FROM data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en = "Blood Biomarkers (Hematology and Chemistry)"
      AND data_selection.study_phase_id = @study_phase2_id;

      INSERT INTO data_detail( data_selection_id, rank, name_en, name_fr ) VALUES
      ( @data_selection1_id, 1, "Hematology Report", "Rapport hématologiqu" ),
      ( @data_selection2_id, 1, "Hematology Report", "Rapport hématologique" ),
      ( @data_selection1_id, 2, "Chemistry Report", "Rapport de chimie" );

      -- epigenetics (baseline only)
      SELECT data_selection.id INTO @data_selection1_id
      FROM data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en = "Epigenetics (N = 1,479)"
      AND data_selection.study_phase_id = @study_phase1_id;

      DELETE FROM data_detail WHERE data_selection_id = @data_selection1_id AND rank > 3;

      -- metabolomics (baseline only)
      SELECT data_selection.id INTO @data_selection1_id
      FROM data_selection
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en = "Metabolomics (N = ~9,500)"
      AND data_selection.study_phase_id = @study_phase1_id;

      DELETE FROM data_detail WHERE data_selection_id = @data_selection1_id AND rank > 2;
      INSERT INTO data_detail( data_selection_id, rank, name_en, name_fr ) VALUES
      ( @data_selection1_id, 3, "Processed data, CSV format (Beta values, background corrected, normalized, and probe filtered)", "Données traitées, format CSV (valeurs bêta, correction de fond, normalisées et filtrées par sonde)" );

      -- update reqn-version data selections
      CREATE TEMPORARY TABLE reqn_version_has_study_phase
      SELECT DISTINCT reqn_version_id, study_phase_id
      FROM reqn_version_has_data_selection
      JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.data_category_id = @data_category_id
      ORDER BY reqn_version_id, study_phase_id;

      INSERT INTO reqn_version_has_data_selection( reqn_version_id, data_selection_id )
      SELECT reqn_version_id, data_selection.id
      FROM reqn_version_has_study_phase
      CROSS JOIN data_option
      JOIN data_selection ON data_option.id = data_selection.data_option_id
       AND reqn_version_has_study_phase.study_phase_id = data_selection.study_phase_id
      WHERE data_option.name_en = "Questionnaire Data";

      DROP TABLE reqn_version_has_study_phase;

      CREATE TEMPORARY TABLE reqn_version_has_study_phase
      SELECT DISTINCT reqn_version_id, study_phase_id
      FROM reqn_version_has_data_selection
      JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      JOIN data_option ON data_selection.data_option_id = data_option.id
      JOIN data_category ON data_option.data_category_id = data_category.id
      WHERE data_category.name_en = "Physical Assessment"
      ORDER BY reqn_version_id, study_phase_id;

      INSERT INTO reqn_version_has_data_selection( reqn_version_id, data_selection_id )
      SELECT reqn_version_id, data_selection.id
      FROM reqn_version_has_study_phase
      CROSS JOIN data_option
      JOIN data_selection ON data_option.id = data_selection.data_option_id
       AND reqn_version_has_study_phase.study_phase_id = data_selection.study_phase_id
      WHERE data_option.name_en = "Physical Assessment";

      DROP TABLE reqn_version_has_study_phase;

      CREATE TEMPORARY TABLE reqn_version_has_study_phase
      SELECT DISTINCT reqn_version_id, study_phase_id
      FROM reqn_version_has_data_selection
      JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en IN ( "Hematology Report", "Chemistry Report" )
      ORDER BY reqn_version_id, study_phase_id;

      INSERT INTO reqn_version_has_data_selection( reqn_version_id, data_selection_id )
      SELECT reqn_version_id, data_selection.id
      FROM reqn_version_has_study_phase
      CROSS JOIN data_option
      JOIN data_selection ON data_option.id = data_selection.data_option_id
       AND reqn_version_has_study_phase.study_phase_id = data_selection.study_phase_id
      WHERE data_option.name_en = "Blood Biomarkers (Hematology and Chemistry)";

      DROP TABLE reqn_version_has_study_phase;

      CREATE TEMPORARY TABLE delete_selections
      SELECT data_selection.id
      FROM reqn_version_has_data_selection
      JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.data_category_id = @data_category_id
      AND data_option.rank > 100;

      CREATE TEMPORARY TABLE delete_options
      SELECT data_option.id
      FROM data_option
      WHERE data_option.data_category_id = @data_category_id
      AND data_option.rank > 100;

      DELETE FROM reqn_version_has_data_selection WHERE data_selection_id IN( SELECT id FROM delete_selections );
      DELETE FROM data_option WHERE id IN( SELECT id FROM delete_options );

      DROP TABLE delete_selections;
      DROP TABLE delete_options;

    END IF;

    SELECT COUNT(*) INTO @test FROM data_option WHERE name_en IN( "Air Quality", "Neighborhood Factors", "Greenness & Weather" );
    IF 0 < @test THEN
      
      SELECT "Changing options in Linked Data category" AS "";

      SELECT id INTO @data_category_id FROM data_category WHERE name_en = "Linked Data";

      UPDATE data_category
        SET note_en = "When requesting these data, please note that if your CLSA Data and Biospecimen Request Application is approved, you will also be required to sign a Data Use and Sharing via Third Party Agreement (available for consultation and download), and submit it to the CLSA.  For a detailed list of the linked variables please consult the Linked Data Summary Table available in the Data and Biospecimens section of the CLSA website, www.clsa-elcv.ca.",
            note_fr = "Lorsque vous demandez l’accès à ces données, veuillez noter que si votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV est approuvée, vous devrez également signer une Entente de partage et d’utilisation des données via une tierce partie autorisée (en anglais seulement - Data Use and Sharing via Third Party Agreement) (disponible pour consultation et téléchargement ici) et la soumettre à l’ÉLCV.  Pour obtenir une liste détaillée des variables liées, veuillez consulter le Tableau récapitulatif des données liées disponible à la section Données et échantillons biologiques du site Web de l’ÉLCV, www.clsa-elcv.ca."
      WHERE id = @data_category_id;
      
      -- move the existing data-options ranks out of the way
      UPDATE data_option SET rank = rank + 100 WHERE data_category_id = @data_category_id;

      -- create the new data-options
      INSERT INTO data_option( data_category_id, rank, name_en, name_fr, note_en, note_fr ) VALUES
      ( @data_category_id, 1, "Environmental Indicators", "Indicateurs environnementaux", "When requesting these data, please note that if your CLSA Data and Biospecimen Request Application is approved, you will also be required to sign a Data Sharing and Use via Approved Third Party Agreement (available for consultation and download here: http://canue.ca/data/ ), and submit it to the CLSA.", "Lorsque vous demandez ces données, veuillez noter que si votre demande d’accès aux données et aux échantillons biologiques de l’ÉLCV est approuvée, vous devrez également signer une Entente de partage et d’utilisation des données via un tiers autorisé (disponible pour consultation et téléchargement ici : http://canue. ca/data/ ), et la soumettre à l’ÉLCV." );

      -- create the new data-selections
      INSERT INTO data_selection( data_option_id, study_phase_id )
      SELECT data_option.id, study_phase_id
      FROM data_option
      JOIN data_category ON data_option.data_category_id = data_category.id
      JOIN data_category_has_study_phase ON data_category.id = data_category_has_study_phase.data_category_id
      WHERE data_option.name_en = "Environmental Indicators";

      -- metabolomics (baseline only)
      SELECT LAST_INSERT_ID() INTO @data_selection_id;

      INSERT INTO data_detail( data_selection_id, rank, name_en, name_fr ) VALUES
      ( @data_selection_id, 1, "Air Quality", "Qualité de l'air" ),
      ( @data_selection_id, 2, "Neighborhood Factors", "Facteurs de voisinage" ),
      ( @data_selection_id, 3, "Greenness & Weather", "Verdure et météo" );

      CREATE TEMPORARY TABLE reqn_version_has_study_phase
      SELECT DISTINCT reqn_version_id, study_phase_id
      FROM reqn_version_has_data_selection
      JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.name_en IN ( "Air Quality", "Neighborhood Factors", "Greenness & Weather" )
      ORDER BY reqn_version_id, study_phase_id;

      INSERT INTO reqn_version_has_data_selection( reqn_version_id, data_selection_id )
      SELECT reqn_version_id, data_selection.id
      FROM reqn_version_has_study_phase
      CROSS JOIN data_option
      JOIN data_selection ON data_option.id = data_selection.data_option_id
       AND reqn_version_has_study_phase.study_phase_id = data_selection.study_phase_id
      WHERE data_option.name_en = "Environmental Indicators";

      DROP TABLE reqn_version_has_study_phase;

      CREATE TEMPORARY TABLE delete_selections
      SELECT data_selection.id
      FROM reqn_version_has_data_selection
      JOIN data_selection ON reqn_version_has_data_selection.data_selection_id = data_selection.id
      JOIN data_option ON data_selection.data_option_id = data_option.id
      WHERE data_option.data_category_id = @data_category_id
      AND data_option.rank > 100;

      CREATE TEMPORARY TABLE delete_options
      SELECT data_option.id
      FROM data_option
      WHERE data_option.data_category_id = @data_category_id
      AND data_option.rank > 100;

      DELETE FROM reqn_version_has_data_selection WHERE data_selection_id IN( SELECT id FROM delete_selections );
      DELETE FROM data_option WHERE id IN( SELECT id FROM delete_options );

      DROP TABLE delete_selections;
      DROP TABLE delete_options;

    END IF;

    UPDATE data_category
    SET name_en = "Images and Raw Data",
        note_en = "Additional data including images (e.g. DXA, Retinal scan) and raw data (e.g. Spirometry, ECG, Cognition) are available for some modules of the CLSA, as described in the CLSA Data Availability Table on our website. To request these data, please check the corresponding field below, and in the Justification box:<ol><li>specify which subtype/format of the data you are requesting where multiple types are available</li><li>provide detailed justification explaining how these data will help to achieve proposed objectives</li><li>describe how they will be analysed</li><li>provide evidence, if available, that you have the experience and resources to work with these types of data (i.e. references of publications)</li></ol>Please note that the request for Additional data incurs additional costs beyond the current data access fee, and these are outlined in the Fees section of our website. Requests for additional data may prolong the processing time of your application, and it may take longer to receive these data than the 6 months to receive alphanumeric data. For more information, please contact access@clsa-elcv.ca.",
        note_fr = "Des données additionnelles, y compris les images (p. ex. DEXA, imagerie rétinienne) et les données brutes (p. ex. spirométrie, ECG, cognition) sont disponibles pour certains modules de l’ÉLCV, comme indiqué dans le Tableau de disponibilité des données de l’ÉLCV publié sur notre site Web. Pour demander ces données, veuillez cocher le champ correspondant ci-dessous. Ensuite, dans la case ‘Justification’ :<ol><li>indiquez le sous-type ou le format des données que vous demandez lorsque plusieurs types sont disponibles</li><li>fournissez une justification détaillée expliquant comment ces données aideront à atteindre les objectifs proposés</li><li>décrivez comment ces données seront analysées</li><li>fournissez la preuve, le cas échéant, que vous disposez de l’expérience et des ressources nécessaires pour utiliser ce type de données (références de publications)</li></ol>Veuillez noter que les demandes de données additionnelles entraînent des frais supplémentaires en plus des frais d’accès actuels, ces derniers étant décrits dans la section « Frais » de notre site Web. Les demandes de données additionnelles peuvent prolonger le traitement de votre demande d’accès et la réception de ces données peut prendre plus de temps que les six mois prévus pour la réception des données alphanumériques. Pour plus d’information, veuillez nous contacter à l’adresse access@clsa-elcv.ca."
    WHERE name_en = "Additional Data";

    UPDATE data_category
    SET note_en = "<ol><li>Forward Sortation Areas (A forward sortation area (FSA) is a geographic region in which all postal codes start with the same three characters.)</li><li>Census Subdivision Codes and Names - determined using the Postal Code Conversion File (PCCF) from Statistics Canada. (A census subdivision (CSD) is a geographic unit defined by Statistics Canada, roughly corresponding to municipalities, whose unique codes can be linked to other sociodemographic or census data)</li></ol>Due to the sensitive nature of these geographic indicators, a special request must be made to receive CSDs and FSAs as part of your dataset.  Adequate justification must be provided within the project description (Application Part 1) as well as in the Comments box below. By requesting these data, you also agree that you will not present in any form (presentation, publication, poster), an illustration of these geographic areas with fewer than 50 CLSA participants per FSA or CSD. For more information, please contact access@clsa-elcv.ca.",
        note_fr = "<ol><li>Région de tri d’acheminement (Une région de tri d’acheminement (RTA) est une region géographique où tous les codes postaux ont les mêmes trois premiers caractères.)</li><li>Codes et noms des subdivisions de recensement déterminé à l’aide du Fichier de conversion des codes postaux (FCCP) de Statistique Canada. Une subdivision de recensement (SDR) est une unité géographique définie par Statistique Canada correspondant approximativement aux municipalités, dont les codes uniques peuvent être liés à d’autres données sociodémographiques ou de recensement.</li></ol>En raison de la nature de ces indicateurs géographiques, une demande spéciale doit être faite pour que les SDR et les RTA soient incluses dans votre ensemble de données. Une justification adéquate doit être fournie dans la description du projet (partie 1 de la demande). En demandant ces données, vous acceptez également de ne pas présenter sous quelque forme que ce soit (présentation, publication, affiche) une illustration des zones géographiques habitées par moins de 50 participants à l’ÉLCV. Pour toute information supplémentaire, veuillez écrire à access@clsa-elcv.ca."
    WHERE name_en = "Geographic Indicators";

    SELECT COUNT(*) INTO @test FROM data_category WHERE name_en IN( "Physical Assessment", "Biomarkers" );
    IF 0 < @test THEN
      -- move comments from physical assessment and biomarkers to the new core clsa data category
      CREATE TEMPORARY TABLE comments
      SELECT reqn_version_id, GROUP_CONCAT( description separator "\n\n" ) AS description
      FROM reqn_version_comment
      JOIN data_category ON reqn_version_comment.data_category_id = data_category.id
      WHERE data_category.name_en IN ( "Core CLSA Data", "Physical Assessment", "Biomarkers" )
      GROUP BY reqn_version_id;

      UPDATE reqn_version_comment
      JOIN data_category ON reqn_version_comment.data_category_id = data_category.id
      JOIN comments USING( reqn_version_id )
      SET reqn_version_comment.description = comments.description;

      -- delete the physical assessment category
      SELECT id INTO @data_category_id FROM data_category WHERE name_en = "Physical Assessment";
      DELETE FROM data_justification WHERE data_option_id IN(
        SELECT id FROM data_option WHERE data_category_id = @data_category_id
      );
      DELETE FROM reqn_version_has_data_selection WHERE data_selection_id IN(
        SELECT data_selection.id
        FROM data_selection
        JOIN data_option ON data_selection.data_option_id = data_option.id
        WHERE data_option.data_category_id = @data_category_id
      );
      DELETE FROM data_option WHERE data_category_id = @data_category_id;
      DELETE FROM reqn_version_comment WHERE data_category_id = @data_category_id;
      DELETE FROM data_category WHERE id = @data_category_id;

      -- delete the biomarkers category
      SELECT id INTO @data_category_id FROM data_category WHERE name_en = "Biomarkers";
      DELETE FROM data_justification WHERE data_option_id IN(
        SELECT id FROM data_option WHERE data_category_id = @data_category_id
      );
      DELETE FROM reqn_version_has_data_selection WHERE data_selection_id IN(
        SELECT data_selection.id
        FROM data_selection
        JOIN data_option ON data_selection.data_option_id = data_option.id
        WHERE data_option.data_category_id = @data_category_id
      );
      DELETE FROM data_option WHERE data_category_id = @data_category_id;
      DELETE FROM reqn_version_comment WHERE data_category_id = @data_category_id;
      DELETE FROM data_category WHERE id = @data_category_id;

      UPDATE data_category SET rank = rank - 2 WHERE rank > 1;
    END IF;

  END //
DELIMITER ;

CALL patch_data_category();
DROP PROCEDURE IF EXISTS patch_data_category;
