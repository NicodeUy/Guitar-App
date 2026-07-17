import{ useState, useEffect, useRef } from "react";
import {
  Music,
  Music2,
  Gamepad2,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sliders,
  Settings,
  HelpCircle,
  Trash2,
  Award,
  Lightbulb,
  X,
  ChevronsRight,
  Target,
  Compass,
  GraduationCap,
  Info,
  CheckSquare,
  ZoomOut,
  BarChart2,
} from "lucide-react";

const intervalColors = [
  "bg-rose-600", // 0: Tónica
  "bg-orange-600", // 1: 2da menor
  "bg-amber-600", // 2: 2da mayor
  "bg-yellow-600", // 3: 3ra menor
  "bg-lime-600", // 4: 3ra mayor
  "bg-emerald-600", // 5: 4ta justa
  "bg-teal-600", // 6: 4ta aum / 5ta dis
  "bg-cyan-600", // 7: 5ta justa
  "bg-sky-600", // 8: 6ta menor
  "bg-blue-600", // 9: 6ta mayor
  "bg-indigo-600", // 10: 7ma menor
  "bg-violet-600", // 11: 7ma mayor
];

const noteNames = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

const stringTunings = [
  { name: "E", midi: 64, index: 1 },
  { name: "B", midi: 59, index: 2 },
  { name: "G", midi: 55, index: 3 },
  { name: "D", midi: 50, index: 4 },
  { name: "A", midi: 45, index: 5 },
  { name: "E", midi: 40, index: 6 },
];

const PENTATONIC_BOXES_DATA = [
  {
    id: "box1",
    name: "Caja 1 - Forma de Mi (Posición Base)",
    fretOffsetRange: [0, 3],
    bridgeNotes: [
      { stringIdx: 5, fretRel: 3 },
      { stringIdx: 0, fretRel: 3 },
    ],
  },
  {
    id: "box2",
    name: "Caja 2 - Forma de Re",
    fretOffsetRange: [2, 5],
    bridgeNotes: [
      { stringIdx: 4, fretRel: 5 },
      { stringIdx: 1, fretRel: 5 },
    ],
  },
  {
    id: "box3",
    name: "Caja 3 - Forma de Do",
    fretOffsetRange: [4, 8],
    bridgeNotes: [
      { stringIdx: 3, fretRel: 7 },
      { stringIdx: 2, fretRel: 7 },
    ],
  },
  {
    id: "box4",
    name: "Caja 4 - Forma de La",
    fretOffsetRange: [7, 10],
    bridgeNotes: [
      { stringIdx: 5, fretRel: 10 },
      { stringIdx: 0, fretRel: 10 },
    ],
  },
  {
    id: "box5",
    name: "Caja 5 - Forma de Sol",
    fretOffsetRange: [9, 12],
    bridgeNotes: [
      { stringIdx: 4, fretRel: 12 },
      { stringIdx: 1, fretRel: 12 },
    ],
  },
];

const database = {
  major: {
    name: "Escala Mayor (Jónica)",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    type: "heptatonic",
    formulas: ["1", "2", "3", "4", "5", "6", "7"],
    desc: "La escala reina de la música occidental. Transmite alegría, brillo, resolución y estabilidad. Al no tener tensiones alteradas, es ideal para melodías triunfales, himnos y el pilar fundamental de la armonía tonal.",
    solo_title: '"Let It Be" - The Beatles (George Harrison)',
    solo_desc:
      "Un solo sumamente melódico y cantarín que aprovecha la perfecta consonancia y estabilidad de la escala mayor para crear frases memorables.",
  },
  minor: {
    name: "Menor Natural (Eólica)",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    type: "heptatonic",
    formulas: ["1", "2", "b3", "4", "5", "b6", "b7"],
    desc: "Evoca melancolía, introspección, drama profundo y misterio. Muy común en baladas tristes, rock progresivo, metal y música clásica. Su tercera menor define su sonido oscuro pero sumamente emotivo.",
    solo_title: '"All Along the Watchtower" - Jimi Hendrix',
    solo_desc:
      "Hendrix saca a relucir toda la potencia emocional de la escala menor en este solo histórico, variando intensidades y sosteniendo bendings desgarradores.",
  },
  pentatonic_major: {
    name: "Pentatónica Mayor",
    intervals: [0, 2, 4, 7, 9],
    type: "pentatonic",
    formulas: ["1", "2", "3", "5", "6"],
    desc: "Una escala ultra fluida de 5 notas que elimina las distancias de semitono (evitando intervalos de tensión como el tritono). Suena sumamente dulce, campestre (estilo Country) y relajada.",
    solo_title: '"Jessica" - The Allman Brothers Band (Dickey Betts)',
    solo_desc:
      "Un solo con un tono campestre y alegre impecable. Muestra cómo la pentatónica mayor puede sostener una canción instrumental entera transmitiendo absoluta libertad.",
  },
  pentatonic_minor: {
    name: "Pentatónica Menor",
    intervals: [0, 3, 5, 7, 10],
    type: "pentatonic",
    formulas: ["1", "b3", "4", "5", "b7"],
    desc: "La reina absoluta del Rock, Blues, Hard Rock y Metal. Ofrece un fraseo directo, agresivo y extremadamente cómodo en la guitarra debido a su simetría de '2 notas por cuerda'. Casi imposible tocar una nota equivocada.",
    solo_title: '"Stairway to Heaven" - Led Zeppelin (Jimmy Page)',
    solo_desc:
      "La obra maestra de Jimmy Page. Un solo legendario construido casi en su totalidad sobre el primer patrón de la pentatónica menor, demostrando que con 5 notas se puede hacer historia.",
  },
  blues: {
    name: "Escala de Blues (con b5)",
    intervals: [0, 3, 5, 6, 7, 10],
    type: "blues",
    formulas: ["1", "b3", "4", "b5", "5", "b7"],
    desc: "Es la pentatónica menor modificada con el añadido de la 'blue note' (la quinta disminuida, b5). Aporta una tensión cruda, sucia, áspera y una expresividad inigualable para el blues clásico.",
    solo_title: '"Texas Flood" - Stevie Ray Vaughan',
    solo_desc:
      "El dominio absoluto de la nota de blues. Stevie estira y arrastra la b5 para dotar a su guitarra de un llanto desgarrador, creando un sonido cargado de sudor y emoción tejana.",
  },
  dorian: {
    name: "Modo Dórico",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    type: "heptatonic",
    formulas: ["1", "2", "b3", "4", "5", "6", "b7"],
    desc: "Una escala menor pero con una sexta mayor brillante. Esto le quita la melancolía pesada a la escala menor y le otorga un aire de misterio elegante, sofisticado y bailable.",
    solo_title: '"Oye Como Va" - Santana (Carlos Santana)',
    solo_desc:
      "Carlos Santana es el embajador indiscutible del Modo Dórico. Usa la sexta mayor de forma repetitiva para lograr ese sonido misterioso, latino e increíblemente fluido.",
  },
  phrygian: {
    name: "Modo Phrygio (Frigio)",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    type: "heptatonic",
    formulas: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    desc: "Una escala muy oscura caracterizada por su segunda menor descendente (b2). Evoca sonidos flamencos, árabes o atmósferas de metal pesado muy densas y amenazantes.",
    solo_title: '"Wherever I May Roam" - Metallica (Kirk Hammett)',
    solo_desc:
      "Kirk utiliza la tensión exótica de la segunda menor en los riffs y frases principales para simular un viaje místico e inquietante.",
  },
  lydian: {
    name: "Modo Lidio",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    type: "heptatonic",
    formulas: ["1", "2", "3", "#4", "5", "6", "7"],
    desc: "La escala más brillante posible. Su cuarta aumentada (#4) rompe la estabilidad natural y crea un sonido flotante, celestial, futurista y mágico.",
    solo_title: '"Flying in a Blue Dream" - Joe Satriani',
    solo_desc:
      "Satriani explota la magia mística de la cuarta aumentada sobre acordes móviles para darnos la sensación literal de estar volando o flotando en el espacio.",
  },
  mixolydian: {
    name: "Modo Mixolidio",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    type: "heptatonic",
    formulas: ["1", "2", "3", "4", "5", "6", "b7"],
    desc: "Es una escala mayor pero con una séptima menor (b7). Tiene una actitud sumamente fiestera, rockera y relajada. Ideal para improvisar sobre acordes dominantes.",
    solo_title: "\"Sweet Child O' Mine\" - Guns N' Roses (Slash)",
    solo_desc:
      "El solo principal de esta mítica canción utiliza la escala mayor combinada con el sabor Mixolidio, logrando un tono que suena inmensamente épcio y optimista.",
  },
  locrian: {
    name: "Modo Locrio",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    type: "heptatonic",
    formulas: ["1", "b2", "b3", "4", "b5", "b6", "b7"],
    desc: "La escala más inestable y tensa. Su quinta disminuida (b5) provoca que el acorde tónico sea disminuido, eliminando cualquier sensación de reposo. Suena caótica y conflictiva.",
    solo_title: '"Sad But True" - Metallica (Riffs principales)',
    solo_desc:
      "James Hetfield y Kirk Hammett estructuran la tensión aplastante del riff principal basándose en las notas del modo locrio para transmitir una sensación de peligro absoluto.",
  },
  arp_major: {
    name: "Arpegio Mayor Tríada",
    intervals: [0, 4, 7],
    type: "arp_triad",
    formulas: ["1", "3", "5"],
    desc: "Dibuja perfectamente el contorno armónico de un acorde mayor. Sólido, heroico e indiscutiblemente estable.",
    solo_title: '"Hotel California" - Eagles',
    solo_desc:
      "El duelo final de guitarras se basa en arpegios entrelazados que definen con absoluta elegancia el cambio armónico de cada acorde de la progresión.",
  },
  arp_minor: {
    name: "Arpegio Menor Tríada",
    intervals: [0, 3, 7],
    type: "arp_triad",
    formulas: ["1", "b3", "5"],
    desc: "El esqueleto fundamental de la melancolía armónica. Dibuja un acorde menor de forma directa y elegante.",
    solo_title: '"Sultans of Swing" - Dire Straits',
    solo_desc:
      "Mark Knopfler corona el solo de salida con arpegios menores de Re menor barriendo las cuerdas rápidamente con los dedos.",
  },
  arp_maj7: {
    name: "Arpegio Maj7",
    intervals: [0, 4, 7, 11],
    type: "arp_seventh",
    formulas: ["1", "3", "5", "7"],
    desc: "Un sonido sofisticado, jazzero, nostálgico pero sumamente cálido. Añade la séptima mayor para un toque elegante.",
    solo_title: '"Under the Bridge" - Red Hot Chili Peppers',
    solo_desc:
      "John Frusciante utiliza hermosos adornos arpegiados de séptima mayor en las transiciones de acordes para darles un toque dulce.",
  },
  arp_dom7: {
    name: "Arpegio Dominante (Dom7)",
    intervals: [0, 4, 7, 10],
    type: "arp_seventh",
    formulas: ["1", "3", "5", "b7"],
    desc: "El sonido de la tensión que busca resolver. Imprescindible en el Blues, Funk y Jazz.",
    solo_title: '"Pride and Joy" - Stevie Ray Vaughan',
    solo_desc:
      "Vaughan usa arpegios dominantes de paso rápido sobre el mástil para marcar con firmeza el cambio hacia el acorde de paso dominante.",
  },
};

