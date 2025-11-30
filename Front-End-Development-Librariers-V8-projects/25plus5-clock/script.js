const { useState, useEffect, useRef } = React;

const toSeconds = (min) => min * 60;

const App = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(toSeconds(25));
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("Session"); // "Session" or "Break"

  const beepRef = useRef(null);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // ---------- Length controls ----------
  const incrementSession = () => {
    if (isRunning) return;
    setSessionLength((prev) => Math.min(prev + 1, 60));
  };

  const decrementSession = () => {
    if (isRunning) return;
    setSessionLength((prev) => Math.max(prev - 1, 1));
  };

  const incrementBreak = () => {
    if (isRunning) return;
    setBreakLength((prev) => Math.min(prev + 1, 60));
  };

  const decrementBreak = () => {
    if (isRunning) return;
    setBreakLength((prev) => Math.max(prev - 1, 1));
  };

  // ⏱ When session length changes and we are STOPPED + in Session mode,
  // update the display.
  useEffect(() => {
    if (!isRunning && mode === "Session") {
      setTimeLeft(toSeconds(sessionLength));
    }
  }, [sessionLength, mode]); // NOTE: no isRunning in deps

  // ⏱ When break length changes and we are STOPPED + in Break mode,
  // update the display.
  useEffect(() => {
    if (!isRunning && mode === "Break") {
      setTimeLeft(toSeconds(breakLength));
    }
  }, [breakLength, mode]); // NOTE: no isRunning in deps

  // ---------- Main timer effect ----------
  useEffect(() => {
    if (!isRunning) return; // if paused, do nothing

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => {
        // 01 -> 00: play beep
        if (prev === 1 && beepRef.current) {
          beepRef.current.currentTime = 0;
          beepRef.current.play();
        }

        // At 0: switch mode and reset to new length
        if (prev === 0) {
          if (mode === "Session") {
            setMode("Break");
            return toSeconds(breakLength);
          } else {
            setMode("Session");
            return toSeconds(sessionLength);
          }
        }

        return prev - 1;
      });
    }, 1000);

    // Cleanup: when isRunning becomes false or deps change, stop the timer
    return () => clearInterval(intervalId);
  }, [isRunning, mode, breakLength, sessionLength]);

  // ---------- Start / Pause ----------
  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  // ---------- Reset ----------
  const handleReset = () => {
    setIsRunning(false);

    setBreakLength(5);
    setSessionLength(25);
    setMode("Session");
    setTimeLeft(toSeconds(25));

    if (beepRef.current) {
      beepRef.current.pause();
      beepRef.current.currentTime = 0;
    }
  };

  const timeStyle = {
    color: timeLeft <= 59 ? "red" : "white",
  };

  return (
    <div id="clock-watch">
      <h1 id="title">25 + 5 CLOCK</h1>

      <div id="sb-container">
        {/* Session controls */}
        <div className="sb-label" id="session-label">
          <p id="session-text">Session Length</p>
          <div className="sb-toolbar">
            <button
              className="arrow-btn"
              id="session-increment"
              onClick={incrementSession}
            >
              <i className="fas fa-arrow-up" />
            </button>
            <div id="session-length">{sessionLength}</div>
            <button
              className="arrow-btn"
              id="session-decrement"
              onClick={decrementSession}
            >
              <i className="fas fa-arrow-down" />
            </button>
          </div>
        </div>

        {/* Break controls */}
        <div className="sb-label" id="break-label">
          <p id="session-text">Break Length</p>
          <div className="sb-toolbar">
            <button
              className="arrow-btn"
              id="break-increment"
              onClick={incrementBreak}
            >
              <i className="fas fa-arrow-up" />
            </button>
            <div id="break-length">{breakLength}</div>
            <button
              className="arrow-btn"
              id="break-decrement"
              onClick={decrementBreak}
            >
              <i className="fas fa-arrow-down" />
            </button>
          </div>
        </div>
      </div>

      {/* Timer display */}
      <div id="timer-label">{mode}</div>
      <div id="time-left" style={timeStyle}>
        {formatTime(timeLeft)}
      </div>

      {/* Controls */}
      <div id="play-container">
        <audio
          id="beep"
          ref={beepRef}
          src="https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3"
        />

        <button
          type="button"
          id="start_stop"
          onClick={handleStartStop}
        >
          <i className="fas fa-play" />
          <i className="fas fa-pause" />
        </button>

        <button id="reset" onClick={handleReset}>
          <i className="fas fa-sync-alt" />
        </button>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
