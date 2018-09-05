SELECT "Creating new production_type table" AS "";

CREATE TABLE IF NOT EXISTS production_type (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  update_timestamp TIMESTAMP NOT NULL,
  create_timestamp TIMESTAMP NOT NULL,
  rank INT NOT NULL,
  name_en VARCHAR(127) NOT NULL,
  name_fr VARCHAR(127) NOT NULL,
  note_en VARCHAR(255) NULL DEFAULT NULL,
  note_fr VARCHAR(255) NULL DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX uq_rank (rank ASC))
ENGINE = InnoDB;

INSERT IGNORE INTO production_type( rank, name_en, name_fr, note_en, note_fr ) VALUES
( 1, "Peer-reviewed publication", "Publication évaluées par des pairs", "Format: Author, A. (Publication Year). Article title. Periodical Title, Volume (Issue), pp.-pp.", "Format : Auteur, A. (année de publication). Titre de l’article. Titre du périodique, Volume (numéro), pp.-pp." ),
( 2, "Conference paper and presentation", "Act de conférence et présentation", "Format: Author, A. (Publication Year). Title of Paper or Proceedings, Title of Conference, Location, Date.  Place of publication: Publisher.", "Format : Auteur, A. (année de publication). Titre de l’article ou de l’acte, titre de la conférence, lieu, date.  Lieu de publication : Éditeur." ),
( 3, "Mass media", "Média", "Format: Author, A. (Publication Year). Article title. Retrieved from (URL) on (Date).", "Format : Auteur, A. (année de publication). Titre de l’article. Tiré de (URL) le (Date)." ),
( 4, "Website, technologie, equipment or technique", "TRANSLATION REQUIRED", NULL, NULL ),
( 5, "Invention, patent application, or license", "Invention, demande de brevet ou de licence", NULL, NULL ),
( 6, "Derived Data", "TRANSLATION REQUIRED", "Derived variable, model, database, audio or video product, software, educational aid or curricula", "Variables dérivée, modèle, base de donnée, document audio ou vidéo, logiciel, outil ou programme éducatif" ),
( 7, "Collaboration", "Collaboration", "Partnerships with academic institutions, non-profits, industrial or commercial firms, governments, or school systems.", "Partenariats avec des établissements universitaires, des organismes à but non lucratif, des entreprises industrielles ou commerciales, des gouvernements ou les milieux scolaires." );
