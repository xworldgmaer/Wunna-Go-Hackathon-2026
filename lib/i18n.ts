import type { HostProfile, RankedExperience, VisitorIntent } from "./types";

export type LanguageCode = "en" | "es" | "fr";

export const LANGUAGES: Array<{
  code: LanguageCode;
  label: string;
  apiLabel: string;
  speechLang: string;
}> = [
  { code: "en", label: "English", apiLabel: "English", speechLang: "en-US" },
  { code: "es", label: "Español", apiLabel: "Spanish", speechLang: "es-ES" },
  { code: "fr", label: "Français", apiLabel: "French", speechLang: "fr-FR" }
];

type Dictionary = Record<string, string>;

const es: Dictionary = {
  "Log in as…": "Iniciar sesión como…",
  Visitor: "Visitante",
  Host: "Anfitrión",
  "Explore and find new experiences": "Explora y descubre nuevas experiencias",
  "Share your experiences and culture": "Comparte tus experiencias y tu cultura",
  "Email Address": "Correo electrónico",
  Password: "Contraseña",
  LOGIN: "ENTRAR",
  "New here? Sign up": "¿Nuevo aquí? Regístrate",
  "Forgot Password?": "¿Olvidaste tu contraseña?",
  "Choose up to 5 interests": "Elige hasta 5 intereses",
  "pick a few hobbies and experiences that will help us connect you to your ideal host!": "elige algunos intereses y experiencias para ayudarnos a conectarte con tu anfitrión ideal",
  "food and drink": "comida y bebida",
  "craft and making": "artesanía y creación",
  "music and dance": "música y baile",
  "quiet and slow": "tranquilo y pausado",
  "nature and hikes": "naturaleza y caminatas",
  "history and heritage": "historia y patrimonio",
  "sports and games": "deportes y juegos",
  "fishing and sea": "pesca y mar",
  "art and photography": "arte y fotografía",
  "Anything you’d like to include?": "¿Algo más que quieras incluir?",
  "Type or tap the mic to answer": "Escribe o toca el micrófono para responder",
  Continue: "Continuar",
  "Finding your best matches…": "Buscando tus mejores opciones…",
  "WunnaGo is turning your interests and everyday language into practical travel preferences.": "WunnaGo está convirtiendo tus intereses y tus propias palabras en preferencias de viaje útiles.",
  Interests: "Intereses",
  "Time & pace": "Tiempo y ritmo",
  "Host capacity": "Capacidad del anfitrión",
  "Recent exposure": "Exposición reciente",
  "Personal matches, not popularity.": "Coincidencias personales, no popularidad.",
  "fit + capacity + exposure": "afinidad + capacidad + exposición",
  "Why WunnaGo picked this": "Por qué WunnaGo eligió esto",
  "Strong fit with available host capacity.": "Buena afinidad y capacidad disponible del anfitrión.",
  "Book this experience": "Reservar esta experiencia",
  "Choose interests first to generate matches.": "Primero elige intereses para generar coincidencias.",
  "Swipe the card to explore more hosts": "Desliza la tarjeta para descubrir más anfitriones",
  "Chat with": "Chatear con",
  "Choose a day": "Elige un día",
  "Choose a time": "Elige una hora",
  "First, let’s verify your identity": "Primero, verifiquemos tu identidad",
  "Take a photo of the front and back of your ID": "Toma una foto del frente y del reverso de tu identificación",
  "For this prototype, AI extracts visible fields for confirmation — it does not perform government identity verification.": "En este prototipo, la IA extrae los datos visibles para confirmarlos; no realiza una verificación oficial de identidad.",
  "Front of ID": "Frente de la identificación",
  "Back of ID": "Reverso de la identificación",
  "Take a photo of front of ID": "Tomar foto del frente",
  "Reading document…": "Leyendo documento…",
  "Use demo ID": "Usar identificación de demostración",
  "Document captured": "Documento capturado",
  Name: "Nombre",
  Country: "País",
  Document: "Documento",
  Number: "Número",
  "Confirm & continue": "Confirmar y continuar",
  "Tell us about what you do": "Cuéntanos lo que haces",
  "Just answer a few quick questions, we’ll turn it into a profile for you.": "Responde unas preguntas rápidas y las convertiremos en un perfil para ti.",
  "What do you make or do?": "¿Qué haces o elaboras?",
  "How long have you been doing this?": "¿Cuánto tiempo llevas haciéndolo?",
  "What should a visitor expect?": "¿Qué puede esperar un visitante?",
  Next: "Siguiente",
  "WunnaGo is building your experience…": "WunnaGo está creando tu experiencia…",
  "Turning your own words into a clear listing while keeping you in control.": "Transformando tus propias palabras en una publicación clara, manteniéndote en control.",
  "Activity & interests": "Actividad e intereses",
  "Pace & setting": "Ritmo y entorno",
  "Visitor expectations": "Expectativas del visitante",
  "Questions & safety flags": "Preguntas y alertas de seguridad",
  "Here’s what we understood": "Esto es lo que entendimos",
  "You approve this before anything is published.": "Tú apruebas esto antes de que se publique.",
  Duration: "Duración",
  Group: "Grupo",
  Pace: "Ritmo",
  Setting: "Entorno",
  "Needs host confirmation": "Necesita confirmación del anfitrión",
  "Confirm practical accessibility details before publishing.": "Confirma los detalles prácticos de accesibilidad antes de publicar.",
  "No obvious safety flag inferred; host review is still required.": "No se detectaron alertas de seguridad evidentes; aun así, se requiere la revisión del anfitrión.",
  Edit: "Editar",
  "Looks good ✓": "Se ve bien ✓",
  "Add a short video": "Añade un video corto",
  "Visitors want to see who they’ll meet! 30 to 60 seconds is enough.": "¡Los visitantes quieren ver a quién conocerán! Entre 30 y 60 segundos es suficiente.",
  "Already recorded a video?": "¿Ya grabaste un video?",
  "Upload a video from your phone": "Sube un video desde tu teléfono",
  "Upload video": "Subir video",
  "Not sure what to say?": "¿No sabes qué decir?",
  "We’ll turn the answers from the last step into a short script you can read while recording.": "Convertiremos las respuestas del paso anterior en un guion corto que podrás leer mientras grabas.",
  "get your script and record": "obtener guion y grabar",
  "you can always re-record or replace this later": "siempre puedes volver a grabarlo o reemplazarlo después",
  "Start demo recording": "Iniciar grabación de demostración",
  "YOUR 30–60 SECOND SCRIPT": "TU GUION DE 30–60 SEGUNDOS",
  "Use microphone": "Usar micrófono",
  "Listening…": "Escuchando… toca de nuevo para detener",
  "Stop listening": "Dejar de escuchar",
  "Microphone permission was blocked. Allow microphone access and try again.": "El permiso del micrófono está bloqueado. Permite el acceso al micrófono e inténtalo de nuevo.",
  "Speech-to-text is not available in this browser. You can still type your answer.": "La conversión de voz a texto no está disponible en este navegador. Aún puedes escribir tu respuesta.",
  "Microphone access needs HTTPS or localhost.": "El acceso al micrófono requiere HTTPS o localhost.",
  "Use demo text": "Usar texto de demostración",
  quiet: "tranquilo",
  relaxed: "relajado",
  active: "activo",
  any: "cualquiera",
  match: "coincidencia",
  reviews: "reseñas",
  "guests hosted": "visitantes recibidos",
  "Up to": "Hasta",
  mins: "min",
  "Tue 22nd": "Mar 22",
  "Wed 23rd": "Mié 23",
  "Thur 24th": "Jue 24",
  "Fri 25th": "Vie 25",
  "Local, relaxed and personal, with a preference for food and shorter experiences.": "Local, relajado y personal, con preferencia por la comida y las experiencias cortas."
};

