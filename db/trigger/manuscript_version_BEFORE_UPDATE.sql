CREATE TRIGGER manuscript_version_BEFORE_UPDATE BEFORE UPDATE ON manuscript_version FOR EACH ROW
BEGIN
  IF( NEW.clsa_title ) THEN SET NEW.clsa_title_justification = NULL; END IF;
  IF( NEW.clsa_keyword ) THEN SET NEW.clsa_keyword_justification = NULL; END IF;
  IF( NEW.clsa_reference ) THEN SET NEW.clsa_reference_justification = NULL; ELSE SET NEW.clsa_reference_number = NULL; END IF;
  IF( NEW.genomics = 0 ) THEN SET NEW.genomics_number = NULL; END IF;
  IF( NEW.disclaimer ) THEN SET NEW.disclaimer_justification = NULL; END IF;
  IF( NEW.statement IN ("yes", "nr") ) THEN SET NEW.statement_justification = NULL; END IF;
END ;;