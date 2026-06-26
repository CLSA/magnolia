SELECT "Adding 'Thesis' as a new output type" AS "";

INSERT IGNORE INTO output_type SET
  name_en = "Thesis or Dissertation",
  name_fr = "Thèse ou mémoire",
  note_en = "Format: Author AA, Author BB. Title [dissertation/ master’s thesis on the internet]. Location of Publication: Name of Postsecondary Institution; Year of publication [cited YYYY MMM DD]. # pg. Available from: URL.",
  note_fr = "Modèle : Auteur AA, Auteur BB. Titre [thèse ou mémoire de maîtrise sur Internet]. Lieu de la publication : nom de l’établissement postsecondaire; année de publication [cité le JJ MM AAAA]. Nombre de pages. Repéré à URL.";