const fr: Dictionary = {
  "Log in as…": "Se connecter en tant que…",
  Visitor: "Visiteur",
  Host: "Hôte",
  "Explore and find new experiences": "Explorez et découvrez de nouvelles expériences",
  "Share your experiences and culture": "Partagez vos expériences et votre culture",
  "Email Address": "Adresse e-mail",
  Password: "Mot de passe",
  LOGIN: "CONNEXION",
  "New here? Sign up": "Nouveau ici ? S’inscrire",
  "Forgot Password?": "Mot de passe oublié ?",
  "Choose up to 5 interests": "Choisissez jusqu’à 5 centres d’intérêt",
  "pick a few hobbies and experiences that will help us connect you to your ideal host!": "choisissez quelques centres d’intérêt et expériences pour nous aider à vous connecter à votre hôte idéal",
  "food and drink": "gastronomie et boissons",
  "craft and making": "artisanat et création",
  "music and dance": "musique et danse",
  "quiet and slow": "calme et tranquille",
  "nature and hikes": "nature et randonnées",
  "history and heritage": "histoire et patrimoine",
  "sports and games": "sports et jeux",
  "fishing and sea": "pêche et mer",
  "art and photography": "art et photographie",
  "Anything you’d like to include?": "Souhaitez-vous ajouter quelque chose ?",
  "Type or tap the mic to answer": "Écrivez ou touchez le micro pour répondre",
  Continue: "Continuer",
  "Finding your best matches…": "Recherche de vos meilleures correspondances…",
  "WunnaGo is turning your interests and everyday language into practical travel preferences.": "WunnaGo transforme vos centres d’intérêt et vos propres mots en préférences de voyage utiles.",
  Interests: "Centres d’intérêt",
  "Time & pace": "Temps et rythme",
  "Host capacity": "Capacité de l’hôte",
  "Recent exposure": "Exposition récente",
  "Personal matches, not popularity.": "Des correspondances personnelles, pas la popularité.",
  "fit + capacity + exposure": "affinité + capacité + exposition",
  "Why WunnaGo picked this": "Pourquoi WunnaGo a choisi ceci",
  "Strong fit with available host capacity.": "Bonne correspondance avec une capacité d’accueil disponible.",
  "Book this experience": "Réserver cette expérience",
  "Choose interests first to generate matches.": "Choisissez d’abord des centres d’intérêt pour générer des correspondances.",
  "Swipe the card to explore more hosts": "Faites glisser la carte pour découvrir plus d’hôtes",
  "Chat with": "Discuter avec",
  "Choose a day": "Choisissez un jour",
  "Choose a time": "Choisissez une heure",
  "First, let’s verify your identity": "Commençons par vérifier votre identité",
  "Take a photo of the front and back of your ID": "Prenez une photo du recto et du verso de votre pièce d’identité",
  "For this prototype, AI extracts visible fields for confirmation — it does not perform government identity verification.": "Dans ce prototype, l’IA extrait les champs visibles pour confirmation ; elle n’effectue pas de vérification officielle d’identité.",
  "Front of ID": "Recto de la pièce d’identité",
  "Back of ID": "Verso de la pièce d’identité",
  "Take a photo of front of ID": "Prendre une photo du recto",
  "Reading document…": "Lecture du document…",
  "Use demo ID": "Utiliser la pièce d’identité de démonstration",
  "Document captured": "Document capturé",
  Name: "Nom",
  Country: "Pays",
  Document: "Document",
  Number: "Numéro",
  "Confirm & continue": "Confirmer et continuer",
  "Tell us about what you do": "Parlez-nous de ce que vous faites",
  "Just answer a few quick questions, we’ll turn it into a profile for you.": "Répondez à quelques questions rapides et nous les transformerons en profil pour vous.",
  "What do you make or do?": "Que fabriquez-vous ou que faites-vous ?",
  "How long have you been doing this?": "Depuis combien de temps faites-vous cela ?",
  "What should a visitor expect?": "À quoi un visiteur doit-il s’attendre ?",
  Next: "Suivant",
  "WunnaGo is building your experience…": "WunnaGo crée votre expérience…",
  "Turning your own words into a clear listing while keeping you in control.": "Nous transformons vos propres mots en une annonce claire tout en vous laissant le contrôle.",
  "Activity & interests": "Activité et centres d’intérêt",
  "Pace & setting": "Rythme et cadre",
  "Visitor expectations": "Attentes du visiteur",
  "Questions & safety flags": "Questions et alertes de sécurité",
  "Here’s what we understood": "Voici ce que nous avons compris",
  "You approve this before anything is published.": "Vous approuvez ceci avant toute publication.",
  Duration: "Durée",
  Group: "Groupe",
  Pace: "Rythme",
  Setting: "Cadre",
  "Needs host confirmation": "Confirmation de l’hôte requise",
  "Confirm practical accessibility details before publishing.": "Confirmez les détails pratiques d’accessibilité avant publication.",
  "No obvious safety flag inferred; host review is still required.": "Aucune alerte de sécurité évidente n’a été déduite ; la vérification par l’hôte reste nécessaire.",
  Edit: "Modifier",
  "Looks good ✓": "C’est bon ✓",
  "Add a short video": "Ajoutez une courte vidéo",
  "Visitors want to see who they’ll meet! 30 to 60 seconds is enough.": "Les visiteurs veulent voir qui ils vont rencontrer ! 30 à 60 secondes suffisent.",
  "Already recorded a video?": "Vous avez déjà enregistré une vidéo ?",
  "Upload a video from your phone": "Téléversez une vidéo depuis votre téléphone",
  "Upload video": "Téléverser la vidéo",
  "Not sure what to say?": "Vous ne savez pas quoi dire ?",
  "We’ll turn the answers from the last step into a short script you can read while recording.": "Nous transformerons les réponses de l’étape précédente en un court script que vous pourrez lire pendant l’enregistrement.",
  "get your script and record": "obtenir votre script et enregistrer",
  "you can always re-record or replace this later": "vous pourrez toujours réenregistrer ou remplacer cette vidéo plus tard",
  "Start demo recording": "Démarrer l’enregistrement de démonstration",
  "YOUR 30–60 SECOND SCRIPT": "VOTRE SCRIPT DE 30 À 60 SECONDES",
  "Use microphone": "Utiliser le microphone",
  "Listening…": "Écoute… touchez à nouveau pour arrêter",
  "Stop listening": "Arrêter l’écoute",
  "Microphone permission was blocked. Allow microphone access and try again.": "L’autorisation du microphone est bloquée. Autorisez l’accès au microphone puis réessayez.",
  "Speech-to-text is not available in this browser. You can still type your answer.": "La reconnaissance vocale n’est pas disponible dans ce navigateur. Vous pouvez toujours saisir votre réponse.",
  "Microphone access needs HTTPS or localhost.": "L’accès au microphone nécessite HTTPS ou localhost.",
  "Use demo text": "Utiliser le texte de démonstration",
  quiet: "calme",
  relaxed: "détendu",
  active: "actif",
  any: "n’importe lequel",
  match: "correspondance",
  reviews: "avis",
  "guests hosted": "visiteurs accueillis",
  "Up to": "Jusqu’à",
  mins: "min",
  "Tue 22nd": "Mar 22",
  "Wed 23rd": "Mer 23",
  "Thur 24th": "Jeu 24",
  "Fri 25th": "Ven 25",
  "Local, relaxed and personal, with a preference for food and shorter experiences.": "Local, détendu et personnel, avec une préférence pour la cuisine et les expériences courtes."
};

