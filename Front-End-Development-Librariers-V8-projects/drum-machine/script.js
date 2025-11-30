const { useState, useEffect } = React;

const App = () => {
  const [isOn, setIsOn] = useState(true); // start ON so FCC tests can play
  const [displayText, setDisplayText] = useState("");

  const handleClick = (e) => {
    if (!isOn) return; // only play when switch is ON

    const audio = e.currentTarget.querySelector("audio");
    const id = e.currentTarget.id;

    if (audio) {
      audio.currentTime = 0;
      audio.play();
      setDisplayText(id);
    }
  };

  const handleKeyDown = (e) => {
    const keyPressed = e.key.toUpperCase();
    const audio = document.getElementById(keyPressed); // audio has id Q,W,E...

    if (audio) {
      if (!isOn) return;
      audio.currentTime = 0;
      audio.play();

      const parent = audio.parentElement;
      if (parent) {
        setDisplayText(parent.id); // show pad name in display
      }
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOn]);

  return (
    <>
      <div id="drum-machine">
        <div className="drum-pads">
          <button className="drum-pad" id="Heater-1" onClick={handleClick}>
            Q
            <audio
              className="clip"
              id="Q"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-1.mp3"
            />
          </button>

          <button className="drum-pad" id="Heater-2" onClick={handleClick}>
            W
            <audio
              className="clip"
              id="W"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-2.mp3"
            />
          </button>

          <button className="drum-pad" id="Heater-3" onClick={handleClick}>
            E
            <audio
              className="clip"
              id="E"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-3.mp3"
            />
          </button>

          <button className="drum-pad" id="Heater-4" onClick={handleClick}>
            A
            <audio
              className="clip"
              id="A"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-4_1.mp3"
            />
          </button>

          <button className="drum-pad" id="Clap" onClick={handleClick}>
            S
            <audio
              className="clip"
              id="S"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Heater-6.mp3"
            />
          </button>

          <button className="drum-pad" id="Offene Hi-Hat" onClick={handleClick}>
            D
            <audio
              className="clip"
              id="D"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Dsc_Oh.mp3"
            />
          </button>

          <button className="drum-pad" id="Kick-n'-Hat" onClick={handleClick}>
            Z
            <audio
              className="clip"
              id="Z"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Kick_n_Hat.mp3"
            />
          </button>

          <button className="drum-pad" id="Kick" onClick={handleClick}>
            X
            <audio
              className="clip"
              id="X"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/RP4_KICK_1.mp3"
            />
          </button>

          <button
            className="drum-pad"
            id="Geschlossene Hi-Hat"
            onClick={handleClick}
          >
            C
            <audio
              className="clip"
              id="C"
              src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/Cev_H2.mp3"
            />
          </button>
        </div>

        <div className="right-side">
          <div className="toggle-container">
            <div className="toggle-wrap">
              <input
                className="toggle-input"
                id="holo-toggle"
                type="checkbox"
                checked={isOn}
                onChange={() => {
                  const newState = !isOn;
                  setIsOn(newState);
                  if (!newState) setDisplayText("");
                }}
              />

              <label className="toggle-track" htmlFor="holo-toggle">
                <div className="track-lines">
                  <div className="track-line" />
                </div>

                <div className="toggle-thumb">
                  <div className="thumb-core" />
                  <div className="thumb-inner" />
                  <div className="thumb-scan" />
                  <div className="thumb-particles">
                    <div className="thumb-particle" />
                    <div className="thumb-particle" />
                    <div className="thumb-particle" />
                    <div className="thumb-particle" />
                    <div className="thumb-particle" />
                  </div>
                </div>

                <div className="toggle-data">
                  <div className="data-text on">ON</div>
                  <div className="data-text off">OFF</div>
                  <div className="status-indicator on" />
                  <div className="status-indicator off" />
                </div>

                <div className="energy-rings">
                  <div className="energy-ring" />
                  <div className="energy-ring" />
                  <div className="energy-ring" />
                </div>

                <div className="interface-lines">
                  <div className="interface-line" />
                  <div className="interface-line" />
                  <div className="interface-line" />
                  <div className="interface-line" />
                  <div className="interface-line" />
                  <div className="interface-line" />
                </div>

                <div className="toggle-reflection" />
                <div className="holo-glow" />
              </label>
            </div>
          </div>

          <div id="display">{displayText}</div>
        </div>
      </div>
    </>
  );
};

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<App />);
