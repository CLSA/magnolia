SELECT "Adding missing text to notification types" AS "";

UPDATE notification_type
SET title_en = "CLSA Data Access - ACTION REQUIRED",
message_en = "Dear Applicant,

An action is required on your application number {{identifier}}, entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Please look for the flashing heading(s) within the requisition and then the “Attention” box on the page(s). Follow the instructions given to remedy the issue. Once you are sure you have made ALL the revisions, please re-submit the application.

Your re-submitted application will continue through the review process and you will be contacted with the outcome at a later date.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team"
WHERE name = "Action required";

UPDATE notification_type
SET title_en = "CLSA Data Access - Reactivated",
message_en = "Dear Applicant,

Your application number {{identifier}}, entitled \"{{title}}\", has been reactivated.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca. 

The CLSA Data Access Team"
WHERE name = "Requisition Reactivated";

UPDATE notification_type
SET title_en = "CLSA Data Access - Notice of Decision",
message_en = "Dear Applicant,

The Notice of Decision is ready for your application number {{identifier}}, entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca. 

The CLSA Data Access Team"
WHERE name = "Notice of decision";

UPDATE notification_type
SET title_en = "CLSA Data Access - Final Report Required",
message_en = "Dear Applicant,

As per your CLSA Access Agreement for the above-noted project, you are required to submit a Final Report for your application number {{identifier}}, entitled \"{{title}}\".

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application where you will be able to fill in Final Report.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca. 

The CLSA Data Access Team"
WHERE name = "Final report required";

INSERT IGNORE INTO notification_type SET
name = "Data Available",
title_en = "CLSA Data Access - Data is Available",
title_fr = "TRANSLATION REQUIRED",
message_en = "Dear Applicant,

The download link to your dataset for the application number {{identifier}}, entitled \"{{title}}\", is ready.

As per your CLSA Access Agreement, only those members of the project team who have signed Schedule F or an approved Amendment of the CLSA Access Agreement are permitted to have direct access to the dataset. Do not forward this link to anyone who has not signed Schedule F or an approved Amendment.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application where you will find your download link.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca. 

The CLSA Data Access Team",
message_fr = "TRANSLATION REQUIRED";