const dictionaries: Record<LanguageCode, Dictionary> = { en: {}, es, fr };

export function translateText(language: LanguageCode, english: string): string {
  return dictionaries[language][english] ?? english;
}

const experienceTranslations: Record<Exclude<LanguageCode, "en">, Record<string, Partial<RankedExperience>>> = {
  es: {
    "gloria-fishcakes": {
      title: "Haz fishcakes con Gloria",
      description: "Gloria lleva más de 15 años con su puesto. Acércate, aprende a sazonar y freír una tanda de un clásico bajan y cómelos recién salidos de la sartén.",
      shortDescription: "30 minutos ayudando a Gloria y luego comerlos calientes",
      reviewQuote: "Gloria fue encantadora y una gran maestra. Mis fishcakes quedaron deliciosos; se sintió personal, no empaquetado."
    },
    "janelle-pottery": {
      title: "Cerámica con Janelle",
      description: "Siéntate en la pequeña mesa del estudio de Janelle, aprende técnicas básicas de modelado a mano y crea un recuerdo inspirado en las texturas de la isla.",
      shortDescription: "Una tranquila sesión de arcilla de una hora en un pequeño estudio",
      reviewQuote: "Pequeño, tranquilo y exactamente el tipo de experiencia que nunca habríamos encontrado por nuestra cuenta."
    },
    "omar-garden": {
      title: "Huerto con Omar",
      description: "Observa yuca, hierbas y cultivos locales mientras Omar explica qué crece bien aquí y qué termina en su cocina.",
      shortDescription: "Un paseo de 45 minutos por el huerto con historias locales",
      reviewQuote: "Omar hizo que cada planta se sintiera parte de una historia más grande de Barbados."
    },
    "keisha-mahogany": {
      title: "Madera con Keisha",
      description: "Entra al taller de Keisha para una breve demostración y luego lija y termina una pequeña pieza mientras conoces su historia con el oficio.",
      shortDescription: "Conoce un taller artesanal y prueba un sencillo paso de acabado",
      reviewQuote: "El taller fue lo mejor porque se sintió como conocer a una persona, no consumir una atracción."
    },
    "popular-catamaran-cookout": {
      title: "Comida en la costa",
      description: "Una experiencia grupal bien organizada junto a la costa con un formato más grande y un operador conocido.",
      shortDescription: "Una experiencia gastronómica grupal de tres horas con alta demanda",
      reviewQuote: "Muy organizado y divertido, pero definitivamente se siente como una experiencia de tour más grande."
    },
    "marcus-rehearsal": {
      title: "Ensayo con Marcus",
      description: "Pasa por un pequeño ensayo, escucha cómo se construye el ritmo y conversa con Marcus sobre la música con la que creció.",
      shortDescription: "Un ensayo tranquilo de 40 minutos con conversación",
      reviewQuote: "Se sintió como una invitación, no como si me estuvieran vendiendo un espectáculo."
    }
  },
  fr: {
    "gloria-fishcakes": {
      title: "Préparez des fishcakes avec Gloria",
      description: "Gloria tient son stand depuis plus de 15 ans. Venez apprendre à assaisonner et frire un classique bajan, puis dégustez-le tout chaud à la sortie de la poêle.",
      shortDescription: "30 minutes avec Gloria, puis dégustez-les tout chauds",
      reviewQuote: "Gloria était adorable et excellente pédagogue. Mes fishcakes étaient délicieux — c’était personnel, pas formaté."
    },
    "janelle-pottery": {
      title: "Poterie avec Janelle",
      description: "Installez-vous à la petite table de l’atelier de Janelle, découvrez les bases du modelage à la main et créez un petit souvenir inspiré des textures de l’île.",
      shortDescription: "Une heure calme autour de l’argile dans un petit atelier",
      reviewQuote: "Petit, paisible et exactement le genre d’expérience que nous n’aurions jamais trouvée seuls."
    },
    "omar-garden": {
      title: "Jardin avec Omar",
      description: "Observez le manioc, les herbes et les cultures locales pendant qu’Omar explique ce qui pousse bien ici et ce qui finit dans sa cuisine.",
      shortDescription: "45 minutes dans un jardin avec des histoires sur les cultures locales",
      reviewQuote: "Omar a donné à chaque plante une place dans une histoire plus vaste de la Barbade."
    },
    "keisha-mahogany": {
      title: "Bois avec Keisha",
      description: "Entrez dans l’atelier de Keisha pour une courte démonstration, puis poncez et finissez une petite pièce tout en découvrant son parcours artisanal.",
      shortDescription: "Découvrez un atelier en activité et essayez une étape simple de finition",
      reviewQuote: "L’atelier était le meilleur moment car on avait l’impression de rencontrer une personne, pas de consommer une attraction."
    },
    "popular-catamaran-cookout": {
      title: "Repas sur la côte",
      description: "Une expérience de repas de groupe bien organisée près de la côte, avec un format plus important et un opérateur connu.",
      shortDescription: "Une expérience culinaire de groupe très demandée de trois heures",
      reviewQuote: "Très bien organisé et amusant, mais c’est clairement une expérience de groupe plus importante."
    },
    "marcus-rehearsal": {
      title: "Répétition avec Marcus",
      description: "Passez à une petite répétition, écoutez comment un rythme se construit et échangez avec Marcus sur la musique qui a bercé son enfance.",
      shortDescription: "Une répétition détendue de 40 minutes avec conversation",
      reviewQuote: "On avait l’impression d’être invité plutôt que de se faire vendre un spectacle."
    }
  }
};

