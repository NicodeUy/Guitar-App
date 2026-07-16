
import { noteNames, intervalColors, shorthandIntervals } from "./theoryData";

// ==========================================
// SUBCOMPONENTE DIAPASÓN REUTILIZABLE
// ==========================================

export default function Fretboard({
  strings,
  currentRootNote,
  currentScaleType,
  labelMode,
  gameMode,
  freeRevealActive,
  isCompactActive,
  unlockedScaleNotes,
  foundLocations,
  targetBridgeNote,
  cagedLimits,
  onNotePlay,
  database
}) {

  const renderNoteDot = (stringIdx, fret, stringMidi) => {
    const midi = stringMidi + fret;
    const intervalFromRoot = ((midi - currentRootNote) % 12 + 12) % 12;
    const noteName = noteNames[midi % 12];
    const noteKey = `${stringMidi}-${fret}`;

    let shouldShow = false;
    let isBridge = false;

    // Lógica visual condicionada por el tipo de práctica activa
    if (gameMode === "free") {
      const isInScale = database[currentScaleType].intervals.includes(intervalFromRoot);
      shouldShow = freeRevealActive ? isInScale && unlockedScaleNotes[noteKey] : isInScale;
    } else if (gameMode === "interval_trainer") {
      shouldShow = intervalFromRoot === 0; // Solo mostramos la referencia inicial
    } else if (gameMode === "scale_builder") {
      shouldShow = unlockedScaleNotes[noteKey] === true;
    } else if (gameMode === "find_note") {
      const isRoot = intervalFromRoot === 0;
      const isFound = foundLocations.some((loc) => loc.midi === midi && loc.fret === fret);
      shouldShow = isRoot || isFound;
    } else if (gameMode === "caged_connector") {
      const isInScale = database["pentatonic_minor"].intervals.includes(intervalFromRoot);
      const isDiscovered = unlockedScaleNotes[noteKey] === true;

      isBridge =
        targetBridgeNote &&
        targetBridgeNote.midi === midi &&
        targetBridgeNote.fret === fret;

      if (isBridge) {
        shouldShow = true;
      } else if (isInScale && cagedLimits && fret >= cagedLimits.min && fret <= cagedLimits.max) {
        shouldShow = isDiscovered;
      }
    }

    if (!shouldShow) return null;

    const isRoot = intervalFromRoot === 0;
    const borderStyle = isBridge
      ? "ring-4 ring-amber-400 animate-bounce scale-110 z-40"
      : isRoot
      ? "ring-2 ring-white border border-black font-black"
      : "border border-black/30";

    const label = isRoot ? noteName : labelMode === "names" ? noteName : shorthandIntervals[intervalFromRoot];

    return (
      <div
        style={{
          width: isCompactActive ? "26px" : "36px",
          height: isCompactActive ? "26px" : "36px",
          fontSize: isCompactActive ? "9px" : "11px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.85)"
        }}
        className={`rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all duration-300 z-30 select-none ${
          intervalColors[intervalFromRoot]
        } ${borderStyle}`}
      >
        {label}
      </div>
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-inner relative overflow-hidden w-full">
      {gameMode === "caged_connector" && (
        <div className="absolute top-4 right-5 bg-zinc-950/90 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold z-30 flex items-center gap-1.5 backdrop-blur shadow-md">
          <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
          <span>Foco Geométrico</span>
        </div>
      )}

      <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
        <div style={{ minWidth: "850px" }} className="w-full">
          <div
            style={{
              minWidth: "850px",
              background: "linear-gradient(to right, #1a0f07, #28170c, #1a0f07)"
            }}
            className="relative rounded-lg pr-1 min-h-65 flex flex-col justify-between border-y border-zinc-950 py-1"
          >
            {/* Separadores de trastes */}
            <div className="absolute inset-y-0 left-0 right-0 pointer-events-none z-10">
              <div
                className="absolute inset-y-0 w-7px rounded-full bg-linear-to-b from-[#fff8de] via-[#e8cf87] to-[#8f6b24] shadow-[0_0_0_2px_rgba(255,255,255,0.5),0_0_16px_rgba(232,207,135,0.6)]"
                style={{ left: "calc(6% - 3px)" }}
              />
              {Array.from({ length: 12 }, (_, i) => i + 1).map((fret) => (
                <div
                  key={fret}
                  className="absolute inset-y-0 w-1.25 rounded-full bg-linear-to-b from-[#f2f2f2] via-[#8c8c8c] to-[#2f2f2f] shadow-[0_0_0_2px_rgba(255,255,255,0.18),0_0_10px_rgba(120,120,120,0.35)]"
                  style={{ left: `calc(${fret} * 7% + 3.5%)` }}
                />
              ))}
            </div>

            {/* Marcadores de Nácar tradicionales */}
            {[3, 5, 7, 9].map((fret) => (
              <div
                key={fret}
                style={{
                  left: `calc(${fret} * 7% + 3.5%)`,
                  top: "50%",
                  transform: "translate(-50%, -50%)"
                }}
                className="absolute w-3 h-3 bg-zinc-400/30 rounded-full pointer-events-none z-10 shadow-sm"
              />
            ))}
            {/* Octava (Doble Marcador en traste 12) */}
            <div
              style={{
                left: "calc(12 * 7% + 3.5%)"
              }}
              className="absolute inset-y-0 flex flex-col justify-around py-4 pointer-events-none z-10"
            >
              <span className="w-2.5 h-2.5 bg-rose-500/30 rounded-full" />
              <span className="w-2.5 h-2.5 bg-rose-500/30 rounded-full" />
            </div>

            {/* Cuerdas */}
            {strings.map((stringObj, stringIdx) => {
              const thickness = 1 + stringIdx * 0.45;

              return (
                <div
                  key={stringObj.midi}
                  className="relative grid w-full"
                  style={{
                    height: "38px",
                    gridTemplateColumns: "minmax(0, 6%) repeat(12, minmax(0, 1fr))"
                  }}
                >
                  {/* Alambre físico de la cuerda */}
                  <div
                    style={{ height: `${thickness}px` }}
                    className="absolute left-0 right-0 bg-zinc-400/70 pointer-events-none z-0 shadow-sm"
                  />

                  {/* Traste Abierto (Open String / Nut) */}
                  <div
                    onClick={() => onNotePlay(stringObj.midi, 0, stringIdx)}
                    className="h-full flex items-center justify-center cursor-pointer hover:bg-zinc-800/40 border-r-[7px] border-[#d8c08a] bg-[linear-gradient(90deg,rgba(255,248,220,0.24),rgba(216,192,138,0.22))] z-20 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)]"
                  >
                    {renderNoteDot(stringIdx, 0, stringObj.midi)}
                  </div>

                  {/* Trastes con simulación de sombreado CAGED */}
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((fret) => {
                    const isFretFocused =
                      cagedLimits && fret >= cagedLimits.min && fret <= cagedLimits.max;

                    return (
                      <div
                        key={fret}
                        onClick={() => onNotePlay(stringObj.midi + fret, fret, stringIdx)}
                        className={`h-full flex items-center justify-center cursor-pointer border-r-[5px] border-zinc-700/90 transition-all relative z-20 ${
                          isFretFocused ? "bg-rose-500/5 hover:bg-rose-500/10" : "hover:bg-zinc-800/30"
                        }`}
                      >
                        {renderNoteDot(stringIdx, fret, stringObj.midi)}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Identificación de trastes */}
          <div
            style={{
              minWidth: "850px",
              gridTemplateColumns: "minmax(0, 10%) repeat(12, minmax(0, 1fr))"
            }}
            className="grid w-full text-center text-zinc-500 text-[10px] font-black tracking-wider pt-3 border-t border-zinc-800/50"
          >
            <div className="shrink-0">Aire</div>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((fret) => (
              <div key={fret} className="shrink-0">
                Traste {fret}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}