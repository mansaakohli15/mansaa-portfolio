import { useCallback, useState } from "react";

export function useAITwinChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const send = useCallback(
    async (text) => {
      if (!text.trim()) return;
      const userMsg = { role: "user", content: text.trim() };
      const nextMessages = [...messages, userMsg];
      setMessages(nextMessages);
      setLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: nextMessages }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong.");
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } catch (e) {
        setError(e.message);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "I'm having trouble connecting right now — this feature needs a GROQ_API_KEY set up on the server. In the meantime, feel free to email me directly!",
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  return { messages, send, loading, error, reset };
}
