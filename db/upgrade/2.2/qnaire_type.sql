SELECT "Creating new qnaire_type table" AS "";

CREATE TABLE IF NOT EXISTS qnaire_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  section ENUM('baseline', 'mcq') NOT NULL,
  rank INT UNSIGNED NOT NULL,
  category VARCHAR(45) NULL,
  name VARCHAR(45) NOT NULL,
  note VARCHAR(1023) NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_section_rank (section ASC, rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO qnaire_type( section, rank, category, name, note ) VALUES
( 'baseline', 1, NULL, 'Age (AGE)', NULL ),
( 'baseline', 2, NULL, 'Sex (SEX)', NULL ),
( 'baseline', 3, 'Socio-Demographic Characteristics (SDC)', 'Country of birth', NULL ),
( 'baseline', 4, 'Socio-Demographic Characteristics (SDC)', 'Province of residence', NULL ),
( 'baseline', 5, 'Socio-Demographic Characteristics (SDC)', 'Urban / Rural Classification', 'Determined using the Postal Code Conversion File (PCCF) from Statistics Canada.' ),
( 'baseline', 6, 'Socio-Demographic Characteristics (SDC)', 'Ethnicity', NULL ),
( 'baseline', 7, 'Socio-Demographic Characteristics (SDC)', 'Culture', NULL ),
( 'baseline', 8, 'Socio-Demographic Characteristics (SDC)', 'Language', NULL ),
( 'baseline', 9, 'Socio-Demographic Characteristics (SDC)', 'Religion', NULL ),
( 'baseline', 10, 'Socio-Demographic Characteristics (SDC)', 'Marital status', NULL ),
( 'baseline', 11, 'Socio-Demographic Characteristics (SDC)', 'Sexual orientation', NULL ),
( 'baseline', 12, NULL, 'Home Ownership (OWN)', NULL ),
( 'baseline', 13, NULL, 'Education (ED)', NULL ),
( 'baseline', 14, NULL, 'Veteran Identifiers (VET)', NULL ),
( 'baseline', 15, NULL, 'Height and Weight (HWT)', NULL ),
( 'baseline', 16, NULL, 'Smoking (SMK)', NULL ),
( 'baseline', 17, NULL, 'Alcohol Use (ALC)', NULL ),
( 'baseline', 18, NULL, 'General Health (GEN)', NULL ),
( 'baseline', 19, NULL, 'General Health – open text question (qualitative)', NULL ),
( 'baseline', 20, NULL, 'Nutrition: Short Diet Questionnaire (NUT)', NULL ),
( 'baseline', 21, NULL, 'Women’s Health (WHO)', NULL ),
( 'baseline', 22, NULL, 'Vision (VIS)', NULL ),
( 'baseline', 23, NULL, 'Hearing (HRG)', NULL );
