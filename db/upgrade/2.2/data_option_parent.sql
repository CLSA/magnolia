SELECT "Creating new data_option_parent table" AS "";

CREATE TABLE IF NOT EXISTS data_option_parent (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  note_en VARCHAR(1023) NULL,
  note_fr VARCHAR(1023) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name_en (name_en ASC),
  UNIQUE INDEX uq_name_fr (name_fr ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO data_option_parent( id, name_en, name_fr, note_en, note_fr ) VALUES
( 1, "Socio-Demographic Characteristics (SDC)", "Caractéristiques socio-démographiques (SDC)", NULL, NULL ),
( 2, "Self-reported Chronic Conditions (CCT/CCC)", "Problèmes de santé chroniques autodéclarés (CCT/CCC)", NULL, NULL ),
( 3, "Cognition - metadata & scores (COG)", "Cognition - métadonnées et cotation (COG)", "Raw data available through special request. For more information and for details on how to request these data, please contact access@clsa-elcv.ca", "Les données brutes sont disponibles sur demande spéciale. Pour en savoir plus sur ces données et comment en faire la demande, veuillez écrire à access@clsa-elcv.ca" ),
( 4, "Prospective Memory Test", "Test de mémoire prospective", NULL, NULL ),
( 5, "Disease Algorithms and Disease Symptoms", "Algorithme et symptômes de maladies", "The disease ascertainment algorithms are being prepared but are not yet available; however, some of the data contributing to the algorithms are available.", "Les algorithmes diagnostics ont été préparés, mais ne sont pas encore disponibles; toutefois, certaines données contribuant aux algorithmes ont été préparées et sont disponibles." ),
( 6, "Contraindications Questionnaire", "Questionnaire sur les contre-indications", NULL, NULL ),
( 7, "Weight and Height", "Poids et taille", NULL, NULL ),
( 8, "Pulse Rate & Blood Pressure", "Fréquence du pouls et pression sanguine", NULL, NULL ),
( 9, "Carotid Intima Media Thickness (CI)", "Épaisseur de l’intima media carotidienne (CI)", "Alphanumeric data for Carotid Intima measures are available only for those images classified as useable.", "Les données alphanumériques des mesures de l’intima carotidienne sont uniquement disponibles pour les images classées comme étant utilisables."  ),
( 10, "Bone Density by DEXA (DXA)", "Densité osseuse avec DEXA (DXA)", "Raw data available through special request. For more information and for details on how to request these data, please contact access@clsa-elcv.ca", "Les données brutes sont disponibles sur demande spéciale. Pour en savoir plus sur ces données et comment en faire la demande, veuillez écrire à access@clsa-elcv.ca" ),
( 11, "Bio-Impedance by DEXA (DXA)", "Bio-impédance avec DEXA (DXA)", "Raw data available through special request. For more information and for details on how to request these data, please contact access@clsa-elcv.ca", "Les données brutes sont disponibles sur demande spéciale. Pour en savoir plus sur ces données et comment en faire la demande, veuillez écrire à access@clsa-elcv.ca" );
