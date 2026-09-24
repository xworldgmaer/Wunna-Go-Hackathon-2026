"use client";

import { useEffect, useRef, useState } from "react";
import { BottomNav } from "./BottomNav";
import { VoiceField } from "./VoiceField";
import { Wordmark } from "./Wordmark";
import type { HostProfile, IdExtraction, RankedExperience, VisitorIntent } from "@/lib/types";
import { demoHostProfile, demoIdExtraction, demoVisitorIntent } from "@/lib/demo";
import { experiences } from "@/lib/experiences";
import { rankExperiences } from "@/lib/scoring";
import { LANGUAGES, localizeDemoHostProfile, localizeExperience, localizeVisitorIntent, translateReason, translateText, type LanguageCode } from "@/lib/i18n";

const INTERESTS = [
  "food and drink",
  "craft and making",
  "music and dance",
  "quiet and slow",
  "nature and hikes",
  "history and heritage",
  "sports and games",
  "fishing and sea",
  "art and photography"
];

type Screen =
  | "login"
  | "visitor-interests"
  | "visitor-thinking"
  | "discover"
  | "booking"
  | "host-id"
  | "host-about"
  | "host-thinking"
  | "host-review"
  | "host-video";

type ApiMode = "claude" | "demo-fallback" | null;

const demoVisitorNotes: Record<LanguageCode, string> = {
  en: "I'm with my mum, nothing too strenuous. We have about two hours and want something local and relaxed, maybe food, under $30.",
  es: "Estoy con mi mamá, nada demasiado intenso. Tenemos unas dos horas y queremos algo local y relajado, quizás comida, por menos de 30 dólares.",
  fr: "Je suis avec ma mère, rien de trop fatigant. Nous avons environ deux heures et voulons quelque chose de local et détendu, peut-être autour de la cuisine, pour moins de 30 dollars."
};

const hostDemos: Record<LanguageCode, { what: string; howLong: string; expect: string }> = {
  en: {
    what: "I make fishcakes at my stall and I can show people how I season and fry them.",
    howLong: "I've been doing it for over 15 years.",
    expect: "Small groups, relaxed, about half an hour. We make a batch together and eat them hot from the pan."
  },
  es: {
    what: "Hago fishcakes en mi puesto y puedo enseñar a la gente cómo los sazono y los frío.",
    howLong: "Llevo más de 15 años haciéndolo.",
    expect: "Grupos pequeños, ambiente relajado, unos treinta minutos. Hacemos una tanda juntos y los comemos calientes recién hechos."
  },
  fr: {
    what: "Je prépare des fishcakes à mon stand et je peux montrer aux visiteurs comment je les assaisonne et les fais frire.",
    howLong: "Je fais cela depuis plus de 15 ans.",
    expect: "De petits groupes, une ambiance détendue, environ trente minutes. Nous préparons une fournée ensemble et les dégustons tout chauds."
  }
};

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button className="back-button" type="button" onClick={onClick} aria-label="Go back">
      ‹
    </button>
  );
}

function ApiBadge({ mode }: { mode: ApiMode }) {
  if (!mode) return null;
  return (
    <span className={mode === "claude" ? "api-badge api-badge--live" : "api-badge"}>
      {mode === "claude" ? "✦ Claude live" : "Demo fallback"}
    </span>
  );
}

