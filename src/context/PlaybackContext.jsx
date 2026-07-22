import { createContext, useContext, useEffect, useState } from "react";
import { getMovementHistory } from "../services/movementService";

const PlaybackContext = createContext();

export function PlaybackProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [autoFollow, setAutoFollow] = useState(true);

  useEffect(() => {
    async function load() {
      const movement = await getMovementHistory();
      setHistory(movement);
      setCurrentIndex(movement.length - 1);
    }

    load();
  }, []);

  useEffect(() => {
    if (!playing) return;

    const timer = setInterval(() => {
        setCurrentIndex((prev) => {
            if (prev >= history.length - 1) {
                setPlaying(false); // Stop playback automatically
                return prev;
            }

            return prev + 1;
        });
    }, 1000 / speed);

    return () => clearInterval(timer);

  }, [playing, history, speed]);

  return (
    <PlaybackContext.Provider
      value={{
        history,

        currentIndex,

        current: history[currentIndex] ?? null,

        playing,

        speed,
        autoFollow,
        setAutoFollow,

        play: () => {
            if (
                currentIndex >= history.length - 1 &&
                history.length > 0
            ) {
                setCurrentIndex(0);
            }

            setPlaying(true);
        },

        pause: () => setPlaying(false),

        setSpeed,

        next: () =>
            setCurrentIndex((i) =>
            Math.min(history.length - 1, i + 1)
        ),

            previous: () => {
                setPlaying(false);

                setCurrentIndex((i) =>
                    Math.max(0, i - 1)
                );
            },

                setCurrentIndex,
                }}
    >
      {children}
    </PlaybackContext.Provider>
  );
}

export function usePlayback() {
  return useContext(PlaybackContext);
}