export function localizeExperience(experience: RankedExperience, language: LanguageCode): RankedExperience {
  if (language === "en") return experience;
  const translated = experienceTranslations[language][experience.id];
  return translated ? { ...experience, ...translated } : experience;
}

export function localizeVisitorIntent(intent: VisitorIntent, language: LanguageCode): VisitorIntent {
  if (language === "en") return intent;
  return { ...intent, summary: translateText(language, intent.summary) };
}

export function localizeDemoHostProfile(profile: HostProfile, language: LanguageCode): HostProfile {
  if (language === "en") return profile;
  if (language === "es") {
    return {
      ...profile,
      title: "Haz fishcakes con Gloria",
      summary: "Acércate al puesto de Gloria, aprende cómo sazona y fríe una tanda de fishcakes tradicionales de Barbados y cómelos recién salidos de la sartén.",
      category: "Comida y bebida",
      interests: ["comida y bebida", "historia y patrimonio", "tranquilo y pausado"],
      setting: "puesto local de comida",
      accessibilityQuestions: ["¿Hay acceso sin escalones al puesto?"],
      safetyFlags: ["aceite caliente / superficie de cocción — se requiere supervisión del anfitrión"],
      recordingScript: "Hola, soy Gloria. Llevo más de 15 años haciendo fishcakes. Ven a mi puesto y te enseñaré cómo los sazono, mezclo y frío. Mantendremos el grupo pequeño y relajado y, lo mejor de todo, podrás comerlos recién salidos de la sartén."
    };
  }
  return {
    ...profile,
    title: "Préparez des fishcakes avec Gloria",
    summary: "Venez au stand de Gloria, apprenez comment elle assaisonne et fait frire des fishcakes traditionnels de la Barbade, puis dégustez-les tout chauds à la sortie de la poêle.",
    category: "Gastronomie et boissons",
    interests: ["gastronomie et boissons", "histoire et patrimoine", "calme et tranquille"],
    setting: "stand de restauration local",
    accessibilityQuestions: ["Le stand est-il accessible sans marche ?"],
    safetyFlags: ["huile chaude / surface de cuisson — supervision de l’hôte requise"],
    recordingScript: "Bonjour, je m’appelle Gloria. Je prépare des fishcakes depuis plus de 15 ans. Venez à mon stand et je vous montrerai comment je les assaisonne, les mélange et les fais frire. Le groupe restera petit et détendu et, surtout, vous pourrez les déguster tout chauds à la sortie de la poêle."
  };
}

