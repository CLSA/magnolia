SELECT "Creating new data_release table" AS "";

CREATE TABLE IF NOT EXISTS data_release (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  reqn_id INT UNSIGNED NOT NULL,
  data_version_id INT UNSIGNED NOT NULL,
  category ENUM('standard', 'amendment', 'data release update') NOT NULL DEFAULT 'standard',
  date DATE NOT NULL,
  PRIMARY KEY (id),
  INDEX fk_reqn_id (reqn_id ASC),
  INDEX fk_data_version_id (data_version_id ASC),
  CONSTRAINT fk_data_release_reqn_id
    FOREIGN KEY (reqn_id)
    REFERENCES reqn (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT fk_data_release_data_version_id
    FOREIGN KEY (data_version_id)
    REFERENCES data_version (id)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SELECT "Populating data_release table" AS "";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190204" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Baseline v3.4" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190204" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190204" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "CANUE" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190204" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Follow-up 1 v1.0" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190204" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Follow-up 1 v1.0" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190204" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Status" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190207" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190215" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-07-02";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190215" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "CANUE" ),
date = "2019-07-02";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190226" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Baseline v3.4" ),
date = "2019-06-03";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190226" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-06-03";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190226" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "CANUE" ),
date = "2019-06-03";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190226" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Follow-up 1 v1.0" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190226" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Follow-up 1 v1.0" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190226" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Status" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190227" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Baseline v3.4" ),
date = "2019-06-03";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190227" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-06-03";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190227" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "CANUE" ),
date = "2019-06-03";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190227" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Follow-up 1 v1.0" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190227" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Follow-up 1 v1.0" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190227" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Status" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190230" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-07-02";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190230" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Follow-up 1 v1.0" ),
date = "2019-07-18";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190230" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Status" ),
date = "2019-07-18";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190233" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Baseline v3.4" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190233" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190233" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "CANUE" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190233" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Follow-up 1 v1.0" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190233" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Follow-up 1 v1.0" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190233" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Status" ),
date = "2019-07-17";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190234" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-06-19";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190234" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Follow-up 1 v1.0" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "190234" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Status" ),
date = "2019-07-16";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA001" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-05-10";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA001" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "GWAS" ),
date = "2019-05-10";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA002" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Tracking Baseline v3.4" ),
date = "2019-05-27";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA002" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-05-27";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA002" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "CANUE" ),
date = "2019-05-27";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA004" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "Comprehensive Baseline v4.0" ),
date = "2019-05-10";

INSERT IGNORE INTO data_release SET
reqn_id = ( SELECT id FROM reqn WHERE identifier = "19CA004" ),
data_version_id = ( SELECT id FROM data_version WHERE name = "GWAS" ),
date = "2019-05-10";
