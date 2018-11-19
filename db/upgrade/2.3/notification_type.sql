SELECT "Adding missing text to notification types" AS "";

REPLACE INTO notification_type ( name, title_en, title_fr, message_en, message_fr ) VALUES (
  "",
  "CLSA Data Access - ACTION REQUIRED",
  "",
  "Dear Dr. {{applicant_name}},

  An action is required on your application number {{identifier}}, entitled {{title}}.

  Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Look for the flashing heading(s) within the requisition and then the “Attention” box on the page(s). Follow the instructions given to remedy the issue. Once you are sure you have made all the revisions, re-submit the application.

  Your application will continue through the review process and you will be contacted with the outcome at a later date.

  If you have any questions, please contact us at access@clsa-elcv.ca.

  The CLSA Data Access Team",
  ""
), (
  "",
  "CLSA Data Access - Reactivated",
  "",
  "Dear Dr. {{applicant_name}},

  Your application number {{identifier}}, entitled {{title}}, has been reactivated.

  Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application.

  If you have any questions, please contact us at access@clsa-elcv.ca. 

  The CLSA Data Access Team",
  ""
), (
  "",
  "CLSA Data Access - Notice of Decision",
  "",
  "Dear Dr. {{applicant_name}},

  The Notice of Decision is ready for your application number {{identifier}}, entitled {{title}}.

  Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), where you will be able to consult the Notice.

  If you have any questions, please contact us at access@clsa-elcv.ca. 

  The CLSA Data Access Team",
  ""
), (
  "",
  "CLSA Data Access - Final Report Required",
  "",
  "Dear Dr. {{applicant_name}},

  As per your CLSA Access Agreement, you are required to submit a Final Report for your application number {{identifier}}, entitled {{title}}.

  Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), where you will be able to complete the Final Report.

  If you have any questions, please contact us at access@clsa-elcv.ca. 

  The CLSA Data Access Team",
  ""
), (
  "",
  "CLSA Data Access - Data is Available",
  "",
  "Dear Dr. {{applicant_name}},

  The download link to your dataset for the application number {{identifier}}, entitled {{title}}, isnow available.
  As per your CLSA Access Agreement, only those members of the project team who have signed Schedule F or an approved Amendment of the CLSA Access Agreement are permitted to have direct access to the dataset. Do not forward this link to anyone who has not signed Schedule F or an approved Amendment.

  Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application where you will find the  download link to your dataset.
  We have also included:
      1) An Instruction document on how to share the dataset with approved members of your Project Team
      2) An Information document to help you make the most of your dataset and 
      3) A Guidance document on the use of the access@clsa-elcv.ca email. 

  On behalf of the CLSA, we wish you much success with your project. If you have any questions, please contact us at access@clsa-elcv.ca.

  The CLSA Data Access Team",
  ""
);
