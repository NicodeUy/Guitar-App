// ==========================================
// CONSTANTES Y CONFIGURACIONES DE TEORÍA
// ==========================================

export const intervalColors = [
  "bg-rose-600",      // 0: Tónica
  "bg-orange-600",    // 1: 2da menor
  "bg-amber-600",     // 2: 2da mayor
  "bg-yellow-600",    // 3: 3ra menor
  "bg-lime-600",      // 4: 3ra mayor
  "bg-emerald-600",   // 5: 4ta justa
  "bg-teal-600",      // 6: 4ta aum / 5ta dis
  "bg-cyan-600",      // 7: 5ta justa
  "bg-sky-600",       // 8: 6ta menor
  "bg-blue-600",      // 9: 6ta mayor
  "bg-indigo-600",    // 10: 7ma menor
  "bg-violet-600"     // 11: 7ma mayor
];

export const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const stringTunings = [
  { name: "E", midi: 64, index: 1 },
  { name: "B", midi: 59, index: 2 },
  { name: "G", midi: 55, index: 3 },
  { name: "D", midi: 50, index: 4 },
  { name: "A", midi: 45, index: 5 },
  { name: "E", midi: 40, index: 6 }
];

export const PENTATONIC_BOXES_DATA = [
  {
    id: "box1",
    name: "Caja 1 - Forma de Mi (Posición Base)",
    fretOffsetRange: [0, 3],
    bridgeNotes: [
      { stringIdx: 5, fretRel: 3 },
      { stringIdx: 0, fretRel: 3 }
    ]
  },
  {
    id: "box2",
    name: "Caja 2 - Forma de Re",
    fretOffsetRange: [2, 5],
    bridgeNotes: [
      { stringIdx: 4, fretRel: 5 },
      { stringIdx: 1, fretRel: 5 }
    ]
  },
  {
    id: "box3",
    name: "Caja 3 - Forma de Do",
    fretOffsetRange: [4, 8],
    bridgeNotes: [
      { stringIdx: 3, fretRel: 7 },
      { stringIdx: 2, fretRel: 7 }
    ]
  },
  {
    id: "box4",
    name: "Caja 4 - Forma de La",
    fretOffsetRange: [7, 10],
    bridgeNotes: [
      { stringIdx: 5, fretRel: 10 },
      { stringIdx: 0, fretRel: 10 }
    ]
  },
  {
    id: "box5",
    name: "Caja 5 - Forma de Sol",
    fretOffsetRange: [9, 12],
    bridgeNotes: [
      { stringIdx: 4, fretRel: 12 },
      { stringIdx: 1, fretRel: 12 }
    ]
  }
];

