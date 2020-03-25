SELECT "Replacing 'graduate' services with 'applicant' services" AS "";

UPDATE service SET subject = "applicant" WHERE subject = "graduate";
