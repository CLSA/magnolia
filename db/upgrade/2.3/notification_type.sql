SELECT "Adding missing text to notification types" AS "";

INSERT INTO notification_type ( name, title_en, title_fr, message_en, message_fr ) VALUES (
  "Action required",
  "CLSA Data Access - ACTION REQUIRED",
  "Accès aux données de l’ÉLCV — ACTION REQUISE",
  "Dear Dr. {{applicant_name}},

An action is required on your application number {{identifier}}, entitled {{title}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/). Look for the flashing heading(s) within the requisition and then the “Attention” box on the page(s). Follow the instructions given to remedy the issue. Once you are sure you have made all the revisions, re-submit the application.

Your application will continue through the review process and you will be contacted with the outcome at a later date.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  "Bonjour Dr {{applicant_name}},

Votre demande d’accès {{identifier}}, intitulée {{title}}, requiert votre attention.

Connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/), et cherchez la ou les sections clignotantes dans la demande. Vous verrez une case « Attention » sur la ou les pages qui requièrent votre attention. Suivez les instructions qui s’y trouvent pour résoudre le problème. Quand vous serez certain(e) d’avoir effectué toutes les modifications, veuillez soumettre la demande à nouveau.

Votre demande passera alors à la prochaine étape du processus d’évaluation et vous serez contacté(e) avec le résultat à une date ultérieure.

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV"
), (
  "Requisition Reactivated",
  "CLSA Data Access - Reactivated",
  "Accès aux données de l’ÉLCV — Demande réactivée",
  "Dear Dr. {{applicant_name}},

Your application number {{identifier}}, entitled {{title}}, has been reactivated.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
"Bonjour Dr {{applicant_name}},

Votre demande d’accès {{identifier}}, intitulée {{title}}, a été réactivée.

Pour accéder à votre demande, connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/).

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV"
), (
  "Notice of decision",
  "CLSA Data Access - Notice of Decision",
  "Accès aux données de l’ÉLCV — Avis de décision",
  "Dear Dr. {{applicant_name}},

The Notice of Decision is ready for your application number {{identifier}}, entitled {{title}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), where you will be able to consult the Notice.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  "Bonjour Dr {{applicant_name}},

Un avis de décision est disponible pour votre demande d’accès {{identifier}}, intitulée {{title}}.

Pour consulter l’avis, connectez-vous à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/).

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV"
), (
  "Final report required",
  "CLSA Data Access - Final Report Required",
  "Accès aux données de l’ÉLCV — Rapport final requis",
  "Dear Dr. {{applicant_name}},

As per your CLSA Access Agreement, you are required to submit a Final Report for your application number {{identifier}}, entitled {{title}}.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/), where you will be able to complete the Final Report.

If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  "Bonjour Dr {{applicant_name}},

Comme indiqué dans votre Entente d’accès aux données de l’ÉLCV, vous devez soumettre un rapport final pour la demande d’accès {{identifier}}, intitulée {{title}}.

En vous connectant à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/), vous pourrez remplir le rapport final.

Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV"
), (
  "Data Available",
  "CLSA Data Access - Data is Available",
  "Accès aux données de l’ÉLCV — Données disponibles",
  "Dear Dr. {{applicant_name}},

The download link to your dataset for the application number {{identifier}}, entitled {{title}}, is now available.
As per your CLSA Access Agreement, only those members of the project team who have signed Schedule F or an approved Amendment of the CLSA Access Agreement are permitted to have direct access to the dataset. Do not forward this link to anyone who has not signed Schedule F or an approved Amendment.

Please log in to the CLSA online data application software, Magnolia (https://magnolia.clsa-elcv.ca/live/gl/) to access your application where you will find the  download link to your dataset.
We have also included:
  1) An Instruction document on how to share the dataset with approved members of your Project Team
  2) An Information document to help you make the most of your dataset and
  3) A Guidance document on the use of the access@clsa-elcv.ca email.

On behalf of the CLSA, we wish you much success with your project. If you have any questions, please contact us at access@clsa-elcv.ca.

The CLSA Data Access Team",
  "Bonjour Dr {{applicant_name}},

Le lien pour télécharger votre ensemble de données pour la demande d’accès {{identifier}}, intitulée {{title}}, est maintenant disponible.

Conformément à votre Entente d’accès aux données de l’ÉLCV, seuls les membres de l’équipe de projet qui ont signé l’annexe F ou une demande de modification acceptée de l’Entente d’accès à l’ÉLCV sont autorisés à avoir un accès direct à l’ensemble de données. Ne transmettez pas ce lien à quiconque n’a pas signé l’annexe F ou la demande de modification acceptée.

En vous connectant à Magnolia, le logiciel de demande d’accès aux données en ligne de l’ÉLCV (https://magnolia.clsa-elcv.ca/live/gl/), vous trouverez le lien qui vous permettra de télécharger votre ensemble de données.

Nous avons également inclus :
  1) De l’information sur la méthode à utiliser pour partager l’ensemble de données avec les membres autorisés de votre équipe de projet.
  2) De l’information pour vous aider à tirer le meilleur parti de votre ensemble de données.
  3) Des lignes directrices sur l’utilisation du courrier électronique access@clsa-elcv.ca.

Au nom de l’ÉLCV, nous vous souhaitons beaucoup de succès dans votre projet. Si vous avez des questions, veuillez nous contacter à access@clsa-elcv.ca.

L’équipe d’accès aux données de l’ÉLCV"
)
ON DUPLICATE KEY UPDATE
  title_en = VALUES( title_en ),
  title_fr = VALUES( title_fr ),
  message_en = VALUES( message_en ),
  message_fr = VALUES( message_fr );
