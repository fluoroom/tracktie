"use client"
import { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';

export default function Config(props) {
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [detectionTimeSetting, setDetectionTimeSetting] = useState(
    parseInt(localStorage.getItem("detectionTime")) || 10
  );
  const [isAutoGainEnabled, setIsAutoGainEnabled] = useState(
    localStorage.getItem("autoGain") === "true" || false
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      setAudioInputDevices(
        devices.filter((device) => device.kind === "audioinput")
      );
    });
  }, []);

  const highlightedButtonBackground = "rgba(255, 255, 255, 0.125)";

  return (
    <div
      className="p-9 absolute w-full h-full flex flex-col items-left justify-around"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.75)",
        zIndex: 10,
        backdropFilter: "blur(15px)",
        height: props.isPortrait ? "100vw" : "100%",
      }}
    >
      <p>
        <label htmlFor="audioSource">Audio input source:</label>
        <br />
        <select
          className="text-black"
          value={localStorage.getItem("audioSource") || "default"}
          onChange={(event) =>
            localStorage.setItem("audioSource", event.target.value)
          }
          id="audioSource"
        >
          {audioInputDevices.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label || `Input ${audioInputDevices.length + 1}`}
            </option>
          ))}
        </select>
      </p>
      <p>
        BPM detection time:{" "}
        <span className="opacity-50">(more time, more accurate)</span>
        <br />
        <button
          onClick={() => {
            setDetectionTimeSetting(10);
            localStorage.setItem("detectionTime", 10);
          }}
          style={{
            backgroundColor:
              detectionTimeSetting === 10
                ? highlightedButtonBackground
                : "transparent",
          }}
          className="border border-white text-white py-2 px-6 rounded-sm mr-4"
        >
          10s
        </button>
        <button
          onClick={() => {
            setDetectionTimeSetting(15);
            localStorage.setItem("detectionTime", 15);
          }}
          style={{
            backgroundColor:
              detectionTimeSetting === 15
                ? highlightedButtonBackground
                : "transparent",
          }}
          className="border border-white text-white py-2 px-6 rounded-sm mr-4"
        >
          15s
        </button>
        <button
          onClick={() => {
            setDetectionTimeSetting(20);
            localStorage.setItem("detectionTime", 20);
          }}
          style={{
            backgroundColor:
              detectionTimeSetting === 20
                ? highlightedButtonBackground
                : "transparent",
          }}
          className="border border-white text-white py-2 px-6 rounded-sm"
        >
          20s
        </button>
      </p>
      <p>
        <span className="opacity-50">
          Autogain:{" "}
          <span className="opacity-50">
            (only for microphones, disable for direct cable input)
          </span>
        </span>
        <br />
        <button
          onClick={() => {
            setIsAutoGainEnabled(false);
            localStorage.setItem("autoGain", false);
          }}
          style={{
            backgroundColor:
              isAutoGainEnabled === false
                ? highlightedButtonBackground
                : "transparent",
            opacity: !isMobile ? 0.5 : 1,
          }}
          className="border border-white text-white py-2 px-6 rounded-sm mr-4"
          disabled={!isMobile}
        >
          Disabled
        </button>
        <button
          onClick={() => {
            setIsAutoGainEnabled(true);
            localStorage.setItem("autoGain", true);
          }}
          style={{
            backgroundColor:
              isAutoGainEnabled === true
                ? highlightedButtonBackground
                : "transparent",
            opacity: !isMobile ? 0.5 : 1,
          }}
          className="border border-white text-white py-2 px-6 rounded-sm"
          disabled={!isMobile}
        >
          Enabled
        </button>
        {!isMobile && (
          <span className="opacity-80 ml-4">Only for mobile devices</span>
        )}
      </p>
      <button
        onClick={() => location.reload()}
        className="border border-white text-white py-2 px-6 rounded-sm hover:bg-white hover:text-black"
      >
        Save
      </button>
    </div>
  );
}
