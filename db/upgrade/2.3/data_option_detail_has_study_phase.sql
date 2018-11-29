-- procedure used by patch_data_option_detail_has_study_phase
DROP PROCEDURE IF EXISTS set_study_phase;
DELIMITER //
CREATE PROCEDURE set_study_phase( name VARCHAR(127), phase VARCHAR(45) )
  BEGIN
    SET @sql = CONCAT(
      "INSERT IGNORE INTO data_option_detail_has_study_phase( data_option_detail_id, study_phase_id ) ",
      "SELECT data_option_detail.id, study_phase.id ",
      "FROM data_option_detail, ", @cenozo, ".study_phase ",
      "WHERE data_option_detail.name_en = '", name, "' ",
      "AND ( ",
        "( '", phase, "' = 'all' AND study_phase.name != 'Follow-up 2' ) OR ",
        "study_phase.name = '", phase, "' ",
      ")" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;
  END //
DELIMITER ;

DROP PROCEDURE IF EXISTS patch_data_option_detail_has_study_phase;
DELIMITER //
CREATE PROCEDURE patch_data_option_detail_has_study_phase()
  BEGIN

    -- determine the @cenozo database name
    SET @cenozo = ( SELECT REPLACE( DATABASE(), "magnolia", "cenozo" ) );

    SELECT "Creating new data_option_detail_has_study_phase table" AS "";

    SET @sql = CONCAT(
      "CREATE TABLE IF NOT EXISTS data_option_detail_has_study_phase ( ",
        "data_option_detail_id INT UNSIGNED NOT NULL, ",
        "study_phase_id INT UNSIGNED NOT NULL, ",
        "update_timestamp TIMESTAMP NOT NULL, ",
        "create_timestamp TIMESTAMP NOT NULL, ",
        "PRIMARY KEY (data_option_detail_id, study_phase_id), ",
        "INDEX fk_study_phase_id (study_phase_id ASC), ",
        "INDEX fk_data_option_detail_id (data_option_detail_id ASC), ",
        "CONSTRAINT fk_data_option_detail_has_study_phase_data_option_detail_id ",
          "FOREIGN KEY (data_option_detail_id) ",
          "REFERENCES data_option_detail (id) ",
          "ON DELETE CASCADE ",
          "ON UPDATE CASCADE, ",
        "CONSTRAINT fk_data_option_detail_has_study_phase_study_phase_id ",
          "FOREIGN KEY (study_phase_id) ",
          "REFERENCES ", @cenozo, ".study_phase (id) ",
          "ON DELETE NO ACTION ",
          "ON UPDATE NO ACTION) ",
      "ENGINE = InnoDB" );
    PREPARE statement FROM @sql;
    EXECUTE statement;
    DEALLOCATE PREPARE statement;

    -- QUESTIONNAIRE DATA OPTION DETAILS

    -- Socio-Demographic Characteristics
    CALL set_study_phase( "Age (AGE)", "Baseline" );
    CALL set_study_phase( "Sex (SEX)", "Baseline" );
    CALL set_study_phase( "Education (ED)", "all" );
    CALL set_study_phase( "Country of birth (SDC)", "Baseline" );
    CALL set_study_phase( "Province of residence (SDC)", "all" );
    CALL set_study_phase( "Urban/Rural Classification (SDC)", "all" );
    CALL set_study_phase( "Ethnicity (SDC)", "Baseline" );
    CALL set_study_phase( "Culture (SDC)", "Baseline" );
    CALL set_study_phase( "Language (SDC)", "Baseline" );
    CALL set_study_phase( "Religion (SDC)", "all" );
    CALL set_study_phase( "Marital status (SDC)", "all" );
    CALL set_study_phase( "Sexual orientation (SDC)", "all" );
    CALL set_study_phase( "Income (INC)", "all" );
    CALL set_study_phase( "Wealth (WEA)", "all" );
    CALL set_study_phase( "Home Ownership (OWN)", "all" );
    CALL set_study_phase( "Veteran Identifiers (VET)", "Baseline" );
    CALL set_study_phase( "Gender Identity (GED)", "Follow-up 1" );

    -- Lifestyle and Behaviour
    CALL set_study_phase( "Smoking (SMK)", "all" );
    CALL set_study_phase( "Alcohol Use (ALC)", "all" );
    CALL set_study_phase( "Nutrition: Short Diet Questionnaire (NUT; COM)", "all" );
    CALL set_study_phase( "Dietary Supplement Use (DSU)", "Baseline" );
    CALL set_study_phase( "Nutritional Risk (NUR)", "all" );
    CALL set_study_phase( "Physical Activities (PA2)", "all" );
    CALL set_study_phase( "Dietary Supplement Use (DSU; TRM)", "Follow-up 1" );

    -- Physical Health I
    CALL set_study_phase( "Self-report Height and Weight (HWT; TRM)", "all" );
    CALL set_study_phase( "Measured Height and Weight (WGT, HGT; COM)", "all" );
    CALL set_study_phase( "General Health (GEN)", "all" );
    CALL set_study_phase( "General Health - open text on healthy aging", "all" );
    CALL set_study_phase( "Women’s Health (WHO)", "all" );
    CALL set_study_phase( "Vision (VIS)", "all" );
    CALL set_study_phase( "Hearing (HRG)", "all" );
    CALL set_study_phase( "Oral Health (ORH)", "all" );
    CALL set_study_phase( "Functional Status (FUL)", "all" );
    CALL set_study_phase( "Sleep (SLE; COM)", "all" );
    CALL set_study_phase( "Snoring (SNO; COM)", "all" );
    CALL set_study_phase( "Pain and Discomfort (HUP)", "all" );
    CALL set_study_phase( "Injuries (INJ)", "all" );
    CALL set_study_phase( "Falls (FAL)", "all" );
    CALL set_study_phase( "FBaselines and Consumer Products (FAL)", "Baseline" );
    CALL set_study_phase( "Health Care Utilization (HCU)", "all" );
    CALL set_study_phase( "Preventative Health Behaviours (PHB)", "Follow-up 1" );
    CALL set_study_phase( "Hearing Handicap Inventory for the Elderly (HRG)", "Follow-up 1" );
    CALL set_study_phase( "Unmet Health Care Needs (MET)", "Follow-up 1" );
    CALL set_study_phase( "Osteoarthritis or arthritis (CCT/CCC)", "all" );
    CALL set_study_phase( "Respiratory (CCT/CCC)", "all" );
    CALL set_study_phase( "Cardiovascular (CCT/CCC)", "all" );
    CALL set_study_phase( "Stroke (CCT/CCC)", "all" );
    CALL set_study_phase( "Neurological (CCT/CCC)", "all" );
    CALL set_study_phase( "Gastrointestinal (CCT/CCC)", "all" );
    CALL set_study_phase( "Diseases of the eye (CCT/CCC)", "all" );
    CALL set_study_phase( "Cancer (CCT/CCC)", "all" );
    CALL set_study_phase( "Mental Health (CCT/CCC)", "all" );
    CALL set_study_phase( "Other Conditions (CCT/CCC)", "all" );
    CALL set_study_phase( "Infections (CCT/CCC)", "all" );

    -- Physical Health II
    CALL set_study_phase( "Disease Algorithms and Disease Symptoms", "all" );
    CALL set_study_phase( "Diabetes (DIA; COM)", "all" );
    CALL set_study_phase( "Stroke/Cerebrovascular Event (STR; COM)", "all" );
    CALL set_study_phase( "Traumatic Brain Injury (TBI; COM)", "all" );
    CALL set_study_phase( "Hypo and Hyperthyroidism (HYP; COM)", "all" );
    CALL set_study_phase( "Hypertension (HBP; COM)", "all" );
    CALL set_study_phase( "Ischemic Heart Disease (IHD; COM)", "all" );
    CALL set_study_phase( "WHO Rose Questionnaire (ROS; COM)", "all" );
    CALL set_study_phase( "Osteoarthritis of the Hand (OSA; COM)", "all" );
    CALL set_study_phase( "Osteoarthritis of the Hip (OSH; COM)", "all" );
    CALL set_study_phase( "Osteoarthritis of the Knee (OSK; COM)", "all" );
    CALL set_study_phase( "Musculoskeletal: Other (OAR; COM)", "all" );
    CALL set_study_phase( "Osteoporosis (OST; COM)", "all" );
    CALL set_study_phase( "Neuro-psychiatric (DPR; COM)", "all" );
    CALL set_study_phase( "Parkinsonism (PKD)", "all" );
    CALL set_study_phase( "Chronic Airflow Obstruction (CAO; COM)", "all" );
    CALL set_study_phase( "Medication Use (MED; TRM)", "all" );
    CALL set_study_phase( "Medications (MEDI; not yet available)", "all" );
    CALL set_study_phase( "Epilepsy (EPI)", "Follow-up 1" );

    -- Psychological Health
    CALL set_study_phase( "Depression (DEP)", "all" );
    CALL set_study_phase( "Posttraumatic Stress Disorder (PSD)", "Baseline" );
    CALL set_study_phase( "Psychological Distress (K10; COM)", "all" );
    CALL set_study_phase( "Personality Traits (PER; COM)", "all" );
    CALL set_study_phase( "Satisfaction with Life (SLS)", "all" );
    CALL set_study_phase( "Loneliness Scale (LON)", "Follow-up 1" );
    CALL set_study_phase( "Childhood Maltreatment and Health Across the Lifespan (CEX)", "Follow-up 1" );
    CALL set_study_phase( "Elder Abuse (PSY)", "Follow-up 1" );

    -- Cognition - metadata & scores
    CALL set_study_phase( "REYI (COG)", "all" );
    CALL set_study_phase( "REYII (COG)", "all" );
    CALL set_study_phase( "Animal Fluency Test (COG)", "all" );
    CALL set_study_phase( "Mental Alternation Test (COG)", "all" );
    CALL set_study_phase( "Time-Based Prospective Memory Test (TMT; COM)", "all" );
    CALL set_study_phase( "Event-Based Prospective Memory Test (PMT; COM)", "all" );
    CALL set_study_phase( "Stroop - Victoria Version (STP; COM)", "all" );
    CALL set_study_phase( "Controlled Oral Word Association (FAS; COM)", "all" );
    CALL set_study_phase( "Choice Reaction Time (CRT; COM)", "all" );
    CALL set_study_phase( "Meta Memory (MEM)", "Follow-up 1" );
    CALL set_study_phase( "Subjective Cognitive Decline (SCD)", "Follow-up 1" );

    -- Labour Force
    CALL set_study_phase( "Retirement Status (RET)", "all" );
    CALL set_study_phase( "Pre-Retirement Labour Force Participation (LFP)", "all" );
    CALL set_study_phase( "Pre-Retirement Labour Force Participation - open text question", "all" );
    CALL set_study_phase( "Labour Force (LBF)", "all" );
    CALL set_study_phase( "Labour Force - open text question", "all" );
    CALL set_study_phase( "Retirement Planning (RPL)", "all" );
    CALL set_study_phase( "Work Limitations Questionnaire (WLQ)", "Follow-up 1" );

    -- Social Health
    CALL set_study_phase( "Social Networks (SN)", "all" );
    CALL set_study_phase( "Social Support - Availability (SSA)", "all" );
    CALL set_study_phase( "Social Participation (SPA)", "all" );
    CALL set_study_phase( "Care Receiving 1 / Formal Care (CR1)", "all" );
    CALL set_study_phase( "Care Receiving 2 / Informal Care (CR2)", "all" );
    CALL set_study_phase( "Care Giving (CAG)", "all" );
    CALL set_study_phase( "Social Inequality (SEQ)", "all" );
    CALL set_study_phase( "Online Social Networking (INT)", "all" );
    CALL set_study_phase( "Transportation, Mobility, Migration (TRA)", "all" );
    CALL set_study_phase( "Built Environments (ENV)", "all" );
    CALL set_study_phase( "Social Cohesion (SPA)", "Follow-up 1" );

    -- PHYSICAL ASSESSMENT DATA OPTION DETAILS

    -- Physical Assessments I
    CALL set_study_phase( "Contraindications Questionnaire", "all" );
    CALL set_study_phase( "Weight and Height", "all" );
    CALL set_study_phase( "Body Mass Index (HWT)", "all" );
    CALL set_study_phase( "Hip and Waist Circumference (WHC)", "all" );
    CALL set_study_phase( "4 Metre Walk (WLK)", "all" );
    CALL set_study_phase( "Timed Get Up and Go (TUG)", "all" );
    CALL set_study_phase( "Standing Balance (BAL)", "all" );
    CALL set_study_phase( "Chair Rise: Balance and Coordination (CR)", "all" );
    CALL set_study_phase( "Grip Strength (GS)", "all" );
    CALL set_study_phase( "Basic Activities of Daily Living (ADL)", "all" );
    CALL set_study_phase( "Instrumental Activities of Daily Living (IAL)", "all" );
    CALL set_study_phase( "Life Space Index (LSI; COM)", "all" );
    CALL set_study_phase( "Pulse Rate & Blood Pressure (BP)", "all" );

    -- Bio-Impedance by DEXA
    CALL set_study_phase( "Body Composition (Whole Body & Body Parts) (DXA)", "all" );

    -- Physical Assessments II
    CALL set_study_phase( "Spirometry (SPR)", "all" );
    CALL set_study_phase( "Hearing (HRG)", "all" );
    CALL set_study_phase( "Visual Acuity (VA)", "all" );
    CALL set_study_phase( "Tonometry (TON)", "all" );
    CALL set_study_phase( "Electrocardiogram (ECG)", "all" );
    CALL set_study_phase( "Carotid Intima Media Thickness (CI)", "all" );

    -- Bone Density by DEXA
    CALL set_study_phase( "Whole Body", "all" );
    CALL set_study_phase( "Body Parts", "all" );
    CALL set_study_phase( "Dual Hip (not yet available)", "all" );
    CALL set_study_phase( "Forearm (not yet available)", "all" );

    -- BIOMARKER DATA OPTION DETAILS

    -- Hematology Report
    CALL set_study_phase( "White blood cells (WBC)", "all" );
    CALL set_study_phase( "Lymphocytes (relative number) (LY_PER)", "all" );
    CALL set_study_phase( "Monocytes (relative number) (MO_PER)", "all" );
    CALL set_study_phase( "Granulocytes (relative number) (GR_PER)", "all" );
    CALL set_study_phase( "Lymphocytes (absolute number) (LY_NB)", "all" );
    CALL set_study_phase( "Monocytes (absolute number) (MO_NB)", "all" );
    CALL set_study_phase( "Granulocytes (absolute number) (GR_NB)", "all" );
    CALL set_study_phase( "Red blood cells (RBC)", "all" );
    CALL set_study_phase( "Hemoglobin (Hgb)", "all" );
    CALL set_study_phase( "Hematocrit (Hct)", "all" );
    CALL set_study_phase( "Mean corpuscular volume (MCV)", "all" );
    CALL set_study_phase( "Mean corpuscular hemoglobin (MCH)", "all" );
    CALL set_study_phase( "Mean corpuscular hemoglobin concentration (MCHC)", "all" );
    CALL set_study_phase( "Red blood cell distribution width (RDW)", "all" );
    CALL set_study_phase( "Platelets (Plt)", "all" );
    CALL set_study_phase( "Mean platelet volume (MPV)", "all" );

    -- Chemistry Report
    CALL set_study_phase( "Albumin (ALB)", "all" );
    CALL set_study_phase( "Alanine aminotransferase (ALT)", "all" );
    CALL set_study_phase( "High Sensitivity C-reactive protein (HSCRP)", "all" );
    CALL set_study_phase( "Creatinine (CREAT)", "all" );
    CALL set_study_phase( "Total Cholesterol (CHOL)", "all" );
    CALL set_study_phase( "Ferritin (FERR)", "all" );
    CALL set_study_phase( "Free Thyroxine (FT4)", "all" );
    CALL set_study_phase( "High-Density Lipoprotein (HDL)", "all" );
    CALL set_study_phase( "Low-Density Lipoprotein (LDL)", "all" );
    CALL set_study_phase( "Non-High Density Lipoprotein (non-HDL)", "all" );
    CALL set_study_phase( "Thyroid Stimulating Hormone (TSH)", "all" );
    CALL set_study_phase( "Triglycerides (TRIG)", "all" );
    CALL set_study_phase( "25 - Hydroxyvitamin D (VITD)", "all" );
    CALL set_study_phase( "Hemoglobin A1c (HBA1c; N = 26,961)", "all" );
    CALL set_study_phase( "Glomerular Filtration Rate estimate (eGFR)", "all" );

    -- GENOMIC DATA OPTION DETAILS

    -- Genomics (N=9,896)
    CALL set_study_phase( "Genotypes (Affymetrix Axiom array, 794k SNPs)", "all" );
    CALL set_study_phase( "Imputation (Haplotype Reference Consortium release 1.1, 39.2M SNPs)", "all" );

    -- LINKED DATA DATA OPTION DETAILS

    -- Air Quality
    CALL set_study_phase( "Nitrogen Dioxide", "all" );
    CALL set_study_phase( "Sulfur Dioxide", "all" );
    CALL set_study_phase( "Ozone", "all" );
    CALL set_study_phase( "Fine Particulate Matter", "all" );
    CALL set_study_phase( "Proximity to Roadways", "all" );

    -- Neighborhood Factors
    CALL set_study_phase( "Nighttime Light", "all" );
    CALL set_study_phase( "Material and Social Deprivation Indices", "all" );
    CALL set_study_phase( "Canadian Active Living Environments (Can-ALE) Data", "all" );

    -- Greenness & Weather
    CALL set_study_phase( "Normalized Difference Vegetation Index (NDVI; greenness)", "all" );
    CALL set_study_phase( "Meteorological Data (weather and climate)", "all" );

  END //
DELIMITER ;

CALL patch_data_option_detail_has_study_phase();
DROP PROCEDURE IF EXISTS patch_data_option_detail_has_study_phase;
DROP PROCEDURE IF EXISTS set_study_phase;
