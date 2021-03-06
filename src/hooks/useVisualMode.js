import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(mode, bool) {
    if (bool) {
      history.pop();
      history.push(mode);
      setHistory(history);
      setMode(mode);
      return;
    }
    history.push(mode);
    setHistory(history);
    setMode(mode);
  }

  function back() {
    if (history.length === 1) {
      return;
    }
    history.pop();
    setHistory(history);
    setMode(history[history.length - 1]);
  }

  return { mode, transition, back };
}
