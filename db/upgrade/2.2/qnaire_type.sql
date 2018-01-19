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
( 'baseline', 24, NULL, '', NULL );
( 'baseline', 25, NULL, '', NULL );
( 'baseline', 26, NULL, '', NULL );
( 'baseline', 27, NULL, '', NULL );
( 'baseline', 28, NULL, '', NULL );
( 'baseline', 29, NULL, '', NULL );
( 'baseline', 30, NULL, '', NULL );
( 'baseline', 31, NULL, '', NULL );
( 'baseline', 32, NULL, '', NULL );
( 'baseline', 33, NULL, '', NULL );
( 'baseline', 34, NULL, '', NULL );
( 'baseline', 35, NULL, '', NULL );
( 'baseline', 36, NULL, '', NULL );
( 'baseline', 37, NULL, '', NULL );
( 'baseline', 38, NULL, '', NULL );
( 'baseline', 39, NULL, '', NULL );
( 'baseline', 40, NULL, '', NULL );
( 'baseline', 41, NULL, '', NULL );
( 'baseline', 42, NULL, '', NULL );
( 'baseline', 43, NULL, '', NULL );
( 'baseline', 44, NULL, '', NULL );
( 'baseline', 45, NULL, '', NULL );
( 'baseline', 46, NULL, '', NULL );
( 'baseline', 47, NULL, '', NULL );
( 'baseline', 48, NULL, '', NULL );
( 'baseline', 49, NULL, '', NULL );
( 'baseline', 50, NULL, '', NULL );
( 'baseline', 51, NULL, '', NULL );
( 'baseline', 52, NULL, '', NULL );
( 'baseline', 53, NULL, '', NULL );
( 'baseline', 54, NULL, '', NULL );
( 'baseline', 55, NULL, '', NULL );
( 'baseline', 56, NULL, '', NULL );
( 'baseline', 57, NULL, '', NULL );
( 'baseline', 58, NULL, '', NULL );
( 'baseline', 59, NULL, '', NULL );
( 'baseline', 60, NULL, '', NULL );
( 'baseline', 61, NULL, '', NULL );
( 'baseline', 62, NULL, '', NULL );
( 'baseline', 63, NULL, '', NULL );
( 'baseline', 64, NULL, '', NULL );
( 'baseline', 65, NULL, '', NULL );
( 'baseline', 66, NULL, '', NULL );
( 'baseline', 67, NULL, '', NULL );
( 'baseline', 68, NULL, '', NULL );
( 'baseline', 69, NULL, '', NULL );
( 'baseline', 70, NULL, '', NULL );
( 'baseline', 71, NULL, '', NULL );
( 'baseline', 72, NULL, '', NULL );
( 'baseline', 73, NULL, '', NULL );
( 'baseline', 74, NULL, '', NULL );
( 'baseline', 75, NULL, '', NULL );
( 'baseline', 76, NULL, '', NULL );
( 'baseline', 77, NULL, '', NULL );
( 'baseline', 78, NULL, '', NULL );
( 'baseline', 79, NULL, '', NULL );
( 'baseline', 80, NULL, '', NULL );
( 'baseline', 81, NULL, '', NULL );
( 'baseline', 82, NULL, '', NULL );
( 'baseline', 83, NULL, '', NULL );
( 'baseline', 84, NULL, '', NULL );
( 'baseline', 85, NULL, '', NULL );
( 'baseline', 86, NULL, '', NULL );
( 'baseline', 87, NULL, '', NULL );
( 'baseline', 88, NULL, '', NULL );
( 'baseline', 89, NULL, '', NULL );
( 'baseline', 90, NULL, '', NULL );
