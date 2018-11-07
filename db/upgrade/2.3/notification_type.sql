SELECT "Adding missing text to notification types" AS "";

UPDATE notification_type
SET title_en = "CLSA Data Access Application – ACTION REQUIRED",
message_en = "Dear Applicant,

An action is required on your recent application. Please log in to the CLSA online data application (requisition) software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Please look for the flashing heading(s) within the requisition and then the “Attention” box on the page(s). Follow the instructions given to remedy the issue. Once you are sure you have made ALL the revisions, please re-submit the application.

Your re-submitted application will continue through the review process and you will be contacted with the outcome at a later date.

If you have any questions related to data access, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team"
WHERE name = "Action required";
