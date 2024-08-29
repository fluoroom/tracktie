"use client"
import { useEffect, useState, useRef } from "react";
import { createPortal } from 'react-dom';
import BandejaA from "../components/BandejaA";
import BandejaB from "../components/BandejaB";
import ListenButton from "../components/ListenButton";
import Config from "../components/Config";
import IonIcon from "@reacticons/ionicons";
import * as realtimeBpm from 'realtime-bpm-analyzer';
import { isMobile } from 'react-device-detect';

export default function TrackTie() {
  const [isPortrait, setIsPortrait] = useState(false);
  const [isListeningA, setIsListeningA] = useState(false);
  const [isListeningB, setIsListeningB] = useState(false);
  const [bpmA, setBpmA] = useState("---");
  const [bpmB, setBpmB] = useState("---");
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [firstPlayA, setFirstPlayA] = useState(false);
  const [firstPlayB, setFirstPlayB] = useState(false);

  const rec = useRef(null)
  const stream = useRef(null)

  function openFullscreen() {
    setIsFullScreen(true);
    var elem = document.body;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();
    }
  }

  function closeFullscreen() {
    setIsFullScreen(false);
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) { /* Safari */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE11 */
      document.msExitFullscreen();
    }
  }

  function toggleFullScreen() {
    if (isFullScreen) {
      closeFullscreen();
    } else {
      openFullscreen();
    }
  }


  useEffect(() => {
    setIsPortrait(window.matchMedia("(orientation: portrait)").matches);
    window.matchMedia("(orientation: portrait)").addEventListener("change", (event) => {
      setIsPortrait(event.matches);
    });


    async function start() {
      // Second call to getUserMedia() with changed device may cause error, so we need to release stream before changing device
      if (!localStorage.getItem("audioSource")) {
        localStorage.setItem("audioSource", "default");
      }
      if (!localStorage.getItem("detectionTime")) {
        localStorage.setItem("detectionTime", "10");
      }
      if (!localStorage.getItem("autoGain")) {
        localStorage.setItem("autoGain", "false");
      }

      if (rec.current) {
        return;
      }
      if (window.stream) {
        window.stream.getTracks().forEach(track => track.stop());
      }

      const audioSource = localStorage.getItem("audioSource") || "default";

      const constraints = {
        audio: {
          deviceId: audioSource ? { exact: audioSource } : undefined,
          autoGainControl: isMobile ? (localStorage.getItem("autoGain") === "true") ? true : false : false,
          echoCancellation: false,
          noiseSuppression: false,
          channelCount: 1
        }
      };

      navigator.mediaDevices.getUserMedia(constraints).then(async (stream1) => {
        stream.current = stream1;
        //await register(await connect());
        rec.current = new MediaRecorder(stream.current, { audioBitsPerSecond: 320000 });
      }).then().catch(handleError);

    }

    start();

  }, []);



  function handleError(error) {
    return;
    console.log(error);
  }

  async function play(bandeja) {
    switch (bandeja) {
      case "A":
        setIsListeningA(true);
        break;
      case "B":
        setIsListeningB(true);
        break;
    }

    let audioChunks = [];
    rec.current.ondataavailable = async e => {

      audioChunks.push(e.data);
      if (rec.current.state == "inactive") {
        const mimeType = rec.current.mimeType;
        const blob = new Blob(audioChunks, { type: mimeType });
        const audioBlobBuffer = await blob.arrayBuffer();
        const audioContext = new AudioContext();
        audioContext.decodeAudioData(audioBlobBuffer, (arrayBuffer) => {

          realtimeBpm.analyzeFullBuffer(arrayBuffer).then(topCandidates => {
            // Do something with the BPM
            console.log(topCandidates);

            setIsListeningA(false);
            setIsListeningB(false);

            const topCandidate = topCandidates[0];
            if (topCandidate) {
              const tempo = topCandidate.tempo;
              switch (bandeja) {
                case "A":
                  setBpmA(tempo);
                  break;
                case "B":
                  setBpmB(tempo);
                  break;
              }
            } else {
              switch (bandeja) {
                case "A":
                  setBpmA("---");
                  break;
                case "B":
                  setBpmB("---");
                  break;
              }
            }
          });

        })
        return;
      }
    }
    rec.current.start();
    setTimeout(() => {
      rec.current.stop();
    }, (localStorage.getItem("detectionTime") || 10) * 1000);
  }



  const screenRef = useRef();


  return (
    <body style={{ height: isPortrait ? "100vh" : "100vh", marginTop: isPortrait ? "5vh" : "0vh" }}>

      <div style={{ height: isPortrait ? "100vh" : "100%" }} className="appWrapper w-screen flex flex-col items-center justify-center overflow-hidden">
        <div ref={screenRef} style={{ width: isPortrait ? "100vh" : "100%", height: "100%", rotate: isPortrait ? "90deg" : "0deg" }} className={"p-9 flex flex-col items-center justify-center transition-all"}>
          <div className="flex flex-row items-start justify-between w-full">
            <div className="flex flex-col">
              <BandejaA firstPlay={firstPlayA} s="14" listening={isListeningA} bpm={bpmA} />
              <ListenButton listening={isListeningA} busy={isListeningA || isListeningB} onClick={() => { play("A"); setFirstPlayA(true) }} />
            </div>
            <div className=" flex flex-col items-center justify-between relative h-full" >
              <h1 style={{ fontSize: "2.5em", lineHeight: "1em" }}>TrackTie</h1>
              <div className="flex flex-col items-center">
                <ConfigToggle screenRef={screenRef} isPortrait={isPortrait} />
                <button onClick={toggleFullScreen} style={{ backgroundColor: isFullScreen ? 'transparent' : 'rgba(255,255,255,0.5)', color: isFullScreen ? '#fff' : '#000', border: isFullScreen ? '1px solid #fff' : '1px solid transparent', fontSize: '.9em', opacity: isFullScreen ? 0.5 : 1 }} className="py-3 px-7 rounded-sm  hover:opacity-80">Fullscreen</button>
              </div>
              <div className="absolute  flex flex-col items-center justify-center p-9" style={{ height: "14em", zIndex: '-10' }}><span style={{ lineHeight: "1em", fontSize: '3em' }}>{'->'}</span></div>
            </div>
            <div className="flex flex-col">
              <BandejaB firstPlay={firstPlayB} s="14" listening={isListeningB} bpmMaster={bpmA} bpm={bpmB} />
              <ListenButton listening={isListeningB} busy={isListeningA || isListeningB} onClick={() => { play("B"); setFirstPlayB(true) }} />
            </div>
          </div>
        </div>
      </div>
    </body>
  );
}


const ConfigToggle = (props) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button onClick={() => setOpen(!open)} style={{ lineHeight: '1em' }} className="text-white hover:opacity-80 p-4 z-10 mb-4" ><IonIcon name="settings-sharp" size="large" /></button>
      {
        open && createPortal(
          <Config setOpen={setOpen} isPortrait={props.isPortrait} />,
          props.screenRef.current
        )
      }

    </>
  )
}