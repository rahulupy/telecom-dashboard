import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
} from "lucide-react";

import { usePlayback } from "../../context/PlaybackContext";

export default function PlaybackControls() {
   const {
        playing,
        play,
        pause,
        next,
        previous,
        speed,
        setSpeed,
        history,
        currentIndex,
        setCurrentIndex,
        autoFollow,
        setAutoFollow,
    } = usePlayback();

  return (
    <div className="flex flex-col gap-3">

        {/* Controls */}
        <div className="flex items-center gap-2">

        <button
            onClick={previous}
            className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
            <SkipBack size={18} />
        </button>

        <button
            onClick={() => (playing ? pause() : play())}
            className="rounded-lg bg-blue-600 p-2 text-white transition hover:bg-blue-700"
        >
            {playing ? <Pause size={18} /> : <Play size={18} />}
        </button>

        <button
            onClick={next}
            className="rounded-lg border border-slate-700 bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
            <SkipForward size={18} />
        </button>

        <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-white"
        >
            <option value={1}>1×</option>
            <option value={2}>2×</option>
            <option value={5}>5×</option>
            <option value={10}>10×</option>
        </select>

        <span className="ml-2 text-xs text-slate-400">
            {history.length === 0
            ? "0 / 0"
            : `${currentIndex + 1} / ${history.length}`}
        </span>

        </div>

        {/* Playback Slider */}
        <input
            type="range"
            min={0}
            max={Math.max(0, history.length - 1)}
            value={Math.max(0, currentIndex)}
            onChange={(e) =>
                setCurrentIndex(Number(e.target.value))
            }
            className="w-full accent-blue-500"
        />

        <label className="flex items-center gap-2 text-sm text-slate-300">
            <input
                type="checkbox"
                checked={autoFollow}
                onChange={(e) => setAutoFollow(e.target.checked)}
            />
            Auto Follow
        </label>

    </div>
    );
}