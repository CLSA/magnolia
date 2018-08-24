SELECT "Creating new data_option table" AS "";

CREATE TABLE IF NOT EXISTS data_option (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  data_option_category_id INT UNSIGNED NOT NULL,
  rank INT UNSIGNED NOT NULL,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_data_option_category_id (data_option_category_id ASC),
  UNIQUE INDEX uq_data_option_category_id_rank (data_option_category_id ASC, rank ASC),
  CONSTRAINT fk_data_option_data_option_category_id
    FOREIGN KEY (data_option_category_id)
    REFERENCES data_option_category (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 1;

INSERT IGNORE INTO data_option( data_option_category_id, rank, name_en, name_fr ) VALUES
( @data_option_category_id, 1, "Socio-Demographic Characteristics", "Caractéristiques socio-démographiques" ),
( @data_option_category_id, 2, "Lifestyle and Behaviour", "Style de vie et comportement" ),
( @data_option_category_id, 3, "Physical Health I", "Santé physique I" ),
( @data_option_category_id, 4, "Self-reported Chronic Conditions", "Problèmes de santé chroniques autodéclarés" ),
( @data_option_category_id, 5, "Physical Health II", "Santé physique II" ),
( @data_option_category_id, 6, "Psychological Health", "Santé mentale" ),
( @data_option_category_id, 7, "Cognition - metadata & scores", "Cognition - métadonnées et cotation" ),
( @data_option_category_id, 8, "Labour Force", "Population active" ),
( @data_option_category_id, 9, "Social Health", "Santé sociale" );

SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 2;

INSERT IGNORE INTO data_option( data_option_category_id, rank, name_en, name_fr ) VALUES
( @data_option_category_id, 1, "Physical Assessments I", "Évaluations physiques I" ),
( @data_option_category_id, 2, "Bio-Impedance by DEXA", "Bio-impédance par DEXA (DXA)" ),
( @data_option_category_id, 3, "Physical Assessments II", "Évaluations physiques II" ),
( @data_option_category_id, 4, "Bone Density by DEXA", "Densité osseuse par DEXA (DXA)" );

SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 3;

INSERT IGNORE INTO data_option( data_option_category_id, rank, name_en, name_fr ) VALUES
( @data_option_category_id, 1, "Hematology Report", "Rapport hématologique" ),
( @data_option_category_id, 2, "Chemistry Report", "Rapport de chimie" );

SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 4;

INSERT IGNORE INTO data_option( data_option_category_id, rank, name_en, name_fr ) VALUES
( @data_option_category_id, 1, "Genomics (N=9,896)", "Génomique (N=9,896)" );

SELECT id INTO @data_option_category_id FROM data_option_category WHERE rank = 5;

INSERT IGNORE INTO data_option( data_option_category_id, rank, name_en, name_fr ) VALUES
( @data_option_category_id, 1, "Air Quality", "Qualité de l'air" ),
( @data_option_category_id, 2, "Neighborhood Factors", "Facteurs de voisinage" ),
( @data_option_category_id, 3, "Greenness & Weather", "Verdure & Météo" );
