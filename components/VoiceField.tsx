"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
  demoPhrase?: string;
  speechLang?: string;
  micLabel?: string;
  listeningLabel?: string;
  stopLabel?: string;
  permissionErrorLabel?: string;
  unsupportedLabel?: string;
  secureContextLabel?: string;
  demoLabel?: string;
};

type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  maxAlternatives?: number;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onerror: ((event: { error?: string }) => void) | null;
  onresult: ((event: any) => void) | null;
  start: () => void;
  stop: () => void;
  abort?: () => void;
};

const joinSpeech = (...parts: string[]) =>
  parts
    .map((part) => part.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();

export function VoiceField({
  value,
  onChange,
  placeholder = "Type or tap the mic to answer",
  multiline = false,
  demoPhrase,
  speechLang = "en-US",
  micLabel = "Use microphone",
  listeningLabel = "Listening… tap again to stop",
  stopLabel = "Stop listening",
  permissionErrorLabel = "Microphone permission was blocked. Allow microphone access and try again.",
  unsupportedLabel = "Speech-to-text is not available in this browser. You can still type your answer.",
  secureContextLabel = "Microphone access needs HTTPS or localhost.",
  demoLabel = "Use demo text"
}: Props) {
  const [listening, setListening] = useState(false);
  const [message, setMessage] = useState("");

  const recognitionRef = useRef<RecognitionLike | null>(null);
  const shouldKeepListeningRef = useRef(false);
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const committedTextRef = useRef(value.trim());
  const sessionBaseTextRef = useRef(value.trim());
  const sessionFinalTextRef = useRef("");
  const fatalErrorRef = useRef(false);

  // Keep the speech buffer aligned with edits made by typing while the mic is off.
  useEffect(() => {
    if (!shouldKeepListeningRef.current) {
      committedTextRef.current = value.trim();
    }
  }, [value]);

  useEffect(() => {
    return () => {
      shouldKeepListeningRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      try {
        recognitionRef.current?.abort?.();
      } catch {
        // Ignore browser-specific cleanup errors on unmount.
      }
    };
  }, []);

  const clearRestartTimer = () => {
    if (restartTimerRef.current) {
      clearTimeout(restartTimerRef.current);
      restartTimerRef.current = null;
    }
  };

  const stopListening = () => {
    shouldKeepListeningRef.current = false;
    fatalErrorRef.current = false;
    clearRestartTimer();

    try {
      recognitionRef.current?.stop();
    } catch {
      // The recognizer may already have ended by itself.
    }

    setListening(false);
    setMessage("");
  };

  const startListening = () => {
    if (shouldKeepListeningRef.current || listening) {
      stopListening();
      return;
    }

    setMessage("");

    if (!window.isSecureContext) {
      setMessage(secureContextLabel);
      return;
    }

    const w = window as any;
    const SpeechRecognition = w.SpeechRecognition || w.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setMessage(unsupportedLabel);
      return;
    }

    try {
      const recognition: RecognitionLike = new SpeechRecognition();
      recognition.lang = speechLang;
      recognition.interimResults = true;
      recognition.continuous = true;
      recognition.maxAlternatives = 1;
      recognitionRef.current = recognition;

      committedTextRef.current = value.trim();
      sessionBaseTextRef.current = committedTextRef.current;
      sessionFinalTextRef.current = "";
      fatalErrorRef.current = false;
      shouldKeepListeningRef.current = true;

      const beginRecognitionSession = () => {
        if (!shouldKeepListeningRef.current || fatalErrorRef.current) return;

        sessionBaseTextRef.current = committedTextRef.current;
        sessionFinalTextRef.current = "";

        try {
          // Keep this call synchronous with the original button click on the first
          // session. Chrome/Safari may refuse microphone capture if recognition is
          // started only after awaiting a separate permission request.
          recognition.start();
        } catch {
          clearRestartTimer();
          restartTimerRef.current = setTimeout(() => {
            if (!shouldKeepListeningRef.current || fatalErrorRef.current) return;
            try {
              recognition.start();
            } catch {
              shouldKeepListeningRef.current = false;
              setListening(false);
              setMessage("The microphone could not restart. Tap the mic to try again.");
            }
          }, 350);
        }
      };

      recognition.onstart = () => {
        setListening(true);
        setMessage("");
      };

      recognition.onresult = (event: any) => {
        let finalText = "";
        let interimText = "";

        for (let i = 0; i < event.results.length; i++) {
          const transcript = event.results[i][0]?.transcript || "";
          if (event.results[i].isFinal) finalText += `${transcript} `;
          else interimText += `${transcript} `;
        }

        sessionFinalTextRef.current = finalText.trim();
        const committedForSession = joinSpeech(
          sessionBaseTextRef.current,
          sessionFinalTextRef.current
        );

        committedTextRef.current = committedForSession;
        onChange(joinSpeech(committedForSession, interimText));
      };

      recognition.onerror = (event) => {
        const code = event?.error || "";

        if (!shouldKeepListeningRef.current && code === "aborted") return;

        if (code === "not-allowed" || code === "service-not-allowed") {
          fatalErrorRef.current = true;
          shouldKeepListeningRef.current = false;
          setListening(false);
          setMessage(permissionErrorLabel);
        } else if (code === "language-not-supported") {
          fatalErrorRef.current = true;
          shouldKeepListeningRef.current = false;
          setListening(false);
          setMessage(unsupportedLabel);
        } else if (code === "audio-capture") {
          fatalErrorRef.current = true;
          shouldKeepListeningRef.current = false;
          setListening(false);
          setMessage("No microphone was found. Check your device microphone and browser permissions.");
        } else if (code === "network") {
          fatalErrorRef.current = true;
          shouldKeepListeningRef.current = false;
          setListening(false);
          setMessage("Speech recognition lost its connection. Check your internet and tap the mic to try again.");
        } else if (code === "no-speech") {
          setMessage("Still listening — you can keep talking, or tap the mic to stop.");
        } else if (code !== "aborted") {
          setMessage("Still listening — if speech does not appear, tap the mic twice to restart.");
        }
      };

      recognition.onend = () => {
        if (!shouldKeepListeningRef.current || fatalErrorRef.current) {
          setListening(false);
          return;
        }

        setListening(true);
        clearRestartTimer();
        restartTimerRef.current = setTimeout(beginRecognitionSession, 180);
      };

      beginRecognitionSession();
    } catch {
      shouldKeepListeningRef.current = false;
      setListening(false);
      setMessage("The microphone could not start. Tap the mic to try again.");
    }
  };

  const common = {
    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const next = e.target.value;
      onChange(next);
      if (!shouldKeepListeningRef.current) committedTextRef.current = next.trim();
    },
    placeholder
  };

  return (
    <div className={listening ? "voice-field voice-field--listening" : "voice-field"}>
      {multiline ? <textarea {...common} rows={3} /> : <input {...common} />}
      <button
        type="button"
        className={listening ? "mic-button mic-button--active" : "mic-button"}
        onClick={startListening}
        aria-label={listening ? stopLabel : micLabel}
        aria-pressed={listening}
        title={listening ? stopLabel : micLabel}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="9" y="3" width="6" height="11" rx="3" />
          <path d="M6.5 11.5a5.5 5.5 0 0 0 11 0M12 17v4M9 21h6" />
        </svg>
      </button>

      {listening && <span className="listening-pill">{listeningLabel}</span>}

      {message && (
        <div className="voice-message" role="status">
          <span>{message}</span>
          {demoPhrase && !listening && (
            <button
              type="button"
              onClick={() => {
                onChange(demoPhrase);
                committedTextRef.current = demoPhrase.trim();
                setMessage("");
              }}
            >
              {demoLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
