SELECT "Creating new data_option_detail table" AS "";

CREATE TABLE IF NOT EXISTS data_option_detail (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  data_option_id INT UNSIGNED NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_data_option_id (data_option_id ASC),
  UNIQUE INDEX uq_data_option_id_rank (data_option_id ASC, rank ASC),
  CONSTRAINT fk_data_option_detail_data_option_id
    FOREIGN KEY (data_option_id)
    REFERENCES data_option (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Socio-Demographic Characteristics";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Age (AGE)", "Âge (AGE)" ),
( @data_option_id, 2, "Sex (SEX)", "Sexe (SEX)" ),
( @data_option_id, 3, "Education (ED)", "Éducation (ED)" ),
( @data_option_id, 4, "Country of birth (SDC)", "Pays de naissance (SDC)" ),
( @data_option_id, 5, "Province of residence (SDC)", "Province de résidence (SDC)" ),
( @data_option_id, 6, "Urban/Rural Classification (SDC)", "Classement des zones urbaines/rurales (SDC)" ),
( @data_option_id, 7, "Ethnicity (SDC)", "Ethnicité (SDC)" ),
( @data_option_id, 8, "Culture (SDC)", "Culture (SDC)" ),
( @data_option_id, 9, "Language (SDC)", "Langue (SDC)" ),
( @data_option_id, 10, "Religion (SDC)", "Religion (SDC)" ),
( @data_option_id, 11, "Marital status (SDC)", "État matrimonial (SDC)" ),
( @data_option_id, 12, "Sexual orientation (SDC)", "Orientation sexuelle (SDC)" ),
( @data_option_id, 13, "Income (INC)", "Revenu (INC)" ),
( @data_option_id, 14, "Wealth (WEA)", "Patrimoine (WEA)" ),
( @data_option_id, 15, "Home Ownership (OWN)", "Propriétaires (OWN)" ),
( @data_option_id, 16, "Veteran Identifiers (VET)", "Anciens combattants (VET)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Lifestyle and Behaviour";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Smoking (SMK)", "Consommation de tabac (SMK)" ),
( @data_option_id, 2, "Alcohol Use (ALC)", "Consommation d’alcool (ALC)" ),
( @data_option_id, 3, "Nutrition: Short Diet Questionnaire (NUT; COM)", "Nutrition : Questionnaire court sur le régime alimentaire (NUT; COM)" ),
( @data_option_id, 4, "Dietary Supplement Use (DSU)", "Usage de suppléments alimentaires (DSU)" ),
( @data_option_id, 5, "Nutritional Risk (NUR)", "Risque nutritionnel (NUR)" ),
( @data_option_id, 6, "Physical Activities (PA2)", "Activités physiques (PA2)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Physical Health I";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Self-report Height and Weight (HWT; TRM)", "Taille et poids (HWT; TRM)" ),
( @data_option_id, 2, "Measured Height and Weight (WGT, HGT; COM)", "Taille et poids (WGT, HGT; COM)" ),
( @data_option_id, 3, "General Health (GEN)", "État général de santé (GEN)" ),
( @data_option_id, 4, "General Health - open text on healthy aging", "État général de santé - question ouverte (sur le vieillissement en santé)" ),
( @data_option_id, 5, "Women’s Health (WHO)", "Santé des femmes (WHO)" ),
( @data_option_id, 6, "Vision (VIS)", "Vision (VIS)" ),
( @data_option_id, 7, "Hearing (HRG)", "Audition (HRG)" ),
( @data_option_id, 8, "Oral Health (ORH)", "Santé bucco-dentaire (ORH)" ),
( @data_option_id, 9, "Functional Status (FUL)", "Capacités fonctionnelles (FUL)" ),
( @data_option_id, 10, "Sleep (SLE; COM)", "Sommeil (SLE; COM)" ),
( @data_option_id, 11, "Snoring (SNO; COM)", "Ronflement (SNO; COM)" ),
( @data_option_id, 12, "Pain and Discomfort (HUP)", "Douleurs et malaises (HUP)" ),
( @data_option_id, 13, "Injuries (INJ)", "Blessures (INJ)" ),
( @data_option_id, 14, "Falls (FAL)", "Chutes (FAL)" ),
( @data_option_id, 15, "Falls and Consumer Products (FAL)", "Chutes et produits de consommation (FAL)" ),
( @data_option_id, 16, "Health Care Utilization (HCU)", "Utilisation des soins de santé (HCU)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Self-reported Chronic Conditions";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Osteoarthritis or arthritis (CCT/CCC)", "Arthrose ou arthrite (CCT/CCC)" ),
( @data_option_id, 2, "Respiratory (CCT/CCC)", "Respiratoire (CCT/CCC)" ),
( @data_option_id, 3, "Cardiovascular (CCT/CCC)", "Cardiovasculaire (CCT/CCC)" ),
( @data_option_id, 4, "Stroke (CCT/CCC)", "AVC (CCT/CCC)" ),
( @data_option_id, 5, "Neurological (CCT/CCC)", "Neurologique (CCT/CCC)" ),
( @data_option_id, 6, "Gastrointestinal (CCT/CCC)", "Gastrointestinal (CCT/CCC)" ),
( @data_option_id, 7, "Diseases of the eye (CCT/CCC)", "Maladies de l’œil (CCT/CCC)" ),
( @data_option_id, 8, "Cancer (CCT/CCC)", "Cancer (CCT/CCC)" ),
( @data_option_id, 9, "Mental Health (CCT/CCC)", "Santé mentale (CCT/CCC)" ),
( @data_option_id, 10, "Other Conditions (CCT/CCC)", "Autres maladies (CCT/CCC)" ),
( @data_option_id, 11, "Infections (CCT/CCC)", "Infections (CCT/CCC)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Physical Health II";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Disease Algorithms and Disease Symptoms", "Algorithmes et symptômes de maladies" ),
( @data_option_id, 2, "Diabetes (DIA; COM)", "Diabète (DIA; COM)" ),
( @data_option_id, 3, "Stroke/Cerebrovascular Event (STR; COM)", "AVC (STR; COM)" ),
( @data_option_id, 4, "Traumatic Brain Injury (TBI; COM)", "Traumatisme crânien (TBI; COM)" ),
( @data_option_id, 5, "Hypo and Hyperthyroidism (HYP; COM)", "Hypo-et hyperthyroïdie (HYP; COM)" ),
( @data_option_id, 6, "Hypertension (HBP; COM)", "Hypertension (HBP; COM)" ),
( @data_option_id, 7, "Ischemic Heart Disease (IHD; COM)", "Cardiopathie ischémique (IHD; COM)" ),
( @data_option_id, 8, "WHO Rose Questionnaire (ROS; COM)", "Questionnaire Rose de l’OMS (ROS; COM)" ),
( @data_option_id, 9, "Osteoarthritis of the Hand (OSA; COM)", "Arthrose de la main (OSA; COM)" ),
( @data_option_id, 10, "Osteoarthritis of the Hip (OSH; COM)", "Arthrose de la hanche (OSH; COM)" ),
( @data_option_id, 11, "Osteoarthritis of the Knee (OSK; COM)", "Arthrose du genou (OSK; COM)" ),
( @data_option_id, 12, "Musculoskeletal: Other (OAR; COM)", "Musculosquelettique : autre (OAR; COM)" ),
( @data_option_id, 13, "Osteoporosis (OST; COM)", "Ostéoporose (OST; COM)" ),
( @data_option_id, 14, "Neuro-psychiatric (DPR; COM)", "Neuropsychiatrique (DPR; COM)" ),
( @data_option_id, 15, "Parkinsonism (PKD)", "Parkinsonisme (PKD)" ),
( @data_option_id, 16, "Chronic Airflow Obstruction (CAO; COM)", "Obstruction chronique des voies respiratoires (CAO" ),
( @data_option_id, 17, "Medication Use (MED; TRM)", "Consommation de médicaments (MED; TRM)" ),
( @data_option_id, 18, "Medications (MEDI; not yet available)", "Médicaments (MEDI; pas encore disponible)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Psychological Health";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Depression (DEP)", "Dépression (DEP)" ),
( @data_option_id, 2, "Posttraumatic Stress Disorder (PSD)", "Trouble de stress post-traumatique (PSD)" ),
( @data_option_id, 3, "Psychological Distress (K10; COM)", "Détresse psychologique (K10; COM)" ),
( @data_option_id, 4, "Personality Traits (PER; COM)", "Traits de caractère (PER; COM)" ),
( @data_option_id, 5, "Satisfaction with Life (SLS)", "Satisfaction à l’égard de la vie (SLS)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Cognition - metadata & scores";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "REYI / REYI (COG)", "REYI / REYI (COG)" ),
( @data_option_id, 2, "REYII / REYII (COG)", "REYII / REYII (COG)" ),
( @data_option_id, 3, "Animal Fluency Test (COG)", "Test de fluence (animaux) (COG)" ),
( @data_option_id, 4, "Mental Alternation Test (COG)", "Test d’alternance mentale (COG)" ),
( @data_option_id, 5, "Time-Based Prospective Memory Test (TMT; COM)", "Test de mémoire prospective en fonction du temps (TMT; COM)" ),
( @data_option_id, 6, "Event-Based Prospective Memory Test (PMT; COM)", "Test de mémoire prospective en fonction d’un événement (PMT; COM)" ),
( @data_option_id, 7, "Stroop - Victoria Version (STP; COM)", "Stroop - version de Victoria (STP; COM)" ),
( @data_option_id, 8, "Controlled Oral Word Association (FAS; COM)", "Test oral contrôlé d’association de mots (FAS; COM)" ),
( @data_option_id, 9, "Choice Reaction Time (CRT; COM)", "Test de temps de réaction (CRT; COM)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Labour Force";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Retirement Status (RET)", "Retraite (RET)" ),
( @data_option_id, 2, "Pre-Retirement Labour Force Participation (LFP)", "Participation à la population active avant la retraite (LFP)" ),
( @data_option_id, 3, "Pre-Retirement Labour Force Participation - open text question", "Participation à la population active avant la retraite - question ouverte" ),
( @data_option_id, 4, "Labour Force (LBF)", "Population active (LBF)" ),
( @data_option_id, 5, "Labour Force - open text question", "Population active - question ouverte" ),
( @data_option_id, 6, "Retirement Planning (RPL)", "Planification de la retraite (RPL)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Social Health";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Social Networks (SN)", "Réseaux sociaux (SN)" ),
( @data_option_id, 2, "Social Support - Availability (SSA)", "Soutien social - Disponibilité (SSA)" ),
( @data_option_id, 3, "Social Participation (SPA)", "Participation sociale (SPA)" ),
( @data_option_id, 4, "Care Receiving 1 / Formal Care (CR1)", "Soins reçus 1 / Soins à domicile (CR1)" ),
( @data_option_id, 5, "Care Receiving 2 / Informal Care (CR2)", "Soins reçus 2 / Autres types de soins (CR2)" ),
( @data_option_id, 6, "Care Giving (CAG)", "Prestation de soins (CAG)" ),
( @data_option_id, 7, "Social Inequality (SEQ)", "Inégalité sociale (SEQ)" ),
( @data_option_id, 8, "Online Social Networking (INT)", "Réseautage social en ligne (INT)" ),
( @data_option_id, 9, "Transportation, Mobility, Migration (TRA)", "Transport, mobilité, migration (TRA)" ),
( @data_option_id, 10, "Built Environments (ENV)", "Environnements construits (ENV)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Physical Assessments I";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Contraindications Questionnaire", "Questionnaire sur les contre-indications" ),
( @data_option_id, 2, "Weight and Height", "Poids et taille" ),
( @data_option_id, 3, "Body Mass Index (HWT)", "Indice de masse corporelle (HWT)" ),
( @data_option_id, 4, "Hip and Waist Circumference (WHC)", "Circonférence taille et hanche (WHC)" ),
( @data_option_id, 5, "4 Metre Walk (WLK)", "Marche sur 4 m (WLK)" ),
( @data_option_id, 6, "Timed Get Up and Go (TUG)", "Lever-marcher chronométré (TUG)" ),
( @data_option_id, 7, "Standing Balance (BAL)", "Équilibre debout (BAL)" ),
( @data_option_id, 8, "Chair Rise: Balance and Coordination (CR)", "Se lever d’une chaise: équilibre et coordination (CR)" ),
( @data_option_id, 9, "Grip Strength (GS)", "Force de préhension (GS)" ),
( @data_option_id, 10, "Basic Activities of Daily Living (ADL)", "Activités de base de la vie quotidienne (ADL)" ),
( @data_option_id, 11, "Instrumental Activities of Daily Living (IAL)", "Activités instrumentals de la vie quotidienne (IAL)" ),
( @data_option_id, 12, "Life Space Index (LSI; COM)", "Évaluation de l’aire de mobilité (LSI; COM)" ),
( @data_option_id, 13, "Pulse Rate & Blood Pressure (BP)", "Fréquence du pouls et pression sanguine (BP)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Bio-Impedance by DEXA";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Body Composition (Whole Body & Body Parts) (DXA)", "Composition corporelle (Corps entier et parties du corps) (DXA)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Physical Assessments II";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Spirometry (SPR)", "Spirométrie (SPR)" ),
( @data_option_id, 2, "Hearing (HRG)", "Audition (HRG)" ),
( @data_option_id, 3, "Visual Acuity (VA)", "Acuité visuelle (VA)" ),
( @data_option_id, 4, "Tonometry (TON)", "Tonométrie (TON)" ),
( @data_option_id, 5, "Electrocardiogram (ECG)", "Électrocardiogramme (ECG)" ),
( @data_option_id, 6, "Carotid Intima Media Thickness (CI)", "Épaisseur de l’intima media carotidienne (CI)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Bone Density by DEXA";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Whole Body", "Corps entire" ),
( @data_option_id, 2, "Body Parts", "Parties du corps" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Hematology Report";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "White blood cells (WBC)", "Globules blancs (WBC)" ),
( @data_option_id, 2, "Lymphocytes (relative number) (LY_PER)", "Lymphocytes (nombre relatif) (LY_PER)" ),
( @data_option_id, 3, "Monocytes (relative number) (MO_PER)", "Monocytes (nombre relatif) (MO_PER)" ),
( @data_option_id, 4, "Granulocytes (relative number) (GR_PER)", "Granulocytes (nombre relatif) (GR_PER)" ),
( @data_option_id, 5, "Lymphocytes (absolute number) (LY_NB)", "Lymphocytes (nombre absolu) (LY_NB)" ),
( @data_option_id, 6, "Monocytes (absolute number) (MO_NB)", "Monocytes (nombre absolu) (MO_NB)" ),
( @data_option_id, 7, "Granulocytes (absolute number) (GR_NB)", "Granulocytes (nombre absolu) (GR_NB)" ),
( @data_option_id, 8, "Red blood cells (RBC)", "Globules rouges (RBC)" ),
( @data_option_id, 9, "Hemoglobin (Hgb)", "Hémoglobine (Hgb)" ),
( @data_option_id, 10, "Hematocrit (Hct)", "Hématocrites (Hct)" ),
( @data_option_id, 11, "Mean corpuscular volume (MCV)", "Volume globulaire moyen (MCV)" ),
( @data_option_id, 12, "Mean corpuscular hemoglobin (MCH)", "Teneur corpusculaire moyenne en hémoglobine (MCH)" ),
( @data_option_id, 13, "Mean corpuscular hemoglobin concentration (MCHC)", "Concentration corpusculaire moyenne en hémoglobine (MCHC)" ),
( @data_option_id, 14, "Red blood cell distribution width (RDW)", "Variation de la grosseure des globules rouges (RDW)" ),
( @data_option_id, 15, "Platelets (Plt)", "Plaquettes (Plt)" ),
( @data_option_id, 16, "Mean platelet volume (MPV)", "Volume plaquettaire moyen (MPV)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Chemistry Report";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Albumin (ALB)", "Albumine (ALB)" ),
( @data_option_id, 2, "Alanine aminotransferase (ALT)", "Alanine aminotransférase (ALT)" ),
( @data_option_id, 3, "High Sensitivity C-reactive protein (HSCRP)", "Protéine C réactive à haute sensibilité (HSCRP)" ),
( @data_option_id, 4, "Creatinine (CREAT)", "Créatinine (CREAT)" ),
( @data_option_id, 5, "Total Cholesterol (CHOL)", "Cholestérol total (CHOL)" ),
( @data_option_id, 6, "Ferritin (FERR)", "Ferritine (FERR)" ),
( @data_option_id, 7, "Free Thyroxine (FT4)", "Thyroxine libre (FT4)" ),
( @data_option_id, 8, "High-Density Lipoprotein (HDL)", "Lipoprotéine de haute densité (HDL)" ),
( @data_option_id, 9, "Low-Density Lipoprotein (LDL)", "Lipoprotéine de faible densité (LDL)" ),
( @data_option_id, 10, "Non-High Density Lipoprotein (non-HDL)", "Lipoprotéine à densité non-élevée (non-HDL)" ),
( @data_option_id, 11, "Thyroid Stimulating Hormone (TSH)", "Thyréostimuline (TSH)" ),
( @data_option_id, 12, "Triglycerides (TRIG)", "Triglycérides (TRIG)" ),
( @data_option_id, 13, "25 - Hydroxyvitamin D (VITD)", "25 - hydroxyvitamine D (VITD)" ),
( @data_option_id, 14, "Hemoglobin A1c (HBA1c; N = 26,961)", "Hémoglobine A1c (HBA1c; N = 26,961)" ),
( @data_option_id, 15, "Glomerular Filtration Rate estimate (eGFR)", "Estimation du débit de filtration glomérulaire (eGFR)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Genomics (N=9,896)";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Genotypes (Affymetrix Axiom array, 794k SNPs)", "Génotypes (génotypage Axiom d’Affymetrix, 794k SNP)" ),
( @data_option_id, 2, "Imputation (Haplotype Reference Consortium release 1.1, 39.2M SNPs)", "Imputation (Haplotype Reference Consortium, version 1.1, 39.2M SNP)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Air Quality";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Nitrogen Dioxide", "Dioxyde d'azote" ),
( @data_option_id, 2, "Sulfur Dioxide", "Dioxyde de soufre" ),
( @data_option_id, 3, "Ozone", "Ozone" ),
( @data_option_id, 4, "Fine Particulate Matter", "Fines particules de matières" ),
( @data_option_id, 5, "Proximity to Roadways", "Proximité des routes" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Neighborhood Factors";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Nighttime Light", "Luminosité nocturne" ),
( @data_option_id, 2, "Material and Social Deprivation Indices", "Indices de défavorisation matérielle et sociale" ),
( @data_option_id, 3, "Canadian Active Living Environments (Can-ALE) Data", "Données sur les milieux de vie actifs canadiens (Can-ALE)" );

SELECT id INTO @data_option_id FROM data_option WHERE name_en = "Greenness & Weather";

INSERT IGNORE INTO data_option_detail ( data_option_id, rank, name_en, name_fr ) VALUES
( @data_option_id, 1, "Normalized Difference Vegetation Index (NDVI; greenness)", "Indice de végétation par différence normalisée (IVDN; verdeur)" ),
( @data_option_id, 2, "Meteorological Data (weather and climate)", "Données météorologiques (météo et climat)" );