const intervalNames = [
  "Unísono / Tónica",
  "Segunda Menor",
  "Segunda Mayor",
  "Tercera Menor",
  "Tercera Mayor",
  "Cuarta Justa",
  "Quinta Disminuida (b5)",
  "Quinta Justa",
  "Sexta Menor",
  "Sexta Mayor",
  "Séptima Menor",
  "Séptima Mayor",
  "Octava",
];

const shorthandIntervals = [
  "1",
  "b2",
  "2",
  "b3",
  "3",
  "4",
  "b5",
  "5",
  "b6",
  "6",
  "b7",
  "7",
];

/* eslint-disable react-hooks/purity */
const getInitialState = () => {
  if (typeof window === "undefined") return {};

  try {
    const saved = window.localStorage.getItem(
      "guitar_trainer_master_react_v6_reborn",
    );
    if (!saved) return {};

    return JSON.parse(saved);
  } catch (e) {
    console.warn("No se pudo cargar el estado desde localStorage:", e);
    return {};
  }
};

export default function App() {
  const persistedState = getInitialState();

  // Estado General del Sistema
  const [currentTab, setCurrentTab] = useState("scale-config");
  const [currentRootNote, setCurrentRootNote] = useState(
    persistedState.currentRootNote ?? 0,
  );
  const [currentScaleType, setCurrentScaleType] = useState(
    persistedState.currentScaleType ?? "major",
  );
  const [isStringsInverted, setIsStringsInverted] = useState(
    persistedState.isStringsInverted ?? false,
  );
  const [gameMode, setGameMode] = useState(persistedState.gameMode ?? "free");
  const [freeRevealActive, setFreeRevealActive] = useState(false);
  const [labelMode, setLabelMode] = useState(persistedState.labelMode ?? "names");
  const [isCompactActive, setIsCompactActive] = useState(
    persistedState.isCompactActive ?? false,
  );

  // Gamificación & Puntuación
  const [totalScore, setTotalScore] = useState(persistedState.totalScore ?? 0);
  const [currentStreak, setCurrentStreak] = useState(
    persistedState.currentStreak ?? 0,
  );

  // Modos de Práctica Específicos
  const [intervalDifficultyMode, setIntervalDifficultyMode] = useState(
    persistedState.intervalDifficultyMode ?? "standard",
  );
  const [remainingReplays, setRemainingReplays] = useState(2);
  const [activeCagedBoxIndex, setActiveCagedBoxIndex] = useState(0);
  const [cagedSuccessfulNotes, setCagedSuccessfulNotes] = useState(0);

  // Estados de Desafío Activo (Challenge State)
  const [challengeState, setChallengeState] = useState({
    targetInterval: null,
    targetMidi: null,
    intervalBaseMidi: null,
    selectedGuess: null,
    foundLocations: [], // { midi, fret, stringMidi }
    unlockedScaleNotes: {}, // clave: "stringMidi-fret" -> true
    coverageMap: { 40: [], 45: [], 50: [], 55: [], 59: [], 64: [] },
    activeBoxCoords: [],
    targetBridgeNote: null,
  });

  // Estadísticas de Rendimiento (LocalStorage)
  const [performanceStats, setPerformanceStats] = useState(
    persistedState.performanceStats ?? {
      interval_trainer: { correct: 0, incorrect: 0, failedItems: {} },
      scale_builder: { correct: 0, incorrect: 0, failedItems: {} },
      find_note: { correct: 0, incorrect: 0, failedItems: {} },
      caged_connector: { correct: 0, incorrect: 0, failedItems: {} },
    },
  );

  // Audio, Micrófono, Afinador e Instrumento Real
  const [audioActive, setAudioActive] = useState(false);
  const [synthTimbre, setSynthTimbre] = useState(
    persistedState.synthTimbre ?? "synth_guitar",
  );
  const [activeVibrationString, setActiveVibrationString] = useState(null);
  const [activePlaybackNoteKey, setActivePlaybackNoteKey] = useState(null);
  const [mainVolume, setMainVolume] = useState(persistedState.mainVolume ?? 0.6);
  const [micActive, setMicActive] = useState(false);
  const [tunerNote, setTunerNote] = useState("--");
  const [tunerCents, setTunerCents] = useState("0c");
  const [tunerPointerOffset, setTunerPointerOffset] = useState(50);
  const [rmsDb, setRmsDb] = useState("-inf");
  const [realGuitarLoaded, setRealGuitarLoaded] = useState(false);
  const [realGuitarLoading, setRealGuitarLoading] = useState(false);

  // Toasts y UI Modals / Drawers
  const [toasts, setToasts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState(false);
  const [isPracticeInfoModalOpen, setIsPracticeInfoModalOpen] = useState(false);
  const [isAiSidebarCollapsed, setIsAiSidebarCollapsed] = useState(false);

  // Conversación con IA
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "Guitar AI",
      text: "¡Hola! He sincronizado tus estadísticas de localStorage para guiarte. Pregúntame sobre teoría musical o pulsa 'Analizar Mis Dificultades' para darte un reporte detallado.",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [aiApiKey, setAiApiKey] = useState("");

  // Referencias Estables
  const audioCtxRef = useRef(null);
  const analyserNodeRef = useRef(null);
  const micStreamRef = useRef(null);
  const pitchLoopRef = useRef(null);
  const activeStringVoicesRef = useRef([null, null, null, null, null, null]);
  const canvasRef = useRef(null);
  const realGuitarInstRef = useRef(null);
  const vibrationTimerRef = useRef(null);
  const playbackHighlightTimerRef = useRef(null);

  // Búferes de Afinador
  const dataArrayRef = useRef(new Float32Array(2048));
  const correlationsBufferRef = useRef(new Float32Array(2048));
  const lastAnalysisTimeRef = useRef(0);
  const lastDetectedMidiRef = useRef(null);
  const debounceCounterRef = useRef(0);

  const triggerStringVibration = (stringIdx) => {
    setActiveVibrationString(stringIdx);

    if (vibrationTimerRef.current) {
      clearTimeout(vibrationTimerRef.current);
    }

    vibrationTimerRef.current = setTimeout(() => {
      setActiveVibrationString(null);
    }, 180);
  };

  const highlightPlaybackNote = (noteKey, duration = 800) => {
    setActivePlaybackNoteKey(noteKey);

    if (playbackHighlightTimerRef.current) {
      clearTimeout(playbackHighlightTimerRef.current);
    }

    playbackHighlightTimerRef.current = setTimeout(() => {
      setActivePlaybackNoteKey(null);
    }, duration);
  };

  const saveState = (updatedFields = {}) => {
    try {
      const currentState = {
        currentRootNote,
        currentScaleType,
        isStringsInverted,
        gameMode,
        labelMode,
        totalScore,
        currentStreak,
        intervalDifficultyMode,
        performanceStats,
        mainVolume,
        synthTimbre,
        isCompactActive,
        ...updatedFields,
      };
      localStorage.setItem(
        "guitar_trainer_master_react_v6_reborn",
        JSON.stringify(currentState),
      );
    } catch (e) {
      console.warn("Error escribiendo en localStorage:", e);
    }
  };

  const getScaleNotesString = () => {
    const scale = database[currentScaleType];
    if (!scale) return "";
    const noteSequence = scale.intervals.map(
      (val) => noteNames[(currentRootNote + val) % 12],
    );
    return noteSequence.join(" - ");
  };

  const getScaleIntervalsString = () => {
    const scale = database[currentScaleType];
    if (!scale) return "";
    const intervalSequence = scale.intervals.map(
      (val) => shorthandIntervals[val],
    );
    return intervalSequence.join(" - ");
  };

  const showToast = (message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const initAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (
        window.AudioContext || window.webkitAudioContext
      )();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
    setAudioActive(true);

    // Iniciar carga de sonido si es guitarra real
    if (
      synthTimbre === "real_guitar" &&
      !realGuitarLoaded &&
      !realGuitarLoading
    ) {
      loadRealGuitarSamples();
    }
  };

  const loadRealGuitarSamples = () => {
    if (realGuitarLoading || realGuitarLoaded) return;
    setRealGuitarLoading(true);
    showToast(
      "Descargando muestras de guitarra real... espera un momento.",
      "info",
    );

    // Cargamos soundfont-player dinámicamente si no está en window
    const loadPlayer = () => {
      if (window.Soundfont) {
        window.Soundfont.instrument(
          audioCtxRef.current,
          "acoustic_guitar_steel",
          {
            soundfont: "FluidR3_GM",
          },
        )
          .then((guitar) => {
            realGuitarInstRef.current = guitar;
            setRealGuitarLoaded(true);
            setRealGuitarLoading(false);
            showToast(
              "Muestras de Guitarra Real cargadas con éxito.",
              "success",
            );
          })
          .catch((err) => {
            console.error(err);
            setRealGuitarLoading(false);
            setSynthTimbre("synth_guitar");
            showToast(
              "Error descargando muestras. Usando sintetizador.",
              "error",
            );
          });
      } else {
        const script = document.createElement("script");
        script.src =
          "https://unpkg.com/soundfont-player@0.12.0/dist/soundfont-player.min.js";
        script.onload = () => {
          loadPlayer();
        };
        script.onerror = () => {
          setRealGuitarLoading(false);
          setSynthTimbre("synth_guitar");
          showToast("No se pudo cargar Soundfont Player.", "error");
        };
        document.body.appendChild(script);
      }
    };

    loadPlayer();
  };

  const midiToFreq = (midi) => {
    return 440 * Math.pow(2, (midi - 69) / 12);
  };

  const chokeStringVoice = (stringIdx, fadeTime = 0.08) => {
    const activeVoice = activeStringVoicesRef.current[stringIdx];
    if (activeVoice) {
      const now = audioCtxRef.current.currentTime;
      if (activeVoice.stop && typeof activeVoice.stop === "function") {
        try {
          activeVoice.stop(now + fadeTime);
        } catch (e) {
          console.warn("No se pudo detener la voz activa del string:", e);
        }
      } else if (activeVoice.gainNode) {
        try {
          const gain = activeVoice.gainNode.gain;
          gain.cancelScheduledValues(now);
          gain.setValueAtTime(gain.value, now);
          gain.exponentialRampToValueAtTime(0.001, now + fadeTime);
          activeVoice.oscs.forEach((osc) => {
            try {
              osc.stop(now + fadeTime + 0.02);
            } catch (e) {
              console.warn("No se pudo detener un oscilador del string:", e);
            }
          });
        } catch (e) {
          console.warn("No se pudo detener la voz con gainNode:", e);
        }
      }
      activeStringVoicesRef.current[stringIdx] = null;
    }
  };

  const triggerSynth = (
    frequency,
    duration = 1.5,
    stringIdx = null,
    midiNumber = null,
  ) => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;

    if (stringIdx !== null && stringIdx >= 0 && stringIdx < 6) {
      chokeStringVoice(stringIdx, 0.08);
    }

    // Caso Guitarra Real
    if (
      synthTimbre === "real_guitar" &&
      realGuitarLoaded &&
      realGuitarInstRef.current &&
      midiNumber !== null
    ) {
      try {
        const notePlayer = realGuitarInstRef.current.play(midiNumber, now, {
          duration: duration,
          gain: mainVolume * 1.5,
        });
        if (stringIdx !== null && stringIdx >= 0 && stringIdx < 6) {
          activeStringVoicesRef.current[stringIdx] = notePlayer;
        }
        return;
      } catch (e) {
        console.warn("Fallo en sonido real, aplicando fallback sintético", e);
      }
    }

    const gainNode = audioCtxRef.current.createGain();
    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(mainVolume * 0.7, now + 0.015);

    const lowpass = audioCtxRef.current.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(
      synthTimbre === "flat_triangle" ? 1000 : 1200,
      now,
    );

    let osc1, osc2;

    if (synthTimbre === "flat_triangle") {
      osc1 = audioCtxRef.current.createOscillator();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(frequency, now);

      osc1.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);

      osc1.start(now);
      gainNode.gain.setValueAtTime(mainVolume * 0.7, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      osc1.stop(now + duration + 0.1);

      if (stringIdx !== null && stringIdx >= 0 && stringIdx < 6) {
        activeStringVoicesRef.current[stringIdx] = {
          gainNode: gainNode,
          oscs: [osc1],
        };
      }
    } else {
      osc1 = audioCtxRef.current.createOscillator();
      osc2 = audioCtxRef.current.createOscillator();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(frequency, now);

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(frequency * 1.003, now);

      lowpass.frequency.exponentialRampToValueAtTime(80, now + duration);

      osc1.connect(lowpass);
      osc2.connect(lowpass);
      lowpass.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);

      osc1.start(now);
      osc2.start(now);

      gainNode.gain.setValueAtTime(mainVolume * 0.7, now + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.stop(now + duration + 0.1);
      osc2.stop(now + duration + 0.1);

      if (stringIdx !== null && stringIdx >= 0 && stringIdx < 6) {
        activeStringVoicesRef.current[stringIdx] = {
          gainNode: gainNode,
          oscs: [osc1, osc2],
        };
      }
    }
  };

  const playNotificationSound = (isSuccess) => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const gain = audioCtxRef.current.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.connect(audioCtxRef.current.destination);

    const osc = audioCtxRef.current.createOscillator();
    osc.connect(gain);

    if (isSuccess) {
      osc.type = "sine";
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      osc.type = "triangle";
      osc.frequency.setValueAtTime(180, now);
      osc.start(now);
      osc.stop(now + 0.25);
    }
    osc.onended = () => {
      osc.disconnect();
      gain.disconnect();
    };
  };

  const playVictorySound = () => {
    if (!audioCtxRef.current) return;
    const now = audioCtxRef.current.currentTime;
    const victoryNotes = [
      261.63, 329.63, 392.0, 493.88, 523.25, 659.25, 783.99, 1046.5,
    ];

    victoryNotes.forEach((freq, idx) => {
      const noteTime = now + idx * 0.12;
      const osc = audioCtxRef.current.createOscillator();
      const gain = audioCtxRef.current.createGain();

      osc.type = idx % 2 === 0 ? "sine" : "triangle";
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0, noteTime);
      gain.gain.linearRampToValueAtTime(mainVolume * 0.25, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 1.0);

      osc.connect(gain);
      gain.connect(audioCtxRef.current.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 1.1);
    });
  };

  const toggleAudioInput = async () => {
    if (micActive) {
      stopAudioInput();
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });
      initAudioContext();
      micStreamRef.current = stream;

      const sourceNode = audioCtxRef.current.createMediaStreamSource(stream);
      const lowpass = audioCtxRef.current.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(600, audioCtxRef.current.currentTime);

      const inputGain = audioCtxRef.current.createGain();
      inputGain.gain.setValueAtTime(3.0, audioCtxRef.current.currentTime);

      analyserNodeRef.current = audioCtxRef.current.createAnalyser();
      analyserNodeRef.current.fftSize = 2048;
      analyserNodeRef.current.smoothingTimeConstant = 0.35;

      sourceNode.connect(lowpass);
      lowpass.connect(inputGain);
      inputGain.connect(analyserNodeRef.current);

      setMicActive(true);
      showToast("Micrófono activo. Toca tu guitarra.", "success");

      pitchLoopRef.current = requestAnimationFrame(processPitchAnalysis);
    } catch (err) {
      console.error(err);
      showToast("No se pudo acceder al micrófono.", "error");
    }
  };

  const stopAudioInput = () => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (pitchLoopRef.current) {
      cancelAnimationFrame(pitchLoopRef.current);
    }
    setMicActive(false);
    setTunerNote("--");
    setTunerCents("0c");
    setTunerPointerOffset(50);
    showToast("Micrófono desactivado.", "info");
  };

  const autoCorrelate = (buffer, sampleRate) => {
    const SIZE = buffer.length;
    let totalVolume = 0;

    for (let i = 0; i < SIZE; i++) {
      const val = buffer[i];
      totalVolume += val * val;
    }
    const rms = Math.sqrt(totalVolume / SIZE);
    if (rms < 0.005) return -1;

    let r1 = 0;
    let r2 = SIZE - 1;
    const thres = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < thres) {
        r1 = i;
        break;
      }
    }
    for (let i = SIZE - 1; i >= SIZE / 2; i--) {
      if (Math.abs(buffer[i]) < thres) {
        r2 = i;
        break;
      }
    }

    const length = r2 - r1;
    if (length < 64) return -1;

    const minLag = Math.floor(sampleRate / 900);
    const maxLag = Math.min(length, Math.floor(sampleRate / 75));

    correlationsBufferRef.current.fill(0);

    for (let i = minLag; i < maxLag; i++) {
      let sum = 0;
      const limit = length - i;
      for (let j = 0; j < limit; j++) {
        sum += buffer[r1 + j] * buffer[r1 + j + i];
      }
      correlationsBufferRef.current[i] = sum;
    }

    let maxval = -1;
    let maxpos = -1;
    for (let i = minLag; i < maxLag; i++) {
      if (correlationsBufferRef.current[i] > maxval) {
        maxval = correlationsBufferRef.current[i];
        maxpos = i;
      }
    }

    let T0 = maxpos;
    if (T0 > minLag && T0 < maxLag - 1) {
      const x1 = correlationsBufferRef.current[T0 - 1];
      const x2 = correlationsBufferRef.current[T0];
      const x3 = correlationsBufferRef.current[T0 + 1];
      const a = (x1 + x3 - 2 * x2) / 2;
      const b = (x3 - x1) / 2;
      if (a) T0 = T0 - b / (2 * a);
    }

    return sampleRate / T0;
  };

  const processPitchAnalysis = (currentTime) => {
    if (!analyserNodeRef.current) return;

    pitchLoopRef.current = requestAnimationFrame(processPitchAnalysis);

    const timestamp = currentTime || performance.now();
    if (timestamp - lastAnalysisTimeRef.current < 1000 / 30) {
      return;
    }
    lastAnalysisTimeRef.current = timestamp;

    const buffer = dataArrayRef.current;
    analyserNodeRef.current.getFloatTimeDomainData(buffer);

    let sum = 0;
    const len = buffer.length;
    for (let i = 0; i < len; i++) {
      sum += buffer[i] * buffer[i];
    }
    const rms = Math.sqrt(sum / len);
    setRmsDb(rms > 0 ? (20 * Math.log10(rms)).toFixed(1) : "-inf");

    drawWaveform(buffer);

    if (rms > 0.003) {
      const pitch = autoCorrelate(buffer, audioCtxRef.current.sampleRate);
      if (pitch !== -1 && pitch > 75 && pitch < 900) {
        const midiVal = 12 * (Math.log(pitch / 440) / Math.log(2)) + 69;
        const roundedMidi = Math.round(midiVal);
        const cents = Math.floor((midiVal - roundedMidi) * 100);

        setTunerNote(noteNames[roundedMidi % 12]);
        setTunerCents(cents >= 0 ? `+${cents}c` : `${cents}c`);
        setTunerPointerOffset(50 + cents / 2);

        if (Math.abs(cents) < 15) {
          evaluateInputLine(roundedMidi);
        }
      }
    } else {
      setTunerNote("--");
      setTunerCents("0c");
      setTunerPointerOffset(50);
    }
  };

  const drawWaveform = (buffer) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#09090b";
    ctx.fillRect(0, 0, w, h);

    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "#f43f5e";
    ctx.beginPath();

    const sliceWidth = w / buffer.length;
    let x = 0;

    for (let i = 0; i < buffer.length; i += 4) {
      const v = buffer[i] * 3;
      const y = (v * h) / 2 + h / 2;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
      x += sliceWidth * 4;
    }
    ctx.lineTo(w, h / 2);
    ctx.stroke();
  };

  const evaluateInputLine = (midi) => {
    if (midi === lastDetectedMidiRef.current) {
      debounceCounterRef.current++;
    } else {
      debounceCounterRef.current = 0;
      lastDetectedMidiRef.current = midi;
    }

    if (debounceCounterRef.current === 4) {
      let cagedLimits = null;
      if (gameMode === "caged_connector") {
        cagedLimits = getFretLimitsForActiveCagedBox();
      }

      stringTunings.forEach((stringObj) => {
        const fret = midi - stringObj.midi;
        if (fret >= 0 && fret <= 12) {
          if (gameMode === "caged_connector") {
            if (
              cagedLimits &&
              fret >= cagedLimits.min &&
              fret <= cagedLimits.max
            ) {
              handleInputNoteMatch(midi, fret, stringObj.midi);
            }
          } else {
            handleInputNoteMatch(midi, fret, stringObj.midi);
          }
        }
      });
    }
  };

  useEffect(() => {
    return () => {
      if (vibrationTimerRef.current) {
        clearTimeout(vibrationTimerRef.current);
      }
      if (playbackHighlightTimerRef.current) {
        clearTimeout(playbackHighlightTimerRef.current);
      }
      if (pitchLoopRef.current) cancelAnimationFrame(pitchLoopRef.current);
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const updateScore = (isCorrect) => {
    const modeMultipliers = {
      free: 1,
      interval_trainer: intervalDifficultyMode === "advanced" ? 3.5 : 1.5,
      scale_builder: 2.0,
      find_note: 1.2,
      caged_connector: 2.5,
    };

    const multiplier = modeMultipliers[gameMode] || 1.0;

    if (isCorrect) {
      const isAdvanced =
        gameMode === "interval_trainer" &&
        intervalDifficultyMode === "advanced";
      const addedStreak = isAdvanced ? 2 : 1;
      const newStreak = currentStreak + addedStreak;
      setCurrentStreak(newStreak);

      let streakMultiplier = 1.0;
      if (newStreak >= 10) streakMultiplier = 3.0;
      else if (newStreak >= 5) streakMultiplier = 2.0;

      const basePoints = isAdvanced ? 30 : 10;
      const pointsEarned = Math.round(
        basePoints * multiplier * streakMultiplier,
      );

      setTotalScore((prev) => prev + pointsEarned);
      showToast(
        `+${pointsEarned} Puntos! (Combo: x${streakMultiplier})`,
        "success",
      );
    } else {
      setCurrentStreak(0);
      const pointsLost =
        gameMode === "interval_trainer" && intervalDifficultyMode === "advanced"
          ? 15
          : 5;
      setTotalScore((prev) => Math.max(0, prev - pointsLost));
      showToast(`-${pointsLost} Puntos. ¡Prueba otra vez!`, "error");
    }
    saveState();
  };
function getFretLimitsForActiveCagedBox(boxIndex = activeCagedBoxIndex) {
  const normalizedBoxIndex =
    (boxIndex % PENTATONIC_BOXES_DATA.length + PENTATONIC_BOXES_DATA.length) %
    PENTATONIC_BOXES_DATA.length;

  const baseRange = PENTATONIC_BOXES_DATA[normalizedBoxIndex]?.fretOffsetRange || [0, 3];
  const minFret = Math.max(0, Math.min(12, baseRange[0] - 1));
  const maxFret = Math.max(minFret, Math.min(12, baseRange[1] + 1));

  return {
    min: minFret,
    max: maxFret,
  };
}

  const handleInputNoteMatch = (midi, fret, stringMidi) => {
    const noteName = noteNames[midi % 12];
    const intervalFromRoot = (((midi - currentRootNote) % 12) + 12) % 12;
    const key = `${stringMidi}-${fret}`;

    if (gameMode === "free") {
      if (freeRevealActive) {
        setChallengeState((prev) => ({
          ...prev,
          unlockedScaleNotes: { ...prev.unlockedScaleNotes, [key]: true },
        }));
      }
    } else if (gameMode === "interval_trainer") {
      if (midi === challengeState.targetMidi) {
        playNotificationSound(true);
        registerResult("interval_trainer", true);
        updateScore(true);
        setChallengeState((prev) => ({
          ...prev,
          foundLocations: [...prev.foundLocations, { midi, fret, stringMidi }],
        }));
        setTimeout(() => {
          startTrainerRound(gameMode);
        }, 2500);
      } else {
        registerResult(
          "interval_trainer",
          false,
          intervalNames[challengeState.targetInterval],
        );
        updateScore(false);
      }
    } else if (gameMode === "scale_builder") {
      const activeScale = database[currentScaleType];
      if (activeScale.intervals.includes(intervalFromRoot)) {
        if (!challengeState.unlockedScaleNotes[key]) {
          const updatedUnlocked = {
            ...challengeState.unlockedScaleNotes,
            [key]: true,
          };
          const currentStringCoverage = [
            ...(challengeState.coverageMap[stringMidi] || []),
          ];
          if (!currentStringCoverage.includes(fret)) {
            currentStringCoverage.push(fret);
          }

          const updatedCoverageMap = {
            ...challengeState.coverageMap,
            [stringMidi]: currentStringCoverage,
          };

          setChallengeState((prev) => ({
            ...prev,
            unlockedScaleNotes: updatedUnlocked,
            coverageMap: updatedCoverageMap,
          }));

          registerResult("scale_builder", true);
          updateScore(true);
          evaluateScaleBuilderSuccess(updatedCoverageMap);
        }
      } else {
        registerResult("scale_builder", false, noteName);
        updateScore(false);
      }
    } else if (gameMode === "find_note") {
      const targetName = intervalNames[challengeState.targetInterval];
      if (intervalFromRoot === challengeState.targetInterval) {
        const exists = challengeState.foundLocations.some(
          (loc) => loc.stringMidi === stringMidi && loc.fret === fret,
        );
        if (!exists) {
          const updatedLocations = [
            ...challengeState.foundLocations,
            { midi, fret, stringMidi },
          ];
          setChallengeState((prev) => ({
            ...prev,
            foundLocations: updatedLocations,
          }));
          registerResult("find_note", true);
          updateScore(true);

          if (updatedLocations.length >= 3) {
            playNotificationSound(true);
            showToast(
              "¡Genial! Conseguiste localizar el intervalo en 3 zonas del diapasón.",
              "success",
            );
            setTimeout(() => {
              startTrainerRound(gameMode);
            }, 3000);
          }
        } else {
          showToast("Ya ingresaste esta posición física de la nota.", "info");
        }
      } else {
        registerResult("find_note", false, targetName);
        updateScore(false);
      }
    } else if (gameMode === "caged_connector") {
      const activeScale = database["pentatonic_minor"];
      const cagedLimits = getFretLimitsForActiveCagedBox(activeCagedBoxIndex);

      // Validación de Nota Puente
      if (
        challengeState.targetBridgeNote &&
        challengeState.targetBridgeNote.midi === midi &&
        challengeState.targetBridgeNote.fret === fret
      ) {
        playNotificationSound(true);
        setTotalScore((prev) => prev + 50);
        setCurrentStreak((prev) => prev + 1);
        showToast(
          "¡CONEXIÓN DE CAJA EXITOSA! Pasando al siguiente patrón geométrico.",
          "success",
        );

        const nextBoxIdx =
          (activeCagedBoxIndex + 1) % PENTATONIC_BOXES_DATA.length;
        setActiveCagedBoxIndex(nextBoxIdx);
        setCagedSuccessfulNotes(0);

        calculateActiveBoxCoordinates(nextBoxIdx);
        return;
      }

      if (
        activeScale.intervals.includes(intervalFromRoot) &&
        fret >= cagedLimits.min &&
        fret <= cagedLimits.max
      ) {
        if (!challengeState.unlockedScaleNotes[key]) {
          const updatedUnlocked = {
            ...challengeState.unlockedScaleNotes,
            [key]: true,
          };
          const notesFound = cagedSuccessfulNotes + 1;
          setCagedSuccessfulNotes(notesFound);

          setChallengeState((prev) => ({
            ...prev,
            unlockedScaleNotes: updatedUnlocked,
          }));

          playNotificationSound(true);
          registerResult("caged_connector", true);
          updateScore(true);

          const totalToFind = challengeState.activeBoxCoords.length;
          if (notesFound >= totalToFind) {
            advanceToNextCagedBox(activeCagedBoxIndex, updatedUnlocked);
            showToast(
              "¡Caja completada! Se conservaron solo las notas compartidas con la siguiente posición.",
              "success",
            );
          }
        } else {
          showToast("Nota ya descubierta en este traste destacado.", "info");
        }
      } else {
        registerResult(
          "caged_connector",
          false,
          PENTATONIC_BOXES_DATA[activeCagedBoxIndex].name,
        );
        updateScore(false);
      }
    }
  };

  const registerResult = (mode, isCorrect, itemKey) => {
    setPerformanceStats((prev) => {
      const modeData = prev[mode] || {
        correct: 0,
        incorrect: 0,
        failedItems: {},
      };
      const updatedFailed = { ...modeData.failedItems };
      if (!isCorrect && itemKey) {
        updatedFailed[itemKey] = (updatedFailed[itemKey] || 0) + 1;
      }
      return {
        ...prev,
        [mode]: {
          correct: modeData.correct + (isCorrect ? 1 : 0),
          incorrect: modeData.incorrect + (isCorrect ? 0 : 1),
          failedItems: updatedFailed,
        },
      };
    });
    saveState();
  };

  const evaluateScaleBuilderSuccess = (coverage) => {
    const scale = database[currentScaleType];
    if (scale.type.startsWith("arp")) {
      let totalFound = 0;
      Object.values(coverage).forEach((arr) => {
        totalFound += arr.length;
      });
      const targetNeeded = scale.type === "arp_seventh" ? 4 : 3;
      if (totalFound >= targetNeeded) {
        onScaleBuilderSuccess();
      }
    } else {
      const requiredPerString =
        scale.type === "pentatonic" || scale.type === "blues" ? 2 : 3;
      let stringsSatisfied = 0;
      stringTunings.forEach((stringObj) => {
        const count = coverage[stringObj.midi]?.length || 0;
        if (count >= requiredPerString) stringsSatisfied++;
      });

      if (stringsSatisfied === 6) {
        onScaleBuilderSuccess();
      }
    }
  };

  const onScaleBuilderSuccess = () => {
    playVictorySound();
    setIsVictoryModalOpen(true);
  };

  const getCagedBoxCoordinates = (boxIndex = activeCagedBoxIndex) => {
    const limits = getFretLimitsForActiveCagedBox(boxIndex);
    const activeScale = database["pentatonic_minor"];
    const coords = [];

    stringTunings.forEach((stringObj, stringIdx) => {
      for (let fret = limits.min; fret <= limits.max; fret++) {
        const midi = stringObj.midi + fret;
        const interval = (((midi - currentRootNote) % 12) + 12) % 12;

        if (activeScale.intervals.includes(interval)) {
          coords.push({
            stringIdx,
            stringMidi: stringObj.midi,
            fret,
            midi,
            key: `${stringObj.midi}-${fret}`,
          });
        }
      }
    });

    return coords;
  };

  const calculateActiveBoxCoordinates = (boxIndex) => {
    const coords = getCagedBoxCoordinates(boxIndex);

    setChallengeState((prev) => ({
      ...prev,
      activeBoxCoords: coords,
      unlockedScaleNotes: {},
      targetBridgeNote: null,
    }));
  };

  const advanceToNextCagedBox = (
    boxIndex = activeCagedBoxIndex,
    discoveredNotes = {},
  ) => {
    const nextBoxIdx = (boxIndex + 1) % PENTATONIC_BOXES_DATA.length;
    const nextBoxCoords = getCagedBoxCoordinates(nextBoxIdx);
    const nextBoxKeys = new Set(nextBoxCoords.map((coord) => coord.key));

    const sharedUnlocked = Object.fromEntries(
      Object.keys(discoveredNotes)
        .filter((key) => nextBoxKeys.has(key))
        .map((key) => [key, true]),
    );

    setActiveCagedBoxIndex(nextBoxIdx);
    setCagedSuccessfulNotes(Object.keys(sharedUnlocked).length);

    setChallengeState((prev) => ({
      ...prev,
      activeBoxCoords: nextBoxCoords,
      unlockedScaleNotes: sharedUnlocked,
      targetBridgeNote: null,
    }));
  };

  const startTrainerRound = (mode) => {
    initAudioContext();
    setRemainingReplays(2);

    const freshChallengeState = {
      targetInterval: null,
      targetMidi: null,
      intervalBaseMidi: null,
      selectedGuess: null,
      foundLocations: [],
      unlockedScaleNotes: {},
      coverageMap: { 40: [], 45: [], 50: [], 55: [], 59: [], 64: [] },
      activeBoxCoords: [],
      targetBridgeNote: null,
    };

    if (mode === "interval_trainer") {
      const randomRoot = Math.floor(Math.random() * 12);
      setCurrentRootNote(randomRoot);

      const midisValidos = [40, 45, 50, 55, 59, 64];
      const baseMidi =
        midisValidos[Math.floor(Math.random() * midisValidos.length)];
      const randomInterval = Math.floor(Math.random() * 11) + 1;

      const targetMidi = baseMidi + randomInterval;

      setChallengeState({
        ...freshChallengeState,
        targetInterval: randomInterval,
        targetMidi: targetMidi,
        intervalBaseMidi: baseMidi,
      });

      setTimeout(() => {
        playTrainerIntervalSequence(baseMidi, targetMidi);
      }, 300);
    } else if (mode === "scale_builder") {
      const randomRoot = Math.floor(Math.random() * 12);
      setCurrentRootNote(randomRoot);

      const scaleKeys = Object.keys(database);
      const randomScaleKey =
        scaleKeys[Math.floor(Math.random() * scaleKeys.length)];
      setCurrentScaleType(randomScaleKey);

      setChallengeState(freshChallengeState);
      showToast(
        `Listo para construir: ${database[randomScaleKey].name}`,
        "info",
      );
    } else if (mode === "find_note") {
      let interval;
      do {
        interval = Math.floor(Math.random() * 12);
      } while (interval === 0);

      setChallengeState({
        ...freshChallengeState,
        targetInterval: interval,
      });
    } else if (mode === "caged_connector") {
      setCurrentRootNote(0); // Forzar tónica en C para CAGED clásico
      setActiveCagedBoxIndex(0);
      setCagedSuccessfulNotes(0);

      const limits = getFretLimitsForActiveCagedBox(0);
      const coords = [];
      const activeScale = database["pentatonic_minor"];

      stringTunings.forEach((stringObj, stringIdx) => {
        for (let fret = limits.min; fret <= limits.max; fret++) {
          const midi = stringObj.midi + fret;
          const interval = (((midi - 0) % 12) + 12) % 12; // Root 0
          if (activeScale.intervals.includes(interval)) {
            coords.push({
              stringIdx,
              stringMidi: stringObj.midi,
              fret,
              midi,
              key: `${stringObj.midi}-${fret}`,
            });
          }
        }
      });

      setChallengeState({
        ...freshChallengeState,
        activeBoxCoords: coords,
      });
    }
  };

  const playTrainerIntervalSequence = (baseMidi, targetMidi) => {
    if (!audioCtxRef.current) return;
    const freqBase = midiToFreq(baseMidi);
    triggerSynth(freqBase, 1.0, null, baseMidi);

    setTimeout(() => {
      const freqTarget = midiToFreq(targetMidi);
      triggerSynth(freqTarget, 1.4, null, targetMidi);
    }, 1200);
  };

  const replayInterval = () => {
    if (
      challengeState.intervalBaseMidi !== null &&
      challengeState.targetMidi !== null
    ) {
      if (intervalDifficultyMode === "standard") {
        playTrainerIntervalSequence(
          challengeState.intervalBaseMidi,
          challengeState.targetMidi,
        );
      } else {
        if (remainingReplays > 0) {
          setRemainingReplays((prev) => prev - 1);
          playTrainerIntervalSequence(
            challengeState.intervalBaseMidi,
            challengeState.targetMidi,
          );
        } else {
          showToast(
            "Límite de re-escuchas alcanzado para este turno.",
            "error",
          );
        }
      }
    }
  };

  const handleCorroborate = () => {
    if (challengeState.selectedGuess === null) {
      showToast(
        "Selecciona primero un intervalo en los botones de respuesta.",
        "error",
      );
      return;
    }
    const isCorrect =
      challengeState.selectedGuess === challengeState.targetInterval;
    registerResult(
      "interval_trainer",
      isCorrect,
      intervalNames[challengeState.targetInterval],
    );
    updateScore(isCorrect);

    if (isCorrect) {
      setChallengeState((prev) => ({
        ...prev,
        foundLocations: [{ midi: challengeState.targetMidi }],
      }));
      setTimeout(() => {
        startTrainerRound("interval_trainer");
      }, 3000);
    }
  };

  const playScaleMelodic = () => {
    initAudioContext();
    const activeScale = database[currentScaleType];
    const playbackNotes = [];
    const seenMidi = new Set();

    stringTunings.forEach((stringObj, stringIdx) => {
      for (let fret = 0; fret <= 12; fret++) {
        const midi = stringObj.midi + fret;
        const interval = (((midi - currentRootNote) % 12) + 12) % 12;
        if (activeScale.intervals.includes(interval)) {
          if (gameMode === "scale_builder") {
            const key = `${stringObj.midi}-${fret}`;
            if (challengeState.unlockedScaleNotes[key] && !seenMidi.has(midi)) {
              seenMidi.add(midi);
              playbackNotes.push({ midi, stringIdx, stringMidi: stringObj.midi, fret });
            }
          } else if (!seenMidi.has(midi)) {
            seenMidi.add(midi);
            playbackNotes.push({ midi, stringIdx, stringMidi: stringObj.midi, fret });
          }
        }
      }
    });

    playbackNotes.sort((a, b) => a.midi - b.midi);

    if (playbackNotes.length === 0) {
      showToast("Mapea algunas notas en el mástil primero.", "info");
      return;
    }

    playbackNotes.forEach((note, index) => {
      setTimeout(() => {
        const freq = midiToFreq(note.midi);
        highlightPlaybackNote(`${note.stringMidi}-${note.fret}`, 800);
        triggerSynth(freq, 0.8, note.stringIdx, note.midi);
      }, index * 250);
    });
  };

  const playScaleHarmonic = () => {
    initAudioContext();
    const activeScale = database[currentScaleType];
    const chordsNotes = [];

    const orderedStrings = [...stringTunings].reverse();
    orderedStrings.forEach((stringObj, stringIdx) => {
      for (let fret = 0; fret <= 12; fret++) {
        const midi = stringObj.midi + fret;
        const interval = (((midi - currentRootNote) % 12) + 12) % 12;
        if (activeScale.intervals.includes(interval)) {
          if (gameMode === "scale_builder") {
            const key = `${stringObj.midi}-${fret}`;
            if (challengeState.unlockedScaleNotes[key]) {
              chordsNotes.push({ midi, stringIdx, stringMidi: stringObj.midi, fret });
              break;
            }
          } else {
            chordsNotes.push({ midi, stringIdx, stringMidi: stringObj.midi, fret });
            break;
          }
        }
      }
    });

    if (chordsNotes.length === 0) {
      showToast("No hay notas disponibles para arpegiar.", "info");
      return;
    }

    chordsNotes.forEach((note, index) => {
      setTimeout(() => {
        const freq = midiToFreq(note.midi);
        highlightPlaybackNote(`${note.stringMidi}-${note.fret}`, 2500);
        triggerSynth(freq, 2.5, note.stringIdx, note.midi);
      }, index * 70);
    });
  };

  const resetStats = () => {
    const clearedStats = {
      interval_trainer: { correct: 0, incorrect: 0, failedItems: {} },
      scale_builder: { correct: 0, incorrect: 0, failedItems: {} },
      find_note: { correct: 0, incorrect: 0, failedItems: {} },
      caged_connector: { correct: 0, incorrect: 0, failedItems: {} },
    };
    setPerformanceStats(clearedStats);
    setTotalScore(0);
    setCurrentStreak(0);
    localStorage.removeItem("guitar_trainer_master_react_v6_reborn");
    showToast("Historial y estadísticas reseteados.", "info");
  };

  const askAI = async () => {
    if (!chatInput.trim()) return;
    const userQuery = chatInput;
    setChatMessages((prev) => [...prev, { sender: "Tú", text: userQuery }]);
    setChatInput("");

    if (!aiApiKey) {
      const response = generateLocalHarmonyResponse(userQuery);
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { sender: "Guitar AI", text: response },
        ]);
      }, 500);
      return;
    }

    const systemPrompt = `Eres un instructor de teoría musical. Explica conceptos de guitarra de forma concisa.
    Rendimiento del usuario: Puntuación actual ${totalScore} pts, racha de aciertos ${currentStreak}.`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${aiApiKey}`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: userQuery }] }],
          systemInstruction: { parts: [{ text: systemPrompt }] },
        }),
      });
      if (response.ok) {
        const json = await response.json();
        const aiText =
          json.candidates?.[0]?.content?.parts?.[0]?.text ||
          "No obtuve una respuesta válida.";
        setChatMessages((prev) => [
          ...prev,
          { sender: "Guitar AI", text: aiText },
        ]);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.warn("Fallo de comunicación con el motor cloud:", error);
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "Guitar AI",
          text: "Fallo de comunicación con el motor cloud. Cargando respuesta local de fallback...",
        },
      ]);
    }
  };

  const generateLocalHarmonyResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes("caged")) {
      return "El sistema CAGED divide el diapasón de la guitarra en 5 patrones de acordes abiertos: C, A, G, E y D. Al conectar estas formas de manera simétrica, puedes improvisar fluidamente sin quedarte estancado.";
    }
    if (q.includes("modos") || q.includes("griego")) {
      return "Los modos griegos son las escalas que surgen de los 7 grados de la escala mayor. Cada una tiene su propio color característico (ej: Lidio tiene una #4 brillante, Frigio una b2 exótica).";
    }
    return "¡Buenísima pregunta! Sigue practicando en el diapasón para entrenar tu memoria muscular y tu oído de forma combinada.";
  };

  const requestDiagnostic = () => {
    const text =
      "Analiza mis estadísticas de error actuales guardadas en mi navegador y dame un diagnóstico con sugerencias.";
    setChatInput(text);
  };

  const renderNoteDot = (stringIdx, fret, stringMidi) => {
    const midi = stringMidi + fret;
    const intervalFromRoot = (((midi - currentRootNote) % 12) + 12) % 12;
    const noteName = noteNames[midi % 12];
    const noteKey = `${stringMidi}-${fret}`;
    const isPlaybackActive = activePlaybackNoteKey === noteKey;

    let shouldShow = false;
    let isBridge = false;

    if (gameMode === "free") {
      const isInScale =
        database[currentScaleType].intervals.includes(intervalFromRoot);
      shouldShow = freeRevealActive
        ? isInScale && challengeState.unlockedScaleNotes[noteKey]
        : isInScale;
    } else if (gameMode === "interval_trainer") {
      shouldShow = intervalFromRoot === 0; // Mostrar solo la tónica de referencia en el test de oído
    } else if (gameMode === "scale_builder") {
      shouldShow = challengeState.unlockedScaleNotes[noteKey] === true;
    } else if (gameMode === "find_note") {
      const isRoot = intervalFromRoot === 0;
      const isFound = challengeState.foundLocations.some(
        (loc) => loc.midi === midi && loc.fret === fret,
      );
      shouldShow = isRoot || isFound;
    } else if (gameMode === "caged_connector") {
      const isInScale =
        database["pentatonic_minor"].intervals.includes(intervalFromRoot);
      const isDiscovered = challengeState.unlockedScaleNotes[noteKey] === true;
      const cagedLimits = getFretLimitsForActiveCagedBox();

      isBridge =
        challengeState.targetBridgeNote &&
        challengeState.targetBridgeNote.midi === midi &&
        challengeState.targetBridgeNote.fret === fret;

      if (isBridge) {
        shouldShow = true;
      } else if (
        isInScale &&
        fret >= cagedLimits.min &&
        fret <= cagedLimits.max
      ) {
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

    const label = isRoot
      ? noteName
      : labelMode === "names"
        ? noteName
        : shorthandIntervals[intervalFromRoot];

    return (
      <div
        style={{
          width: isCompactActive ? "26px" : "36px",
          height: isCompactActive ? "26px" : "36px",
          fontSize: isCompactActive ? "9px" : "11px",
          textShadow: "1px 1px 2px rgba(0,0,0,0.85)",
        }}
        className={`rounded-full flex items-center justify-center font-bold text-white shadow-md transition-all duration-300 z-30 select-none ${
          intervalColors[intervalFromRoot]
        } ${borderStyle} ${isPlaybackActive ? "ring-4 ring-emerald-400 scale-110 shadow-[0_0_0_6px_rgba(74,222,128,0.3)]" : ""}`}
      >
        {label}
      </div>
    );
  };

  const stringsToRender = isStringsInverted
    ? [...stringTunings].reverse()
    : stringTunings;
  const cagedLimits =
    gameMode === "caged_connector" ? getFretLimitsForActiveCagedBox() : null;

  return (
    <div className="bg-zinc-950 text-zinc-100 min-h-screen flex flex-col font-sans selection:bg-rose-600 selection:text-white overflow-x-hidden">
      {/* Sistema de Toasts flotantes */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-xl shadow-2xl flex items-center gap-3 border pointer-events-auto transition-all duration-300 bg-zinc-900/95 border-zinc-800 text-zinc-200`}
          >
            <Info
              className={`w-5 h-5 shrink-0 ${t.type === "success" ? "text-emerald-400" : t.type === "error" ? "text-rose-500" : "text-amber-500"}`}
            />
            <span className="text-xs font-semibold">{t.message}</span>
          </div>
        ))}
      </div>

      {/* HEADER HUD */}
      <header className="border-b border-zinc-800 bg-zinc-900/85 backdrop-blur-md sticky top-0 z-40 px-3 py-2 sm:px-4 sm:py-2.5 flex flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between w-full lg:w-auto">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-linear-to-br from-rose-600 to-amber-500 rounded-xl shadow-lg">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg leading-none tracking-tight flex items-center gap-1.5">
                Guitar Trainer
                <span className="text-[10px] sm:text-xs bg-rose-600/20 text-rose-400 px-1.5 py-0.5 rounded-full font-semibold">
                  React Master
                </span>
              </h1>
              <p className="text-[10px] sm:text-xs text-zinc-400 mt-0.5">
                CAGED, Modos Griegos, Test de Oído e IA Integrada
              </p>
            </div>
          </div>

          {/* HUD Score móvil */}
          <div className="flex lg:hidden items-center gap-1 bg-zinc-950 px-2.5 py-1 rounded-xl border border-zinc-800 ml-auto mr-2">
            <span className="text-xs font-mono font-black text-rose-500">
              {totalScore} pts
            </span>
            {currentStreak >= 3 && (
              <span className="text-[9px] text-amber-400 font-bold">🔥</span>
            )}
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
          >
            <Sliders className="w-4 h-4 sm:w-5" />
          </button>
        </div>

        {/* HUD Score de Escritorio */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-end w-full lg:w-auto">
          <div className="hidden lg:flex items-center gap-2 bg-zinc-950 border border-zinc-800/80 px-3 py-1 rounded-xl shadow-inner min-w-27.5 justify-center">
            <div className="text-center">
              <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest leading-none">
                PUNTUACIÓN
              </p>
              <div className="flex items-center gap-1.5 justify-center mt-0.5">
                <span className="text-xs font-mono font-black text-rose-500">
                  {totalScore} pts
                </span>
                {currentStreak >= 3 && (
                  <span className="text-[9px] text-amber-400 font-bold bg-amber-950/40 px-1 py-0.5 rounded">
                    🔥 x{currentStreak}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Afinador / Visualización en vivo */}
          {micActive && (
            <div className="flex items-center justify-between sm:justify-start gap-2.5 bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-xl text-xs font-semibold text-zinc-300 w-full sm:w-auto">
              <div className="hidden sm:flex items-center gap-1.5 border-r border-zinc-800 pr-2">
                <span className="text-zinc-500 text-[9px] uppercase">
                  Onda:
                </span>
                <canvas
                  ref={canvasRef}
                  className="w-16 h-5 bg-zinc-900 rounded border border-zinc-800"
                  width="64"
                  height="20"
                />
              </div>
              <div className="hidden md:flex items-center gap-1.5 border-r border-zinc-800 pr-2">
                <span className="text-zinc-500 text-[9px] uppercase">
                  Señal:
                </span>
                <span className="text-[8px] text-zinc-500 font-mono">
                  {rmsDb} dB
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-black text-rose-500 text-sm">
                  {tunerNote}
                </span>
                <span className="text-[10px] text-zinc-400 font-mono">
                  {tunerCents}
                </span>
              </div>
              <div className="flex-1 sm:flex-initial sm:w-12 h-1.5 bg-zinc-800 rounded-full overflow-hidden relative min-w-12.5">
                <div
                  style={{ left: `${tunerPointerOffset}%` }}
                  className="w-1.5 h-1.5 bg-emerald-500 rounded-full absolute -translate-x-1/2 transition-all duration-100"
                />
              </div>
            </div>
          )}

          {/* Botones de control del hardware */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              onClick={toggleAudioInput}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                micActive
                  ? "bg-emerald-600/20 text-emerald-400 border-emerald-500"
                  : "bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
              }`}
            >
              {micActive ? (
                <Mic className="w-3.5 h-3.5" />
              ) : (
                <MicOff className="w-3.5 h-3.5" />
              )}
              <span>{micActive ? "Mic Activo" : "Mic / Entrada"}</span>
            </button>

            <button
              onClick={initAudioContext}
              className={`flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                audioActive
                  ? "bg-rose-600/20 text-rose-400 border-rose-500"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/30"
              }`}
            >
              {audioActive ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
              <span>{audioActive ? "Audio Listo" : "Activar Audio"}</span>
            </button>
          </div>

          <button
            onClick={() => setIsDrawerOpen(true)}
            className="hidden lg:block p-2 hover:bg-zinc-800 rounded-lg text-zinc-400 hover:text-white"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* CONTENEDOR DE LA APLICACIÓN */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-4 flex flex-col lg:flex-row gap-4 transition-all duration-300">
        {/* Lado izquierdo: Tablas, diapasón, ejercicios */}
        <div className="flex-1 flex flex-col gap-4 w-full min-w-0">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
            {/* TABS DE SELECCIÓN */}
            <div className="flex border-b border-zinc-800 bg-zinc-950 p-1">
              <button
                onClick={() => setCurrentTab("scale-config")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  currentTab === "scale-config"
                    ? "bg-rose-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Music2 className="w-4 h-4" />
                <span>1. Escala Activa</span>
              </button>
              <button
                onClick={() => setCurrentTab("practice-modes")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
                  currentTab === "practice-modes"
                    ? "bg-rose-600 text-white shadow"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <span>2. Modos de Práctica</span>
              </button>
            </div>

            {/* CONTENIDO TAB 1: Configuración de Escalas */}
            {currentTab === "scale-config" && (
              <div className="p-4 sm:p-5 flex flex-col xl:flex-row gap-4 sm:gap-5 items-stretch xl:items-center justify-between">
                <div className="flex items-center gap-3 sm:gap-4 flex-1">
                  <span className="text-2xl sm:text-3xl font-black bg-zinc-950 px-4 py-2 rounded-2xl border border-zinc-800 text-rose-500 shadow-inner min-w-15 flex items-center justify-center font-mono">
                    {noteNames[currentRootNote]}
                  </span>
                  <div>
                    <h2 className="font-bold text-zinc-100 text-sm sm:text-base leading-tight">
                      {database[currentScaleType]?.name}
                    </h2>
                    <p className="text-[10px] sm:text-xs text-rose-400/80 mt-0.5 font-medium font-mono">
                      {labelMode === "names" ? (
                        <>Notas: {getScaleNotesString()}</>
                      ) : (
                        <>Intervalos: {getScaleIntervalsString()}</>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2">
                  <div className="grid grid-cols-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800/80 w-full sm:w-40 shrink-0">
                    <button
                      onClick={() => setLabelMode("names")}
                      className={`py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                        labelMode === "names"
                          ? "bg-rose-600 text-white shadow"
                          : "text-zinc-400"
                      }`}
                    >
                      Nombres
                    </button>
                    <button
                      onClick={() => setLabelMode("intervals")}
                      className={`py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                        labelMode === "intervals"
                          ? "bg-rose-600 text-white shadow"
                          : "text-zinc-400"
                      }`}
                    >
                      Intervalos
                    </button>
                  </div>

                  {/* Interruptores rápidos */}
                  <div className="flex flex-wrap gap-2">
                    {gameMode === "free" && (
                      <label className="text-[11px] sm:text-xs text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer bg-zinc-950 hover:bg-zinc-900 px-2.5 py-1.5 rounded-xl border border-zinc-800/80 transition-colors">
                        <input
                          type="checkbox"
                          checked={freeRevealActive}
                          onChange={(e) =>
                            setFreeRevealActive(e.target.checked)
                          }
                          className="rounded bg-zinc-800 border-zinc-700 text-rose-600 focus:ring-0"
                        />
                        <span>Ocultar escala</span>
                      </label>
                    )}

                    <label className="text-[11px] sm:text-xs text-zinc-300 flex items-center justify-center gap-1.5 cursor-pointer bg-zinc-950 hover:bg-zinc-900 px-2.5 py-1.5 rounded-xl border border-zinc-800/80 transition-colors">
                      <input
                        type="checkbox"
                        checked={isStringsInverted}
                        onChange={(e) => setIsStringsInverted(e.target.checked)}
                        className="rounded bg-zinc-800 border-zinc-700 text-rose-600 focus:ring-0"
                      />
                      <span>Espejo (6ª arriba)</span>
                    </label>

                    <label className="text-[11px] sm:text-xs text-rose-400 flex items-center justify-center gap-1.5 cursor-pointer bg-zinc-950 hover:bg-zinc-900 px-2.5 py-1.5 rounded-xl border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                      <input
                        type="checkbox"
                        checked={isCompactActive}
                        onChange={(e) => setIsCompactActive(e.target.checked)}
                        className="rounded bg-zinc-800 border-zinc-700 text-rose-600 focus:ring-0"
                      />
                      <span className="flex items-center gap-1">
                        <ZoomOut className="w-3.5 h-3.5" />
                        Mástil Compacto
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* CONTENIDO TAB 2: Modos de Juego y Prácticas */}
            {currentTab === "practice-modes" && (
              <div className="p-3 sm:p-4 flex flex-col gap-3">
                <div className="bg-zinc-950 p-2 rounded-xl border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-inner">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-600/10 text-rose-400 rounded-lg">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-wider">
                      Método activo de Práctica:
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={gameMode}
                      onChange={(e) => {
                        const mode = e.target.value;
                        setGameMode(mode);
                        if (mode !== "free") {
                          startTrainerRound(mode);
                        }
                      }}
                      className="bg-zinc-900 border border-zinc-800 hover:border-rose-500 rounded-xl px-2.5 py-1.5 text-xs font-bold text-zinc-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-rose-500"
                    >
                      <option value="free">🎸 Práctica Libre</option>
                      <option value="interval_trainer">
                        👂 Identificar Oído (Test Auditivo)
                      </option>
                      <option value="scale_builder">
                        📐 Constructor de Escalas
                      </option>
                      <option value="find_note">
                        🎯 Encuentra el Intervalo
                      </option>
                      <option value="caged_connector">
                        📦 Conexión de Cajas (CAGED)
                      </option>
                    </select>

                    <button
                      onClick={() => setIsPracticeInfoModalOpen(true)}
                      className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-rose-400 rounded-xl"
                    >
                      <HelpCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submódulo de Test Auditivo */}
                {gameMode === "interval_trainer" && (
                  <div className="bg-zinc-950/70 p-3 rounded-xl border border-zinc-800 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-zinc-800/50">
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">
                        Test Auditivo de Intervalos
                      </span>
                      <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                        <button
                          onClick={() => setIntervalDifficultyMode("standard")}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            intervalDifficultyMode === "standard"
                              ? "bg-rose-600 text-white shadow"
                              : "text-zinc-400"
                          }`}
                        >
                          Estándar
                        </button>
                        <button
                          onClick={() => setIntervalDifficultyMode("advanced")}
                          className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                            intervalDifficultyMode === "advanced"
                              ? "bg-amber-600 text-white shadow"
                              : "text-zinc-400"
                          }`}
                        >
                          Avanzado (Ciego) 👁️❌
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-6 gap-1 max-w-lg">
                      {shorthandIntervals.map((shorthand, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            initAudioContext();
                            setChallengeState((prev) => ({
                              ...prev,
                              selectedGuess: idx,
                            }));
                            if (
                              intervalDifficultyMode === "standard" &&
                              challengeState.intervalBaseMidi !== null
                            ) {
                              playTrainerIntervalSequence(
                                challengeState.intervalBaseMidi,
                                challengeState.intervalBaseMidi + idx,
                              );
                            }
                          }}
                          className={`py-1.5 px-0.5 text-center text-xs font-black rounded-lg transition-all border border-white/10 ${
                            intervalColors[idx]
                          } ${challengeState.selectedGuess === idx ? "ring-4 ring-white scale-105" : "hover:scale-105"}`}
                        >
                          {shorthand}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2 max-w-lg pt-1">
                      <button
                        onClick={replayInterval}
                        disabled={
                          intervalDifficultyMode === "advanced" &&
                          remainingReplays === 0
                        }
                        className={`py-2.5 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md ${
                          intervalDifficultyMode === "advanced" &&
                          remainingReplays === 0
                            ? "opacity-40 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>
                          Re-escuchar{" "}
                          {intervalDifficultyMode === "advanced"
                            ? `(${remainingReplays})`
                            : ""}
                        </span>
                      </button>
                      <button
                        onClick={handleCorroborate}
                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <CheckSquare className="w-4 h-4" />
                        <span>Corroborar</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Submódulo de Constructor de Escalas */}
                {gameMode === "scale_builder" && (
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 animate-fade-in">
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">
                      Estatus de Cobertura de Cuerdas:
                    </span>
                    <div className="flex flex-wrap gap-2.5">
                      {stringTunings.map((stringObj) => {
                        const requiredCount =
                          database[currentScaleType]?.type === "pentatonic"
                            ? 2
                            : 3;
                        const count =
                          challengeState.coverageMap[stringObj.midi]?.length ||
                          0;
                        const leds = Array.from(
                          { length: requiredCount },
                          (_, i) => i < count,
                        );

                        return (
                          <div
                            key={stringObj.midi}
                            className="bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-800 flex items-center gap-2 text-xs"
                          >
                            <span className="font-bold text-zinc-400">
                              {stringObj.name}
                            </span>
                            <div className="flex gap-1">
                              {leds.map((isLit, i) => (
                                <span
                                  key={i}
                                  className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                                    isLit
                                      ? "bg-emerald-500 border-emerald-400 shadow-[0_0_6px_#10b981]"
                                      : "bg-zinc-800 border-zinc-700"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Submódulo de CAGED */}
                {gameMode === "caged_connector" && (
                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-zinc-400">
                        Progreso en{" "}
                        {PENTATONIC_BOXES_DATA[activeCagedBoxIndex]?.name}:
                      </span>
                      <span className="text-amber-400 font-mono">
                        {cagedSuccessfulNotes} /{" "}
                        {challengeState.activeBoxCoords.length} notas
                      </span>
                    </div>
                    <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                      <div
                        style={{
                          width: `${(cagedSuccessfulNotes / (challengeState.activeBoxCoords.length || 1)) * 100}%`,
                        }}
                        className="bg-linear-to-r from-amber-500 to-rose-500 h-full transition-all duration-300"
                      />
                    </div>
                  </div>
                )}

                {/* Info Panel General */}
                <div className="bg-zinc-900/40 p-3 rounded-xl border border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 flex-1 w-full">
                    <div className="p-2 bg-zinc-800 rounded-xl text-zinc-400 shrink-0">
                      {gameMode === "free" ? (
                        <Compass className="w-4 h-4" />
                      ) : (
                        <Target className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-zinc-100 text-xs">
                        {gameMode === "free"
                          ? "Práctica de Improvisación Libre"
                          : gameMode === "interval_trainer"
                            ? "Identificador de Oído"
                            : gameMode === "scale_builder"
                              ? `Construyendo la escala ${database[currentScaleType]?.name || currentScaleType} de ${noteNames[currentRootNote]}`
                              : gameMode === "find_note"
                                ? `Localiza el intervalo: ${intervalNames[challengeState.targetInterval]}`
                                : "Entrenamiento CAGED"}
                      </h3>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {gameMode === "free"
                          ? "Toca cualquier posición. Los intervalos válidos de la escala están iluminados."
                          : "Interactúa con las posiciones marcadas en el diapasón para completar la ronda."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 w-full md:w-auto justify-end">
                    <button
                      onClick={() => startTrainerRound(gameMode)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow-md"
                    >
                      Siguiente Ronda
                    </button>

                    <button
                      onClick={playScaleMelodic}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-md"
                    >
                      Melodía
                    </button>
                    <button
                      onClick={playScaleHarmonic}
                      className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 shadow-md"
                    >
                      Arpegio
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* EL DIAPASÓN MODULAR DE ALTA USABILIDAD */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5 shadow-inner relative overflow-hidden w-full">
            {gameMode === "caged_connector" && (
              <div className="absolute top-4 right-5 bg-zinc-950/90 border border-amber-500/30 text-amber-400 px-3 py-1 rounded-full text-[10px] font-bold z-30 flex items-center gap-1.5 backdrop-blur shadow-md">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
                <span>{PENTATONIC_BOXES_DATA[activeCagedBoxIndex]?.name}</span>
              </div>
            )}

            <div className="overflow-x-auto w-full pb-2 scrollbar-thin">
              <div style={{ minWidth: "850px" }} className="w-full flex flex-col">
                <div
                  style={{
                    minWidth: "850px",
                    background:
                      "linear-gradient(to right, #1a0f07, #28170c, #1a0f07)",
                  }}
                  className="relative rounded-lg pr-1 min-h-65 flex flex-col justify-between border-y border--950 py-1"
                >
                  {/* Líneas Guías / Inlays del mástil en trastes 3, 5, 7, 9, 12 */}
                  {[3, 5, 7, 9].map((fret) => (
                    <div
                      key={fret}
                      style={{
                        left: `calc(6% + ${(fret - 1) * 7.8}% + 3.9%)`,
                        top: "50%",
                        transform: "translate(-50%, -50%)",
                      }}
                      className="absolute w-3 h-3 bg-zinc-400/30 rounded-full pointer-events-none z-10 shadow-sm"
                    />
                  ))}
                  {/* Traste 12 (Doble Punto) */}
                  <div
                    style={{
                      left: "calc(6% + 11 * 7.8% + 3.9%)",
                    }}
                    className="absolute inset-y-0 flex flex-col justify-around py-4 pointer-events-none z-10"
                  >
                    <span className="w-2.5 h-2.5 bg-rose-500/30 rounded-full" />
                    <span className="w-2.5 h-2.5 bg-rose-500/30 rounded-full" />
                  </div>

                  {/* Renderizar cada Cuerda de la Guitarra */}
                  {stringsToRender.map((stringObj, stringIdx) => {
                    const thickness =
                      1 + (isStringsInverted ? 5 - stringIdx : stringIdx) * 0.45;

                    return (
                      <div
                        key={stringObj.midi}
                        className={`relative flex items-center w-full ${activeVibrationString === stringIdx ? "string-vibrate" : ""}`}
                        style={{ height: "38px" }}
                      >
                        {/* Alambre metálico físico de la cuerda */}
                        <div
                          style={{ height: `${thickness}px` }}
                          className="string-line absolute left-0 right-0 bg-zinc-400/70 pointer-events-none z-0 shadow-sm"
                        />

                        {/* Traste 0 (Abierto) */}
                        <div
                          onClick={() => {
                            initAudioContext();
                            triggerStringVibration(stringIdx);
                            triggerSynth(
                              midiToFreq(stringObj.midi),
                              1.4,
                              stringIdx,
                              stringObj.midi,
                            );
                            handleInputNoteMatch(
                              stringObj.midi,
                              0,
                              stringObj.midi,
                            );
                          }}
                          className="w-[6%] h-11 flex items-center justify-center cursor-pointer hover:bg-zinc-800/40 border-r-4 border-be-zinc-700 z-20"
                        >
                          {renderNoteDot(stringIdx, 0, stringObj.midi)}
                        </div>

                        {/* Trastes 1 al 12 */}
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(
                          (fret) => {
                            const isFretFocused =
                              cagedLimits &&
                              fret >= cagedLimits.min &&
                              fret <= cagedLimits.max;

                            return (
                              <div
                                key={fret}
                                onClick={() => {
                                  initAudioContext();
                                  triggerStringVibration(stringIdx);
                                  triggerSynth(
                                    midiToFreq(stringObj.midi + fret),
                                    1.4,
                                    stringIdx,
                                    stringObj.midi + fret,
                                  );
                                  handleInputNoteMatch(
                                    stringObj.midi + fret,
                                    fret,
                                    stringObj.midi,
                                  );
                                }}
                                style={{ width: "7.8%" }}
                                className={`h-11 flex items-center justify-center cursor-pointer border-r border-b-gray-800/80 transition-all ${
                                  isFretFocused
                                    ? "bg-rose-500/5 hover:bg-rose-500/10"
                                    : "hover:bg-zinc-800/30"
                                }`}
                              >
                                {renderNoteDot(stringIdx, fret, stringObj.midi)}
                              </div>
                            );
                          },
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Números de Trastes alineados */}
                <div
                  style={{ minWidth: "850px" }}
                  className="grid grid-cols-13 text-center text-zinc-500 text-[10px] font-black tracking-wider pt-3 pb-1 mt-2 border-t border-zinc-800/50"
                >
                  <div className="w-[6%] flex items-center justify-center min-h-6">
                    Aire
                  </div>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((fret) => (
                    <div
                      key={fret}
                      className="flex-1 font-mono flex items-center justify-center min-h-6"
                    >
                      Traste {fret}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lado Derecho: Asistente IA */}
        <div
          className={`sidebar-transition flex flex-col gap-3 shrink-0 ${
            isAiSidebarCollapsed ? "w-0 overflow-hidden" : "w-full lg:w-80"
          }`}
        >
          <button
            onClick={() => setIsAiSidebarCollapsed(true)}
            className="flex items-center justify-between w-full p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors shadow"
          >
            <span className="flex items-center gap-2">
              <Bot className="w-4 h-4" />
              Ocultar Ayudante IA
            </span>
            <ChevronsRight className="w-4 h-4" />
          </button>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col h-122.5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-rose-600/10 text-rose-400 rounded-lg">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-zinc-100">
                    Ayudante IA Armónico
                  </h3>
                  <p className="text-[9px] text-zinc-500">
                    Dudas de armonía y escalas
                  </p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            </div>

            <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1 text-xs text-zinc-300">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl max-w-full space-y-1 ${
                    msg.sender === "Tú"
                      ? "bg-zinc-800 text-zinc-100 ml-auto"
                      : "bg-zinc-950 border border-zinc-800"
                  }`}
                >
                  <span className="font-bold block text-[9px] uppercase tracking-wider text-rose-400 font-mono">
                    {msg.sender}
                  </span>
                  <p>{msg.text}</p>
                </div>
              ))}
            </div>

            <div className="pb-2">
              <button
                onClick={requestDiagnostic}
                className="w-full py-2 bg-linear-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Analizar Mis Dificultades
              </button>
            </div>

            <div className="border-t border-zinc-800 pt-3 flex gap-1.5">
              <input
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && askAI()}
                type="text"
                placeholder="Escribe tu duda armónica..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
              />
              <button
                onClick={askAI}
                className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Botón flotante para reabrir la IA */}
        {isAiSidebarCollapsed && (
          <button
            onClick={() => setIsAiSidebarCollapsed(false)}
            className="fixed bottom-6 right-6 z-30 p-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-full shadow-2xl transition-all flex items-center gap-2"
          >
            <Bot className="w-5 h-5 animate-bounce" />
            <span className="text-xs font-bold">Ayudante IA</span>
          </button>
        )}
      </main>

      {/* DRAWER GENERAL DE CONFIGURACIÓN */}
      {isDrawerOpen && (
        <>
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 z-40 transition-opacity duration-300"
          />
          <div className="fixed inset-y-0 right-0 w-80 bg-zinc-900 border-l border-zinc-800 z-50 p-5 space-y-6 overflow-y-auto">
            <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-sm">Configuración General</h3>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Raíz / Tónica */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2">
                Tónica Raíz
              </label>
              <div className="grid grid-cols-4 gap-1">
                {noteNames.map((name, idx) => (
                  <button
                    key={name}
                    onClick={() => {
                      setCurrentRootNote(idx);
                      if (gameMode !== "free") {
                        startTrainerRound(gameMode);
                      }
                    }}
                    className={`p-2 rounded-lg text-xs font-bold ${
                      idx === currentRootNote
                        ? "bg-rose-600 text-white shadow"
                        : "bg-zinc-950 text-zinc-400 hover:bg-zinc-800"
                    }`}
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>

            {/* Escala */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2">
                Estructura Armónica
              </label>
              <select
                value={currentScaleType}
                onChange={(e) => {
                  setCurrentScaleType(e.target.value);
                  if (gameMode !== "free") startTrainerRound(e.target.value);
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
              >
                <optgroup label="Escalas">
                  <option value="major">Mayor</option>
                  <option value="minor">Menor Natural</option>
                  <option value="pentatonic_major">Pentatónica Mayor</option>
                  <option value="pentatonic_minor">Pentatónica Menor</option>
                  <option value="blues">Escala de Blues</option>
                </optgroup>
                <optgroup label="Modos Griegos">
                  <option value="dorian">Modo Dórico</option>
                  <option value="phrygian">Modo Frigio</option>
                  <option value="lydian">Modo Lidio</option>
                  <option value="mixolydian">Modo Mixolidio</option>
                  <option value="locrian">Modo Locrio</option>
                </optgroup>
                <optgroup label="Arpegios">
                  <option value="arp_major">Arpegio Mayor (Tríada)</option>
                  <option value="arp_minor">Arpegio Menor (Tríada)</option>
                  <option value="arp_maj7">Arpegio Maj7</option>
                  <option value="arp_dom7">Arpegio Dom7</option>
                </optgroup>
              </select>
            </div>

            {/* Timbre del Sintetizador */}
            <div>
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2">
                Timbre del Sintetizador
              </label>
              <select
                value={synthTimbre}
                onChange={(e) => {
                  setSynthTimbre(e.target.value);
                  if (
                    e.target.value === "real_guitar" &&
                    !realGuitarLoaded &&
                    !realGuitarLoading
                  ) {
                    loadRealGuitarSamples();
                  }
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
              >
                <option value="synth_guitar">
                  Cuerdas Sintetizadas (Karplus Pluck)
                </option>
                <option value="real_guitar">
                  Guitarra Real (Muestras de Acero)
                </option>
                <option value="flat_triangle">
                  Tono Suave (Triangular con Armónicos)
                </option>
              </select>
            </div>

            {/* Volumen */}
            <div>
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 mb-2">
                <span>Volumen General</span>
                <span>{Math.round(mainVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={mainVolume * 100}
                onChange={(e) => setMainVolume(Number(e.target.value) / 100)}
                className="w-full accent-rose-500 bg-zinc-800 h-1.5 rounded-lg cursor-pointer"
              />
            </div>

            {/* IA API Key */}
            <div className="pt-4 border-t border-zinc-800">
              <label className="block text-[10px] font-black text-zinc-400 uppercase mb-2">
                Gemini API Key (Opcional)
              </label>
              <input
                type="password"
                value={aiApiKey}
                onChange={(e) => setAiApiKey(e.target.value)}
                placeholder="AI key para tutoría en la nube..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Reinicio */}
            <div className="pt-4 border-t border-zinc-800">
              <button
                onClick={resetStats}
                className="w-full py-2.5 bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 hover:border-rose-500 rounded-xl text-xs font-bold text-rose-500 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Resetear Historial
              </button>
            </div>
          </div>
        </>
      )}

      {/* MODAL DE INFORMACIÓN DE PRÁCTICA */}
      {isPracticeInfoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <Info className="w-5 h-5 text-rose-400" />
                <h2 className="text-base font-bold text-white">
                  Objetivo del Modo Actual
                </h2>
              </div>
              <button
                onClick={() => setIsPracticeInfoModalOpen(false)}
                className="p-1 hover:bg-zinc-800 rounded text-zinc-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <div>
                <h4 className="font-bold text-zinc-400 uppercase text-[10px] tracking-wider mb-1">
                  🎯 Objetivo
                </h4>
                <p className="leading-relaxed bg-zinc-950 p-3 rounded-xl border border-zinc-800/60 font-medium">
                  {gameMode === "free"
                    ? "Explora el diapasón a tu propio ritmo conociendo los intervalos de la escala elegida."
                    : gameMode === "interval_trainer"
                      ? "Asocia distancias sonoras y entrena tu oído interno para reconocer intervalos musicales."
                      : gameMode === "scale_builder"
                        ? "Memoriza la estructura simétrica de las escalas completando su cobertura física."
                        : gameMode === "find_note"
                          ? "Aprende a localizar el mismo intervalo en diferentes zonas del diapasón rápidamente."
                          : "Domina la navegación horizontal y la improvisación conectando las 5 cajas básicas del CAGED."}
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl flex gap-2.5 items-start">
                <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-amber-400 text-[10px] uppercase tracking-wider">
                    Tip Pro
                  </h4>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
                    Usa auriculares de buena calidad para el entrenamiento
                    auditivo y asegúrate de silenciar otras fuentes de ruido si
                    vas a usar el afinador del micrófono.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-zinc-800">
              <button
                onClick={() => setIsPracticeInfoModalOpen(false)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow"
              >
                ¡Entendido!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE VICTORIA */}
      {isVictoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl flex flex-col gap-6">
            <div className="flex items-center gap-4 border-b border-zinc-800 pb-4">
              <div className="p-3 bg-linear-to-br from-amber-500 to-yellow-400 text-zinc-950 rounded-2xl shadow">
                <Award className="w-8 h-8" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 font-mono">
                  Escala Dominada
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white leading-tight">
                  ¡{database[currentScaleType]?.name} Completada!
                </h2>
              </div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950 p-4 rounded-2xl border border-zinc-800">
              {database[currentScaleType]?.desc}
            </p>

            <div className="bg-zinc-950/40 border border-zinc-800 p-4 rounded-2xl flex gap-4 items-start">
              <div className="p-3 bg-rose-600/10 text-rose-400 rounded-xl shrink-0">
                <Music className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-500">
                  Solo de Referencia
                </span>
                <h4 className="font-bold text-white text-base">
                  {database[currentScaleType]?.solo_title}
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {database[currentScaleType]?.solo_desc}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsVictoryModalOpen(false)}
                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow"
              >
                Seguir Practicando
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
