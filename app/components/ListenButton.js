"use client"

export default function ListenButton  ({ listening, onClick, busy })  {
  return (
    <button
      className="border border-white text-white py-3 px-7 m-auto mt-10 rounded-sm"
      style={{opacity: busy ? 0.5 : 1}}
      onClick={onClick} disabled={busy}
    >
      {listening ? "Listening" : "Listen"}
    </button>
  )
}