SELECT "Creating new notification_type table" AS "";

CREATE TABLE IF NOT EXISTS notification_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  name VARCHAR(45) NOT NULL,
  title_en VARCHAR(127) NOT NULL,
  title_fr VARCHAR(127) NOT NULL,
  message_en TEXT NOT NULL,
  message_fr TEXT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_name (name ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO notification_type( name, title_en, title_fr, message_en, message_fr ) VALUES
(
  "Action required",
  "CLSA Data Access Application – ACTION REQUIRED",
  "TRANSLATION REQUIRED",
  "Dear Applicant,

An action is required on your recent application. Please log in to the CLSA online data application (requisition) software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Please look for the flashing heading(s) within the requisition and then the “Attention” box on the page(s). Follow the instructions given to remedy the issue. Once you are sure you have made ALL the revisions, please re-submit the application.

Your re-submitted application will continue through the review process and you will be contacted with the outcome at a later date.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  "TRANSLATION REQUIRED"
), (
  "Requisition Reactivated",
  "TODO: title",
  "TRANSLATION REQUIRED",
  "TODO: This will be the message sent to the applicant to indicate that an abandoned requisition has been reactivated and must be re-submitted.",
  "TRANSLATION REQUIRED"
), (
  "Notice of decision",
  "TODO: title",
  "TRANSLATION REQUIRED",
  "TODO: This will be the message sent to the applicant to indicate that a decision has been made regarding their requisition.",
  "TRANSLATION REQUIRED"
), (
  "Final report required",
  "TODO: title",
  "TRANSLATION REQUIRED",
  "TODO: This will be the message sent to the applicant to indicate that a final report is required.",
  "TRANSLATION REQUIRED"
);
