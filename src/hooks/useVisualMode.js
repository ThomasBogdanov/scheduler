import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial)
  const [history, setHistory] = useState([initial]);
  
  function transition(mode, bool) {
    const placeableHistory = history;
    if (bool) {
        placeableHistory.pop()
        placeableHistory.push(mode);
        setHistory(placeableHistory)
        setMode(mode)
        return;
      }
      placeableHistory.push(mode);
      setHistory(placeableHistory)
      setMode(mode);
    }

    function back() {
    const placeableHistory = history;

      if (history.length === 1) {
        return
      }
      placeableHistory.pop();
      setHistory(placeableHistory);
      setMode(history[history.length - 1]);
    }
  
  return { mode, transition, back }
}