export function translateReason(language: LanguageCode, reason: string): string {
  if (language === "en") return reason;

  const mappings = language === "es"
    ? {
        "host has capacity": "el anfitrión tiene capacidad",
        "lower recent exposure": "menor exposición reciente",
        "pace": "ritmo",
        "mins fits your time": "min encajan en tu tiempo",
        "within your": "dentro de tu presupuesto de",
        "budget": "",
        "matches": "coincide con"
      }
    : {
        "host has capacity": "l’hôte a de la capacité",
        "lower recent exposure": "exposition récente plus faible",
        "pace": "rythme",
        "mins fits your time": "min correspondent à votre temps",
        "within your": "dans votre budget de",
        "budget": "",
        "matches": "correspond à"
      };

  if (reason === "host has capacity") return mappings["host has capacity"];
  if (reason === "lower recent exposure") return mappings["lower recent exposure"];
  if (reason.startsWith("matches ")) {
    const interest = reason.slice("matches ".length);
    return `${mappings.matches} ${translateText(language, interest)}`;
  }
  if (reason.includes(" mins fits your time")) {
    return reason.replace(" mins fits your time", ` ${mappings["mins fits your time"]}`);
  }
  if (reason.startsWith("within your $") && reason.endsWith(" budget")) {
    const value = reason.slice("within your ".length, -" budget".length);
    return `${mappings["within your"]} ${value}`;
  }
  if (reason.endsWith(" pace")) {
    const pace = reason.slice(0, -" pace".length);
    const paceWord = language === "es"
      ? ({ quiet: "tranquilo", relaxed: "relajado", active: "activo" } as Record<string, string>)[pace] || pace
      : ({ quiet: "calme", relaxed: "détendu", active: "actif" } as Record<string, string>)[pace] || pace;
    return `${paceWord} ${mappings.pace}`;
  }
  return reason;
}
