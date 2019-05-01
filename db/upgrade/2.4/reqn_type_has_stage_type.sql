SELECT "Creating new reqn_type_has_stage_type table" AS "";

CREATE TABLE IF NOT EXISTS reqn_type_has_stage_type (
  reqn_type_id INT UNSIGNED NOT NULL,
  stage_type_id INT UNSIGNED NOT NULL,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  PRIMARY KEY (reqn_type_id, stage_type_id),
  INDEX fk_stage_type_id (stage_type_id ASC),
  INDEX fk_reqn_type_id (reqn_type_id ASC),
  CONSTRAINT fk_reqn_type_has_stage_type_reqn_type_id
    FOREIGN KEY (reqn_type_id)
    REFERENCES reqn_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT fk_reqn_type_has_stage_type_stage_type_id
    FOREIGN KEY (stage_type_id)
    REFERENCES stage_type (id)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

-- Consortium and standard requisition types
INSERT IGNORE INTO reqn_type_has_stage_type( reqn_type_id, stage_type_id )
SELECT reqn_type.id, stage_type.id
FROM reqn_type, stage_type
WHERE reqn_type.name IN ( "Consortium", "Standard" )
AND stage_type.name IN(
  "New", "Admin Review", "SAC Review", "DSAC Selection", "DSAC Review",
  "SMT Decision", "Revision Required", "Second DSAC Decision", "Second SMT Decision",
  "Decision Made", "Revision Recommended", "Agreement", "Data Release",
  "Active", "Report Required", "Not Approved", "Complete"
);

-- Internal, methods, partnership and special project requisition types
INSERT IGNORE INTO reqn_type_has_stage_type( reqn_type_id, stage_type_id )
SELECT reqn_type.id, stage_type.id
FROM reqn_type, stage_type
WHERE reqn_type.name IN ( "Internal", "Methods", "Partnership", "Special Project" )
AND stage_type.name IN(
  "New", "Admin Review", "SAC Review",
  "SMT Decision", "Revision Required", "Second SMT Decision",
  "Decision Made", "Revision Recommended", "Agreement", "Data Release",
  "Active", "Report Required", "Not Approved", "Complete"
);

-- Catalyst grant requisition type
INSERT IGNORE INTO reqn_type_has_stage_type( reqn_type_id, stage_type_id )
SELECT reqn_type.id, stage_type.id
FROM reqn_type, stage_type
WHERE reqn_type.name = "Catalyst Grant"
AND stage_type.name IN(
  "New", "Admin Review", "SAC Review",
  "Agreement", "Data Release", "Active", "Report Required", "Complete"
);