export function WunnaGoApp() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<"visitor" | "host">("visitor");
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [email, setEmail] = useState("User@wunnago.com");
  const [password, setPassword] = useState("wunnagodemopassword");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "food and drink",
    "craft and making",
    "history and heritage"
  ]);
  const [visitorNote, setVisitorNote] = useState("");
  const [visitorIntent, setVisitorIntent] = useState<VisitorIntent | null>(null);
  const [ranked, setRanked] = useState<RankedExperience[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [visitorMode, setVisitorMode] = useState<ApiMode>(null);
  const [bookingDay, setBookingDay] = useState("Tue 22nd");
  const [bookingTime, setBookingTime] = useState("11:30am");
  const [toast, setToast] = useState("");

  const [idPreview, setIdPreview] = useState<string | null>(null);
  const [idInfo, setIdInfo] = useState<IdExtraction | null>(null);
  const [idMode, setIdMode] = useState<ApiMode>(null);
  const [scanning, setScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [hostWhat, setHostWhat] = useState("");
  const [hostHowLong, setHostHowLong] = useState("");
  const [hostExpect, setHostExpect] = useState("");
  const [hostProfile, setHostProfile] = useState<HostProfile | null>(null);
  const [hostMode, setHostMode] = useState<ApiMode>(null);
  const [showScript, setShowScript] = useState(false);

  const touchStart = useRef<number | null>(null);

  const activeExperience = ranked[cardIndex] || ranked[0];
  const displayExperience = activeExperience ? localizeExperience(activeExperience, language) : null;
  const displayVisitorIntent = visitorIntent && visitorMode === "demo-fallback" ? localizeVisitorIntent(visitorIntent, language) : visitorIntent;
  const displayHostProfile = hostProfile && hostMode === "demo-fallback" ? localizeDemoHostProfile(hostProfile, language) : hostProfile;
  const selectedLanguage = LANGUAGES.find((item) => item.code === language) || LANGUAGES[0];
  const hostDemo = hostDemos[language];
  const demoVisitorNote = demoVisitorNotes[language];
  const tr = (text: string) => translateText(language, text);

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const selectInterest = (interest: string) => {
    setSelectedInterests((current) => {
      if (current.includes(interest)) return current.filter((x) => x !== interest);
      if (current.length >= 5) return current;
      return [...current, interest];
    });
  };

  const goHome = () => {
    setScreen("login");
    setToast("");
  };

  const login = () => {
    // Deliberately permissive for the hackathon prototype: any values (or blanks) proceed.
    setScreen(role === "visitor" ? "visitor-interests" : "host-id");
  };

  const signUp = () => {
    // Sign-up is mocked for the live demo and intentionally has no validation.
    login();
  };

  const analyzeVisitor = async () => {
    setScreen("visitor-thinking");
    const started = Date.now();
    try {
      const res = await fetch("/api/visitor-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interests: selectedInterests, note: visitorNote, language: selectedLanguage.apiLabel })
      });
      const data = await res.json();
      setVisitorIntent(data.intent);
      setRanked(data.ranked);
      setVisitorMode(data.mode);
      setCardIndex(0);
    } catch {
      // Keep the stage demo moving even if venue Wi-Fi or the API route fails.
      const fallbackRanked = rankExperiences(experiences, selectedInterests, demoVisitorIntent).slice(0, 5);
      setVisitorIntent(demoVisitorIntent);
      setRanked(fallbackRanked);
      setVisitorMode("demo-fallback");
      setCardIndex(0);
      setToast("Network unavailable — using the built-in demo fallback.");
    }
    const remaining = Math.max(0, 850 - (Date.now() - started));
    window.setTimeout(() => setScreen("discover"), remaining);
  };

  const nextCard = (direction = 1) => {
    if (!ranked.length) return;
    setCardIndex((current) => (current + direction + ranked.length) % ranked.length);
  };

  const onTouchEnd = (x: number) => {
    if (touchStart.current === null) return;
    const delta = x - touchStart.current;
    if (Math.abs(delta) > 45) nextCard(delta < 0 ? 1 : -1);
    touchStart.current = null;
  };

  const book = () => {
    setToast(`Demo booking held for ${bookingDay} at ${bookingTime}.`);
    window.setTimeout(() => setToast(""), 2600);
  };

  const scanFile = async (file: File) => {
    setScanning(true);
    setIdPreview(URL.createObjectURL(file));
    const form = new FormData();
    form.append("image", file);
    try {
      const res = await fetch("/api/scan-id", { method: "POST", body: form });
      if (!res.ok) throw new Error("ID route failed");
      const data = await res.json();
      setIdInfo(data.extracted);
      setIdMode(data.mode);
    } catch {
      setIdInfo(demoIdExtraction);
      setIdMode("demo-fallback");
      setToast("ID AI unavailable — using synthetic demo extraction.");
    } finally {
      setScanning(false);
    }
  };

  const loadDemoId = async () => {
    setScanning(true);
    setIdPreview("/demo-id.svg");
    try {
      const res = await fetch("/demo-id.svg");
      const blob = await res.blob();
      // SVG is intentionally handled by the route's fallback path; real camera images
      // are sent to Claude Vision as PNG/JPEG/WebP.
      const file = new File([blob], "demo-id.svg", { type: "image/svg+xml" });
      await scanFile(file);
    } catch {
      setIdInfo(demoIdExtraction);
      setIdMode("demo-fallback");
      setScanning(false);
    }
  };

  const analyzeHost = async () => {
    setScreen("host-thinking");
    const started = Date.now();
    try {
      const res = await fetch("/api/host-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ what: hostWhat, howLong: hostHowLong, expect: hostExpect, language: selectedLanguage.apiLabel })
      });
      const data = await res.json();
      setHostProfile(data.profile);
      setHostMode(data.mode);
    } catch {
      setHostProfile(demoHostProfile);
      setHostMode("demo-fallback");
      setToast("Network unavailable — using the built-in host demo fallback.");
    }
    const remaining = Math.max(0, 950 - (Date.now() - started));
    window.setTimeout(() => setScreen("host-review"), remaining);
  };

  return (
    <main className="prototype-stage">
      <div className="phone-shell">
        {screen === "login" && (
          <section className="screen login-screen">
            <label className="language-control" aria-label="Choose app language">
              <span aria-hidden="true">◎</span>
              <select value={language} onChange={(e) => setLanguage(e.target.value as LanguageCode)}>
                {LANGUAGES.map((item) => <option key={item.code} value={item.code}>{item.label}</option>)}
              </select>
            </label>
            <Wordmark onClick={goHome} />
            <p className="login-as">{tr("Log in as…")}</p>

            <div className="role-grid">
              <button
                type="button"
                className={role === "visitor" ? "role-card selected" : "role-card"}
                onClick={() => setRole("visitor")}
              >
                <span className="role-check">✓</span>
                <span className="role-symbol">◈</span>
                <strong>{tr("Visitor")}</strong>
                <small>{tr("Explore and find new experiences")}</small>
              </button>
              <button
                type="button"
                className={role === "host" ? "role-card selected" : "role-card"}
                onClick={() => setRole("host")}
              >
                <span className="role-check">✓</span>
                <span className="role-symbol">⌂</span>
                <strong>{tr("Host")}</strong>
                <small>{tr("Share your experiences and culture")}</small>
              </button>
            </div>

            <div className="gold-rule" />
            <label className="field-label">{tr("Email Address")}</label>
            <input className="text-input" value={email} onChange={(e) => setEmail(e.target.value)} inputMode="email" autoComplete="off" />
            <label className="field-label">{tr("Password")}</label>
            <input className="text-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
            <button className="primary-button" type="button" onClick={login}>{tr("LOGIN")}</button>
            <div className="login-links">
              <button type="button" onClick={signUp}>{tr("New here? Sign up")}</button>
              <button type="button" onClick={() => setToast(tr("Forgot Password?"))}>{tr("Forgot Password?")}</button>
            </div>
          </section>
        )}

        {screen === "visitor-interests" && (
          <section className="screen content-screen">
            <header className="screen-header">
              <BackButton onClick={() => setScreen("login")} />
              <Wordmark compact onClick={goHome} />
            </header>
            <h1>{tr("Choose up to 5 interests")}</h1>
            <p className="subcopy">{tr("pick a few hobbies and experiences that will help us connect you to your ideal host!")}</p>
            <div className="gold-rule" />
            <div className="interest-grid">
              {INTERESTS.map((interest) => (
                <button
                  type="button"
                  key={interest}
                  className={selectedInterests.includes(interest) ? "interest-chip selected" : "interest-chip"}
                  onClick={() => selectInterest(interest)}
                >
                  {tr(interest)}
                </button>
              ))}
            </div>
            <label className="section-label">{tr("Anything you’d like to include?")}</label>
            <VoiceField
              value={visitorNote}
              onChange={setVisitorNote}
              multiline
              demoPhrase={demoVisitorNote}
              placeholder={tr("Type or tap the mic to answer")}
              speechLang={selectedLanguage.speechLang}
              micLabel={tr("Use microphone")}
              listeningLabel={tr("Listening…")}
              stopLabel={tr("Stop listening")}
              permissionErrorLabel={tr("Microphone permission was blocked. Allow microphone access and try again.")}
              unsupportedLabel={tr("Speech-to-text is not available in this browser. You can still type your answer.")}
              secureContextLabel={tr("Microphone access needs HTTPS or localhost.")}
              demoLabel={tr("Use demo text")}
            />
            <button className="primary-button bottom-action" type="button" onClick={analyzeVisitor}>{tr("Continue")}</button>
          </section>
        )}

        {screen === "visitor-thinking" && (
          <section className="screen thinking-screen">
            <Wordmark compact onClick={goHome} />
            <div className="ai-orb"><span>✦</span></div>
            <h1>{tr("Finding your best matches…")}</h1>
            <p>{tr("WunnaGo is turning your interests and everyday language into practical travel preferences.")}</p>
            <div className="thinking-checks">
              <span>✓ {tr("Interests")}</span>
              <span>✓ {tr("Time & pace")}</span>
              <span>✓ {tr("Host capacity")}</span>
              <span>✓ {tr("Recent exposure")}</span>
            </div>
          </section>
        )}

        {screen === "discover" && (
          <section className="screen discover-screen">
            <header className="discover-header">
              <button className="menu-button" type="button">☰</button>
              <Wordmark compact onClick={goHome} />
              <button className="avatar-button" type="button">◯</button>
            </header>

            <div className="intent-strip">
              <div>
                <span className="spark">✦</span>
                <strong>{displayVisitorIntent?.summary || tr("Personal matches, not popularity.")}</strong>
              </div>
              <ApiBadge mode={visitorMode} />
            </div>

            {activeExperience ? (
              <div
                className="experience-card"
                onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
                onTouchEnd={(e) => onTouchEnd(e.changedTouches[0].clientX)}
              >
                <div className="experience-image-wrap">
                  <img
                    className="experience-image"
                    src={displayExperience!.image}
                    alt={displayExperience!.title}
                    onError={(event) => {
                      const fallback = displayExperience!.fallbackImage;
                      if (fallback && event.currentTarget.src !== new URL(fallback, window.location.origin).href) {
                        event.currentTarget.src = fallback;
                      }
                    }}
                  />
                  <span className="parish-pill">{displayExperience!.parish}</span>
                  <span className="play-button">▷</span>
                </div>
                <div className="card-body">
                  <div className="match-line">
                    <span className="match-pill">{activeExperience.matchPercent}% {tr("match")}</span>
                    <span className="exposure-note">{tr("fit + capacity + exposure")}</span>
                  </div>
                  <h2 className="experience-title">
                    <span className="experience-title-text">{displayExperience!.title}</span>
                    <em>· ${displayExperience!.price}</em>
                  </h2>
                  <p className="short-desc">{displayExperience!.shortDescription}</p>
                  <div className="host-row">
                    <span className="host-avatar">{displayExperience!.host.slice(0, 1)}</span>
                    <strong className="host-name">{displayExperience!.host}</strong>
                    <span>· {displayExperience!.rating} ★</span>
                    <span className="reviews">({displayExperience!.reviews} {tr("reviews")})</span>
                  </div>
                  <div className="why-box">
                    <strong>✦ {tr("Why WunnaGo picked this")}</strong>
                    <div>{activeExperience.reasons.length ? activeExperience.reasons.map((reason) => translateReason(language, reason)).join(" · ") : tr("Strong fit with available host capacity.")}</div>
                  </div>
                  <p className="review"><strong>{displayExperience!.reviewer}</strong><br />“{displayExperience!.reviewQuote}”</p>
                  <button className="primary-button compact-button" type="button" onClick={() => setScreen("booking")}>{tr("Book this experience")}</button>
                </div>
              </div>
            ) : (
              <div className="empty-card">{tr("Choose interests first to generate matches.")}</div>
            )}

            <div className="card-dots" aria-label="Experience position">
              {(ranked.length ? ranked : Array.from({ length: 5 })).map((_, i) => (
                <button key={i} type="button" className={i === cardIndex ? "dot active" : "dot"} onClick={() => ranked.length && setCardIndex(i)} />
              ))}
            </div>
            <p className="swipe-hint">{tr("Swipe the card to explore more hosts")}</p>
            <BottomNav active="discover" />
          </section>
        )}

        {screen === "booking" && activeExperience && (
          <section className="screen booking-screen">
            <div className="booking-image-wrap">
              <img
                src={displayExperience!.image}
                className="booking-image"
                alt={displayExperience!.title}
                onError={(event) => {
                  const fallback = displayExperience!.fallbackImage;
                  if (fallback && event.currentTarget.src !== new URL(fallback, window.location.origin).href) {
                    event.currentTarget.src = fallback;
                  }
                }}
              />
              <BackButton onClick={() => setScreen("discover")} />
              <span className="play-button booking-play">▷</span>
            </div>
            <div className="booking-content">
              <div className="host-row">
                <span className="host-avatar">{displayExperience!.host.slice(0, 1)}</span>
                <strong className="host-name">{displayExperience!.host}</strong>
                <span>· {displayExperience!.rating} ★</span>
                <span>· {displayExperience!.reviews + 36} {tr("guests hosted")}</span>
              </div>
              <h2 className="booking-title">
                <span className="booking-title-name">{displayExperience!.title}</span>
                <span className="booking-title-meta"><em>${displayExperience!.price}</em> · {displayExperience!.duration}{tr("mins")}</span>
              </h2>
              <p>{displayExperience!.description}</p>
              <button type="button" className="text-link">{tr("Chat with")} {displayExperience!.host}</button>
              <label className="section-label booking-label">{tr("Choose a day")}</label>
              <div className="booking-options">
                {["Tue 22nd", "Wed 23rd", "Thur 24th", "Fri 25th"].map((day) => (
                  <button type="button" key={day} onClick={() => setBookingDay(day)} className={bookingDay === day ? "booking-option selected" : "booking-option"}>
                    {day.split(" ")[0]}<br />{day.split(" ")[1]}
                  </button>
                ))}
              </div>
              <label className="section-label booking-label">{tr("Choose a time")}</label>
              <div className="booking-options times">
                {["8:00am", "11:30am", "2:00pm"].map((time) => (
                  <button type="button" key={time} onClick={() => setBookingTime(time)} className={bookingTime === time ? "booking-option selected" : "booking-option"}>{time}</button>
                ))}
              </div>
              <button className="primary-button compact-button" type="button" onClick={book}>{tr("Book this experience")}</button>
            </div>
            <BottomNav active="discover" />
          </section>
        )}

        {screen === "host-id" && (
          <section className="screen content-screen host-id-screen">
            <header className="screen-header">
              <BackButton onClick={() => setScreen("login")} />
              <Wordmark compact onClick={goHome} />
            </header>
            <h1>{tr("First, let’s verify your identity")}</h1>
            <p className="subcopy">{tr("Take a photo of the front and back of your ID")}</p>
            <p className="subcopy">{tr("For this prototype, AI extracts visible fields for confirmation — it does not perform government identity verification.")}</p>
            <div className="gold-rule" />

            <div className="id-card-slot">
              {idPreview ? <img src={idPreview} alt="ID preview" /> : <img src="/assets/id-front.svg" alt="Illustrated front of ID" />}
              {scanning && <div className="scan-line" />}
            </div>
            <span className="id-caption">{tr("Front of ID")}</span>
            <div className="id-card-slot muted"><img src="/assets/id-back.svg" alt="Illustrated back of ID" /></div>
            <span className="id-caption">{tr("Back of ID")}</span>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              capture="environment"
              className="hidden-input"
              onChange={(e) => e.target.files?.[0] && scanFile(e.target.files[0])}
            />
            <button className="primary-button" type="button" onClick={() => fileInputRef.current?.click()}>{scanning ? tr("Reading document…") : tr("Take a photo of front of ID")}</button>
            <button className="secondary-button" type="button" onClick={loadDemoId}>{tr("Use demo ID")}</button>

            {idInfo && (
              <div className="id-results">
                <div className="result-title"><span>✓</span> {tr("Document captured")} <ApiBadge mode={idMode} /></div>
                <dl>
                  <div><dt>{tr("Name")}</dt><dd>{idInfo.fullName}</dd></div>
                  <div><dt>{tr("Country")}</dt><dd>{idInfo.country}</dd></div>
                  <div><dt>{tr("Document")}</dt><dd>{idInfo.documentType}</dd></div>
                  <div><dt>{tr("Number")}</dt><dd>{idInfo.documentNumberMasked}</dd></div>
                </dl>
                <p>{idInfo.confidenceNote}</p>
                <button className="primary-button" type="button" onClick={() => setScreen("host-about")}>{tr("Confirm & continue")}</button>
              </div>
            )}
          </section>
        )}

        {screen === "host-about" && (
          <section className="screen content-screen host-about-screen">
            <header className="screen-header">
              <BackButton onClick={() => setScreen("host-id")} />
              <Wordmark compact onClick={goHome} />
            </header>
            <h1>{tr("Tell us about what you do")}</h1>
            <p className="subcopy">{tr("Just answer a few quick questions, we’ll turn it into a profile for you.")}</p>
            <div className="gold-rule" />

            <label className="section-label">{tr("What do you make or do?")}</label>
            <VoiceField value={hostWhat} onChange={setHostWhat} demoPhrase={hostDemo.what} placeholder={tr("Type or tap the mic to answer")} speechLang={selectedLanguage.speechLang} micLabel={tr("Use microphone")} listeningLabel={tr("Listening…")} stopLabel={tr("Stop listening")} permissionErrorLabel={tr("Microphone permission was blocked. Allow microphone access and try again.")} unsupportedLabel={tr("Speech-to-text is not available in this browser. You can still type your answer.")} secureContextLabel={tr("Microphone access needs HTTPS or localhost.")} demoLabel={tr("Use demo text")} />
            <label className="section-label">{tr("How long have you been doing this?")}</label>
            <VoiceField value={hostHowLong} onChange={setHostHowLong} demoPhrase={hostDemo.howLong} placeholder={tr("Type or tap the mic to answer")} speechLang={selectedLanguage.speechLang} micLabel={tr("Use microphone")} listeningLabel={tr("Listening…")} stopLabel={tr("Stop listening")} permissionErrorLabel={tr("Microphone permission was blocked. Allow microphone access and try again.")} unsupportedLabel={tr("Speech-to-text is not available in this browser. You can still type your answer.")} secureContextLabel={tr("Microphone access needs HTTPS or localhost.")} demoLabel={tr("Use demo text")} />
            <label className="section-label">{tr("What should a visitor expect?")}</label>
            <VoiceField value={hostExpect} onChange={setHostExpect} multiline demoPhrase={hostDemo.expect} placeholder={tr("Type or tap the mic to answer")} speechLang={selectedLanguage.speechLang} micLabel={tr("Use microphone")} listeningLabel={tr("Listening…")} stopLabel={tr("Stop listening")} permissionErrorLabel={tr("Microphone permission was blocked. Allow microphone access and try again.")} unsupportedLabel={tr("Speech-to-text is not available in this browser. You can still type your answer.")} secureContextLabel={tr("Microphone access needs HTTPS or localhost.")} demoLabel={tr("Use demo text")} />

            <button className="primary-button bottom-action" type="button" onClick={analyzeHost}>{tr("Next")}</button>
          </section>
        )}

        {screen === "host-thinking" && (
          <section className="screen thinking-screen">
            <Wordmark compact onClick={goHome} />
            <div className="ai-orb"><span>✦</span></div>
            <h1>{tr("WunnaGo is building your experience…")}</h1>
            <p>{tr("Turning your own words into a clear listing while keeping you in control.")}</p>
            <div className="thinking-checks">
              <span>✓ {tr("Activity & interests")}</span>
              <span>✓ {tr("Pace & setting")}</span>
              <span>✓ {tr("Visitor expectations")}</span>
              <span>✓ {tr("Questions & safety flags")}</span>
            </div>
          </section>
        )}

        {screen === "host-review" && hostProfile && (
          <section className="screen content-screen host-review-screen">
            <header className="screen-header">
              <BackButton onClick={() => setScreen("host-about")} />
              <Wordmark compact onClick={goHome} />
            </header>
            <div className="review-heading-row">
              <div>
                <span className="eyebrow">✦ WUNNAGO AI</span>
                <h1>{tr("Here’s what we understood")}</h1>
              </div>
              <ApiBadge mode={hostMode} />
            </div>
            <p className="subcopy">{tr("You approve this before anything is published.")}</p>

            <div className="profile-preview">
              <span className="profile-category">{displayHostProfile!.category}</span>
              <h2>{displayHostProfile!.title}</h2>
              <p>{displayHostProfile!.summary}</p>
              <div className="tag-row">
                {displayHostProfile!.interests.slice(0, 4).map((tag) => <span key={tag}>{tag}</span>)}
              </div>
              <div className="profile-grid">
                <div><small>{tr("Duration")}</small><strong>{displayHostProfile!.durationMinutes} {tr("mins")}</strong></div>
                <div><small>{tr("Group")}</small><strong>{tr("Up to")} {displayHostProfile!.groupSize}</strong></div>
                <div><small>{tr("Pace")}</small><strong>{tr(displayHostProfile!.pace)}</strong></div>
                <div><small>{tr("Setting")}</small><strong>{displayHostProfile!.setting}</strong></div>
              </div>
            </div>

            <div className="review-note">
              <strong>{tr("Needs host confirmation")}</strong>
              <p>{displayHostProfile!.accessibilityQuestions[0] || tr("Confirm practical accessibility details before publishing.")}</p>
              <p>{displayHostProfile!.safetyFlags[0] || tr("No obvious safety flag inferred; host review is still required.")}</p>
            </div>
            <div className="two-buttons">
              <button className="secondary-button" type="button" onClick={() => setScreen("host-about")}>{tr("Edit")}</button>
              <button className="primary-button" type="button" onClick={() => setScreen("host-video")}>{tr("Looks good ✓")}</button>
            </div>
          </section>
        )}

        {screen === "host-video" && (
          <section className="screen content-screen video-screen">
            <header className="screen-header">
              <BackButton onClick={() => setScreen("host-review")} />
              <Wordmark compact onClick={goHome} />
            </header>
            <h1>{tr("Add a short video")}</h1>
            <p className="subcopy">{tr("Visitors want to see who they’ll meet! 30 to 60 seconds is enough.")}</p>
            <div className="gold-rule" />

            <div className="video-panel">
              <h3>{tr("Already recorded a video?")}</h3>
              <p>{tr("Upload a video from your phone")}</p>
              <label className="outline-button">
                {tr("Upload video")}
                <input type="file" accept="video/*" className="hidden-input" onChange={() => setToast("Video selected for the demo.")} />
              </label>
            </div>

            <div className="video-panel script-panel">
              <div className="spark-large">✦</div>
              <h3>{tr("Not sure what to say?")}</h3>
              <p>{tr("We’ll turn the answers from the last step into a short script you can read while recording.")}</p>
              <button className="outline-button" type="button" onClick={() => setShowScript(true)}>{tr("get your script and record")}</button>
              <small>{tr("you can always re-record or replace this later")}</small>
            </div>

            {showScript && hostProfile && (
              <div className="teleprompter-backdrop" onClick={() => setShowScript(false)}>
                <div className="teleprompter" onClick={(e) => e.stopPropagation()}>
                  <span className="eyebrow">✦ {tr("YOUR 30–60 SECOND SCRIPT")}</span>
                  <p>{displayHostProfile!.recordingScript}</p>
                  <div className="record-dot" />
                  <button className="primary-button" type="button" onClick={() => { setShowScript(false); setToast("Recording flow mocked for the live demo."); }}>{tr("Start demo recording")}</button>
                </div>
              </div>
            )}
          </section>
        )}

        {toast && <div className="toast">{toast}</div>}
      </div>
    </main>
  );
}