export const database = {
  major: {
    name: "Escala Mayor (Jónica)",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    type: "heptatonic",
    formulas: ["1", "2", "3", "4", "5", "6", "7"],
    desc: "La escala reina de la música occidental. Transmite alegría, brillo, resolución y estabilidad. Al no tener tensiones alteradas, es ideal para melodías triunfales, himnos y el pilar fundamental de la armonía tonal.",
    solo_title: '"Let It Be" - The Beatles (George Harrison)',
    solo_desc: "Un solo sumamente melódico y cantarín que aprovecha la perfecta consonancia y estabilidad de la escala mayor para crear frases memorables."
  },
  minor: {
    name: "Menor Natural (Eólica)",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    type: "heptatonic",
    formulas: ["1", "2", "b3", "4", "5", "b6", "b7"],
    desc: "Evoca melancolía, introspección, drama profundo y misterio. Muy común en baladas tristes, rock progresivo, metal y música clásica. Su tercera menor define su sonido oscuro pero sumamente emotivo.",
    solo_title: '"All Along the Watchtower" - Jimi Hendrix',
    solo_desc: "Hendrix saca a relucir toda la potencia emocional de la escala menor en este solo histórico, variando intensidades y sosteniendo bendings desgarradores."
  },
  pentatonic_major: {
    name: "Pentatónica Mayor",
    intervals: [0, 2, 4, 7, 9],
    type: "pentatonic",
    formulas: ["1", "2", "3", "5", "6"],
    desc: "Una escala ultra fluida de 5 notas que elimina las distancias de semitono (evitando intervalos de tensión como el tritono). Suena sumamente dulce, campestre (estilo Country) y relajada.",
    solo_title: '"Jessica" - The Allman Brothers Band (Dickey Betts)',
    solo_desc: "Un solo con un tono campestre y alegre impecable. Muestra cómo la pentatónica mayor puede sostener una canción instrumental entera transmitiendo absoluta libertad."
  },
  pentatonic_minor: {
    name: "Pentatónica Menor",
    intervals: [0, 3, 5, 7, 10],
    type: "pentatonic",
    formulas: ["1", "b3", "4", "5", "b7"],
    desc: "La reina absoluta del Rock, Blues, Hard Rock y Metal. Ofrece un fraseo directo, agresivo y extremadamente cómodo en la guitarra debido a su simetría de '2 notas por cuerda'. Casi imposible tocar una nota equivocada.",
    solo_title: '"Stairway to Heaven" - Led Zeppelin (Jimmy Page)',
    solo_desc: "La obra maestra de Jimmy Page. Un solo legendario construido casi en su totalidad sobre el primer patrón de la pentatónica menor, demostrando que con 5 notas se puede hacer historia."
  },
  blues: {
    name: "Escala de Blues (con b5)",
    intervals: [0, 3, 5, 6, 7, 10],
    type: "blues",
    formulas: ["1", "b3", "4", "b5", "5", "b7"],
    desc: "Es la pentatónica menor modificada con el añadido de la 'blue note' (la quinta disminuida, b5). Aporta una tensión cruda, sucia, áspera y una expresividad inigualable para el blues clásico.",
    solo_title: '"Texas Flood" - Stevie Ray Vaughan',
    solo_desc: "El dominio absoluto de la nota de blues. Stevie estira y arrastra la b5 para dotar a su guitarra de un llanto desgarrador, creando un sonido cargado de sudor y emoción tejana."
  },
  dorian: {
    name: "Modo Dórico",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    type: "heptatonic",
    formulas: ["1", "2", "b3", "4", "5", "6", "b7"],
    desc: "Una escala menor pero con una sexta mayor brillante. Esto le quita la melancolía pesada a la escala menor y le otorga un aire de misterio elegante, sofisticado y bailable.",
    solo_title: '"Oye Como Va" - Santana (Carlos Santana)',
    solo_desc: "Carlos Santana es el embajador indiscutible del Modo Dórico. Usa la sexta mayor de forma repetitiva para lograr ese sonido misterioso, latino e increíblemente fluido."
  },
  phrygian: {
    name: "Modo Phrygio (Frigio)",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    type: "heptatonic",
    formulas: ["1", "b2", "b3", "4", "5", "b6", "b7"],
    desc: "Una escala muy oscura caracterizada por su segunda menor descendente (b2). Evoca sonidos flamencos, árabes o atmósferas de metal pesado muy densas y amenazantes.",
    solo_title: '"Wherever I May Roam" - Metallica (Kirk Hammett)',
    solo_desc: "Kirk utiliza la tensión exótica de la segunda menor en los riffs y frases principales para simular un viaje místico e inquietante."
  },
  lydian: {
    name: "Modo Lidio",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    type: "heptatonic",
    formulas: ["1", "2", "3", "#4", "5", "6", "7"],
    desc: "La escala más brillante posible. Su cuarta aumentada (#4) rompe la estabilidad natural y crea un sonido flotante, celestial, futurista y mágico.",
    solo_title: '"Flying in a Blue Dream" - Joe Satriani',
    solo_desc: "Satriani explota la magia mística de la cuarta aumentada sobre acordes móviles para darnos la sensación literal de estar volando o flotando en el espacio."
  },
  mixolydian: {
    name: "Modo Mixolidio",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    type: "heptatonic",
    formulas: ["1", "2", "3", "4", "5", "6", "b7"],
    desc: "Es una escala mayor pero con una séptima menor (b7). Tiene una actitud sumamente fiestera, rockera y relajada. Ideal para improvisar sobre acordes dominantes.",
    solo_title: '"Sweet Child O\' Mine" - Guns N\' Roses (Slash)',
    solo_desc: "El solo principal de esta mítica canción utiliza la escala mayor combinada con el sabor Mixolidio, logrando un tono que suena inmensamente épico y optimista."
  },
  locrian: {
    name: "Modo Locrio",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    type: "heptatonic",
    formulas: ["1", "b2", "b3", "4", "b5", "b6", "b7"],
    desc: "La escala más inestable y tensa. Su quinta disminuida (b5) provoca que el acorde tónico sea disminuido, eliminando cualquier sensación de reposo. Suena caótica y conflictiva.",
    solo_title: '"Sad But True" - Metallica (Riffs principales)',
    solo_desc: "James Hetfield y Kirk Hammett estructuran la tensión aplastante del riff principal basándose en las notas del modo locrio para transmitir una sensación de peligro absoluto."
  },
  arp_major: {
    name: "Arpegio Mayor Tríada",
    intervals: [0, 4, 7],
    type: "arp_triad",
    formulas: ["1", "3", "5"],
    desc: "Dibuja perfectamente el contorno armónico de un acorde mayor. Sólido, heroico e indiscutiblemente estable.",
    solo_title: '"Hotel California" - Eagles',
    solo_desc: "El duelo final de guitarras se basa en arpegios entrelazados que definen con absoluta elegancia el cambio armónico de cada acorde de la progresión."
  },
  arp_minor: {
    name: "Arpegio Menor Tríada",
    intervals: [0, 3, 7],
    type: "arp_triad",
    formulas: ["1", "b3", "5"],
    desc: "El esqueleto fundamental de la melancolía armónica. Dibuja un acorde menor de forma directa y elegante.",
    solo_title: '"Sultans of Swing" - Dire Straits',
    solo_desc: "Mark Knopfler corona el solo de salida con arpegios menores de Re menor barriendo las cuerdas rápidamente con los dedos."
  },
  arp_maj7: {
    name: "Arpegio Maj7",
    intervals: [0, 4, 7, 11],
    type: "arp_seventh",
    formulas: ["1", "3", "5", "7"],
    desc: "Un sonido sofisticado, jazzero, nostálgico pero sumamente cálido. Añade la séptima mayor para un toque elegante.",
    solo_title: '"Under the Bridge" - Red Hot Chili Peppers',
    solo_desc: "John Frusciante utiliza hermosos adornos arpegiados de séptima mayor en las transiciones de acordes para darles un toque dulce."
  },
  arp_dom7: {
    name: "Arpegio Dominante (Dom7)",
    intervals: [0, 4, 7, 10],
    type: "arp_seventh",
    formulas: ["1", "3", "5", "b7"],
    desc: "El sonido de la tensión que busca resolver. Imprescindible en el Blues, Funk y Jazz.",
    solo_title: '"Pride and Joy" - Stevie Ray Vaughan',
    solo_desc: "Vaughan usa arpegios dominantes de paso rápido sobre el mástil para marcar con firmeza el cambio hacia el acorde de paso dominante."
  },
  arp_min7: {
    name: "Arpegio Menor 7 (m7)",
    intervals: [0, 3, 7, 10],
    type: "arp_seventh",
    formulas: ["1", "b3", "5", "b7"],
    desc: "Tranquilo, nocturno, aterciopelado. Ideal para improvisar sobre baladas de Jazz y progresiones de Neo-Soul.",
    solo_title: '"Breezin\'" - George Benson',
    solo_desc: "George Benson despliega arpegios menores de séptima con una soltura de pulgar incomparable, logrando que el instrumento suene sofisticado."
  },
  arp_m7b5: {
    name: "Arpegio Semidisminuido (m7b5)",
    intervals: [0, 3, 6, 10],
    type: "arp_seventh",
    formulas: ["1", "b3", "b5", "b7"],
    desc: "Tensión dramática clásica del Jazz. Es el segundo grado de las progresiones menores II-V-I.",
    solo_title: '"Autumn Leaves" - Standard de Jazz',
    solo_desc: "El punto crucial de tensión melódica del solo se apoya en este arpegio semidisminuido antes de resolver majestuosamente en el acorde tónico."
  }
};

export const intervalNames = [
  "Unísono / Tónica", "Segunda Menor", "Segunda Mayor", "Tercera Menor", "Tercera Mayor",
  "Cuarta Justa", "Quinta Disminuida (b5)", "Quinta Justa", "Sexta Menor", "Sexta Mayor",
  "Séptima Menor", "Séptima Mayor", "Octava"
];

export const shorthandIntervals = ["1", "b2", "2", "b3", "3", "4", "b5", "5", "b6", "6", "b7", "7"];