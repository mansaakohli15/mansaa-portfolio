import { useCallback, useEffect, useRef, useState } from "react";

// ============================================================
// useAITwinVoice
// Free, no-API-key voice intro using the browser's built-in
// SpeechSynthesis. Exposes word-boundary timing so the UI can
// pulse/glow in sync with speech instead of sitting static.
// ============================================================
export function useAITwinVoice(script) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(true);
  const [intensity, setIntensity] = useState(0); // 0..1, driven by word boundaries
  const utterRef = useRef(null);
  const decayRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
    return () => {
      if (decayRef.current) cancelAnimationFrame(decayRef.current);
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const pickVoice = useCallback(() => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;
    const en = voices.filter((v) => /^en/i.test(v.lang));
    const pool = en.length ? en : voices;

    // Explicit known female voice names across platforms, checked first
    const namedFemale = pool.find((v) =>
      /Zira|Samantha|Susan|Karen|Moira|Tessa|Female|Google US English Female|Google UK English Female|Microsoft Zira|Aria|Jenny/i.test(
        v.name
      )
    );
    if (namedFemale) return namedFemale;

    // Heuristic: many platforms list a "Female" voice as the second en-US entry,
    // or mark gender implicitly — fall back to an Indian-English voice if present
    const enIN = pool.find((v) => /en-IN/i.test(v.lang));
    if (enIN) return enIN;

    return pool[0] || voices[0];
  }, []);

  const decayLoop = useCallback(() => {
    setIntensity((prev) => {
      const next = prev * 0.88;
      return next < 0.02 ? 0 : next;
    });
    decayRef.current = requestAnimationFrame(decayLoop);
  }, []);

  const speak = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();

    const utter = new SpeechSynthesisUtterance(script);
    const voice = pickVoice();
    if (voice) utter.voice = voice;
    utter.rate = 1.0;
    utter.pitch = 1.02;
    utter.volume = 1;

    utter.onstart = () => {
      setSpeaking(true);
      decayRef.current = requestAnimationFrame(decayLoop);
    };
    utter.onboundary = (e) => {
      if (e.name === "word" || e.charIndex !== undefined) {
        setIntensity(1);
      }
    };
    utter.onend = () => {
      setSpeaking(false);
      setIntensity(0);
      if (decayRef.current) cancelAnimationFrame(decayRef.current);
    };
    utter.onerror = () => {
      setSpeaking(false);
      setIntensity(0);
      if (decayRef.current) cancelAnimationFrame(decayRef.current);
    };

    utterRef.current = utter;
    window.speechSynthesis.speak(utter);
  }, [script, supported, pickVoice, decayLoop]);

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
    setIntensity(0);
    if (decayRef.current) cancelAnimationFrame(decayRef.current);
  }, [supported]);

  const toggle = useCallback(() => {
    if (speaking) stop();
    else speak();
  }, [speaking, speak, stop]);

  return { speaking, supported, intensity, speak, stop, toggle };
}
