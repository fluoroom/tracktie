"use client"
function round(value, precision) {
  var multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
export default function BandejaB (props) {

  const percentage = round(((props.bpm-props.bpmMaster)/props.bpmMaster)*100,1)*-1;
  const color = percentage > 0 ? '#0f0' : percentage<0 ? '#f00' : '#fff';
  return (
    <>
    <div className={"flex flex-col justify-center items-center"+((isNaN(props.bpm)&&!props.listening&&props.firstPlay)?" shake":'')} style={{ width: props.s + "em", height: props.s + "em"}}>
      <div style={{
        animationName: "listeningAnimation",
        animationPlayState: props.listening ? 'running' : 'paused',
        animationDuration: '1.575s',
        animationTimingFunction: 'linear',
        animationIterationCount: 'infinite',
        position: 'absolute',
        zIndex:-5,
      }}>
        <svg viewBox="0 0 420 420" style={{
        width: props.s + "em",
        height: props.s + "em",
      }}>
      <circle cx="210" cy="210" r="204" fill="none" stroke="#FFFFFF" strokeWidth="10" />

      <line x1="205" y1="06" x2="205" y2="50" stroke="#FFFFFF" strokeWidth="10" />

    </svg>
    </div>
    <div style={{fontSize:1.8*props.s/14+'em',lineHeight:'1em'}} className="text-white opacity-80 mb-2">{props.bpm}</div>
    <div style={{fontSize:2.5*props.s/14+'em',lineHeight:'1em',color:color}}>{(percentage>0)?'+':''}{isNaN(percentage) ? "---" : percentage}%</div>
    </div>
    </>
  );
}