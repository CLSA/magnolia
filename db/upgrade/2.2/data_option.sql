SELECT "Creating new data_option table" AS "";

CREATE TABLE IF NOT EXISTS data_option (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  data_option_subcategory_id INT UNSIGNED NOT NULL,
  type ENUM('data', 'image', 'comprehensive', 'tracking') NOT NULL,
  replacement_en VARCHAR(255) NULL,
  replacement_fr VARCHAR(255) NULL,
  PRIMARY KEY (id),
  INDEX fk_data_option_subcategory_id (data_option_subcategory_id ASC),
  UNIQUE INDEX uq_data_option_subcategory_id_type (data_option_subcategory_id ASC, type ASC),
  CONSTRAINT fk_data_option_data_option_subcategory_id
    FOREIGN KEY (data_option_subcategory_id)
    REFERENCES data_option_subcategory (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

INSERT IGNORE INTO data_option( data_option_subcategory_id, type, replacement_en, replacement_fr )
SELECT data_option_subcategory.id, temp.type, NULL, NULL
FROM data_option_subcategory, (
  SELECT "comprehensive" AS type UNION
  SELECT "tracking" AS type
) AS temp
WHERE data_option_subcategory.type = "baseline"
ORDER BY data_option_subcategory.rank, temp.type;

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "See Section B: Physical Assessments (WGT, HGT)",
    replacement_fr = "Voir Section B : évaluations physiques (WGT, HGT)"
WHERE data_option.type = "comprehensive"
AND data_option_subcategory.type = "baseline"
AND data_option_subcategory.name_en = "Height and Weight (HWT)";

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not applicable",
    replacement_fr = "Ne s’applique pas"
WHERE data_option.type = "tracking"
AND data_option_subcategory.type = "baseline"
AND data_option_subcategory.name_en IN(
  "Nutrition: Short Diet Questionnaire (NUT)",
  "Medications (MEDI)",
  "Life Space Index (LSI)",
  "Sleep (SLE)",
  "Time-Based (TMT)",
  "Event-Based (PMT)",
  "Stroop - Victoria Version (STP)",
  "Controlled Oral Word Association (FAS)",
  "Choice Reaction Time (CRT)",
  "Diabetes (DIA)",
  "Stroke/Cerebrovascular Event (STR)",
  "Traumatic Brain Injury (TBI)",
  "Hypo and Hyperthyroidism (HYP)",
  "Hypertension (HBP)",
  "Ischemic Heart Disease (IHD)",
  "WHO Rose Questionnaire (ROS)",
  "Osteoarthritis of the Hand (OSA)",
  "Osteoarthritis of the Hip (OSH)",
  "Osteoarthritis of the Knee (OSK)",
  "Musculoskeletal: Other (OAR)",
  "Osteoporosis (OST)",
  "Neuro-psychiatric (DPR)",
  "Chronic Airflow Obstruction (CAO)"
);

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Refer to Maintaining Contact Interview",
    replacement_fr = "Voir l’entrevue de mi-parcours"
WHERE data_option.type = "tracking"
AND data_option_subcategory.type = "baseline"
AND data_option_subcategory.name_en = "Parkinsonism (PKD)";

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not yet available",
    replacement_fr = "Pas encore disponible"
WHERE data_option.type = "comprehensive"
AND data_option_subcategory.type = "baseline"
AND data_option_subcategory.name_en = "Medications (MEDI)";


INSERT IGNORE INTO data_option( data_option_subcategory_id, type, replacement_en, replacement_fr )
SELECT data_option_subcategory.id, temp.type, NULL, NULL
FROM data_option_subcategory, (
  SELECT "comprehensive" AS type UNION
  SELECT "tracking" AS type
) AS temp
WHERE data_option_subcategory.type = "mcq"
ORDER BY data_option_subcategory.rank, temp.type;

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not applicable",
    replacement_fr = "Ne s’applique pas"
WHERE data_option.type = "tracking"
AND data_option_subcategory.type = "mcq"
AND data_option_subcategory.name_en IN (
  "Snoring (SNO)",
  "Psychological Distress (K10)",
  "Personality Traits (PER)"
);

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "See Parkinsonism module above",
    replacement_fr = "Voir le module sur le Parkinsonisme ci-dessus"
WHERE data_option.type = "comprehensive"
AND data_option_subcategory.type = "mcq"
AND data_option_subcategory.name_en = "Parkinsonism (PKD)";

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not applicable",
    replacement_fr = "Ne s’applique pas"
WHERE data_option.type = "comprehensive"
AND data_option_subcategory.type = "mcq"
AND data_option_subcategory.name_en = "Medication Use (MED)";


INSERT IGNORE INTO data_option( data_option_subcategory_id, type, replacement_en, replacement_fr )
SELECT data_option_subcategory.id, temp.type, NULL, NULL
FROM data_option_subcategory, (
  SELECT "data" AS type UNION
  SELECT "image" AS type
) AS temp
WHERE data_option_subcategory.type = "physical"
ORDER BY data_option_subcategory.rank, temp.type;

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not applicable",
    replacement_fr = "Ne s’applique pas"
WHERE data_option.type = "image"
AND data_option_subcategory.type = "physical"
AND data_option_subcategory.name_en IN(
  "Full Questionnaire",
  "Weight (WGT)",
  "Height (HGT)",
  "Body Mass Index (HWT)",
  "Hip and Waist Circumference (WHC)",
  "Pulse rate (BP)",
  "Blood Pressure (BP)",
  "Electrocardiogram (ECG)",
  "Spirometry (SPR)",
  "Body Composition (Whole Body)",
  "Body Composition (Body Parts)",
  "Hearing (HRG)",
  "4 Metre Walk (WLK)",
  "Timed Get Up and Go (TUG)",
  "Standing Balance (BAL)",
  "Chair Rise: Balance and Coordination (CR)",
  "Visual Acuity (VA)",
  "Tonometry (TON)",
  "Grip Strength (GS)"
);

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not yet available",
    replacement_fr = "Pas encore disponible"
WHERE data_option.type = "image"
AND data_option_subcategory.type = "physical"
AND data_option_subcategory.name_en IN(
  "Carotid Intima",
  "Plaque",
  "Whole Body",
  "Body Parts",
  "Dual Hip",
  "Forearm",
  "IVA Lateral Bone",
  "Aortic Calcification",
  "Retinal Scan (RS)"
);

UPDATE data_option
JOIN data_option_subcategory ON data_option.data_option_subcategory_id = data_option_subcategory.id
SET replacement_en = "Not applicable",
    replacement_fr = "Ne s’applique pas"
WHERE data_option.type = "data"
AND data_option_subcategory.type = "physical"
AND data_option_subcategory.name_en IN(
  "Plaque",
  "IVA Lateral Bone",
  "Aortic Calcification",
  "Retinal Scan (RS)"
);

INSERT IGNORE INTO data_option( data_option_subcategory_id, type, replacement_en, replacement_fr )
SELECT data_option_subcategory.id, "data", NULL, NULL
FROM data_option_subcategory
WHERE data_option_subcategory.type = "biomarker"
ORDER BY data_option_subcategory.rank;
