/**
 * DigestFlow - Educational Curriculum & Card Data
 * 3 Progressive Levels of Human Digestive System mastery
 * Clean, bold, solid colors without muddy gradients
 */

const DIGEST_LEVELS = [
  {
    level: 1,
    title: "Level 1: The Core Journey",
    subtitle: "Trace the primary gastrointestinal tract from first bite to final exit",
    badge: "Core Foundations",
    themeColor: "#FF3B5C",
    description: "Follow food as it travels through the main hollow muscular organs of the GI tract.",
    cards: [
      {
        id: "mouth",
        number: "01",
        name: "Mouth",
        aliases: ["mouth", "oral cavity", "buccal cavity", "teeth and tongue", "mouth cavity"],
        icon: "mouth",
        emoji: "👄",
        color: "#FF3B5C",
        tag: "Ingestion & Mastication",
        clue: "I am the gateway to the digestive tract. Here, mechanical digestion begins with chewing, while saliva moistens food and starts chemical breakdown into a soft ball called a bolus.",
        hint1: "Located on the face; contains teeth, tongue, and salivary ducts.",
        hint2: "Starts with the letter 'M' and rhymes with 'south'.",
        funFact: "Human teeth are coated in enamel, which is the hardest substance in the human body!",
        tractStage: 1
      },
      {
        id: "esophagus",
        number: "02",
        name: "Esophagus",
        aliases: ["esophagus", "oesophagus", "food pipe", "gullet"],
        icon: "esophagus",
        emoji: "🎢",
        color: "#0084FF",
        tag: "Peristaltic Propulsion",
        clue: "I am a muscular tube roughly 25 cm (10 inches) long. I push food downward from the pharynx into the stomach using involuntary, wave-like muscular contractions.",
        hint1: "Often nicknamed the 'food pipe'; connects throat directly to the stomach.",
        hint2: "Begins with 'E' (or 'Oe' in British English). Sounds like 'ee-soff-uh-gus'.",
        funFact: "Thanks to peristalsis, food moves down this tube even if you are hanging upside down!",
        tractStage: 2
      },
      {
        id: "stomach",
        number: "03",
        name: "Stomach",
        aliases: ["stomach", "gastric pouch", "belly"],
        icon: "stomach",
        emoji: "🧪",
        color: "#FF9500",
        tag: "Acid Churning & Proteolysis",
        clue: "I am a J-shaped muscular sac that violently churns food with hydrochloric acid and enzymes, transforming solid food into an acidic semi-liquid slurry called chyme.",
        hint1: "Located in the upper left abdomen; lined with protective mucus against powerful acid.",
        hint2: "A 7-letter word beginning with 'S' and ending with 'H'.",
        funFact: "The stomach's hydrochloric acid is potent enough to dissolve zinc, but a thick layer of mucus protects its lining!",
        tractStage: 3
      },
      {
        id: "small-intestine",
        number: "04",
        name: "Small Intestine",
        aliases: ["small intestine", "small bowel", "duodenum", "jejunum", "ileum", "duodenum jejunum ileum"],
        icon: "small-intestine",
        emoji: "🌿",
        color: "#00B37E",
        tag: "Absorption Epicenter",
        clue: "Despite my 'small' diameter, I am over 6 meters (20 feet) long! I am where roughly 90% of chemical digestion and nutrient absorption into the bloodstream occurs.",
        hint1: "Divided into three segments: Duodenum, Jejunum, and Ileum.",
        hint2: "Two words: starts with 'S' and ends with 'Intestine'.",
        funFact: "If you flattened all the microscopic folds (villi) lining this organ, its surface area would cover a tennis court!",
        tractStage: 4
      },
      {
        id: "large-intestine",
        number: "05",
        name: "Large Intestine",
        aliases: ["large intestine", "colon", "large bowel", "large intestines"],
        icon: "large-intestine",
        emoji: "🌊",
        color: "#7952DE",
        tag: "Water Reclamation",
        clue: "I frame the abdomen like a picture border. My primary duties are reabsorbing water and essential salts from indigestible remnants, preparing feces for elimination.",
        hint1: "Also widely known as the 'colon'; wider in diameter than its neighbor.",
        hint2: "Two words: starts with 'L' and ends with 'Intestine'.",
        funFact: "It reabsorbs over 1.5 liters of water every single day to prevent dehydration!",
        tractStage: 5
      },
      {
        id: "rectum-anus",
        number: "06",
        name: "Rectum",
        aliases: ["rectum", "anus", "rectum and anus", "anal canal"],
        icon: "rectum",
        emoji: "🎯",
        color: "#E0245E",
        tag: "Storage & Elimination",
        clue: "I represent the terminal chamber of the digestive system. I temporarily store formed waste, and sensors signal the brain when it's time for egestion via voluntary sphincters.",
        hint1: "The final 12-15 cm storage section before waste exits the body.",
        hint2: "A 6-letter word beginning with 'R' and ending with 'M'.",
        funFact: "Specialized nerve endings here allow your brain to differentiate between liquid, solid, and gas!",
        tractStage: 6
      }
    ]
  },
  {
    level: 2,
    title: "Level 2: The Helper Squad",
    subtitle: "Accessory organs and biochemical secretions that supercharge digestion",
    badge: "Accessory Squad",
    themeColor: "#0284C7",
    description: "Food never passes through these organs directly, but without their secretions, digestion would halt.",
    cards: [
      {
        id: "salivary-glands",
        number: "01",
        name: "Salivary Glands",
        aliases: ["salivary glands", "salivary gland", "parotid gland", "saliva glands"],
        icon: "salivary",
        emoji: "💧",
        color: "#0284C7",
        tag: "Oral Moisturization",
        clue: "We are three pairs of glands (parotid, submandibular, sublingual) positioned around the mouth. We produce a lubricating fluid rich in amylase to dissolve flavors and protect teeth.",
        hint1: "They secrete about 1 to 1.5 liters of saliva every day.",
        hint2: "Two words: starts with 'Salivary' and ends with 'Glands'.",
        funFact: "You produce enough saliva over a lifetime to fill more than two standard swimming pools!",
        tractStage: 1
      },
      {
        id: "liver",
        number: "02",
        name: "Liver",
        aliases: ["liver", "hepatic organ"],
        icon: "liver",
        emoji: "🏭",
        color: "#DC2626",
        tag: "Biochemical Factory",
        clue: "I am the largest internal organ and a metabolic powerhouse. I filter blood coming from the GI tract, neutralize toxins, store glycogen, and continuously manufacture bile.",
        hint1: "Located in the upper right abdominal quadrant; can regenerate its own tissue.",
        hint2: "A 5-letter word beginning with 'L' and ending with 'R'.",
        funFact: "The liver performs over 500 vital metabolic functions simultaneously!",
        tractStage: 3
      },
      {
        id: "gallbladder",
        number: "03",
        name: "Gallbladder",
        aliases: ["gallbladder", "gall bladder", "cholecyst"],
        icon: "gallbladder",
        emoji: "🥑",
        color: "#65A30D",
        tag: "Bile Concentration",
        clue: "I am a small, pear-shaped sac nestled beneath the liver. I don't produce bile, but I store, concentrate, and squirt it into the duodenum when fatty meals arrive.",
        hint1: "People can live without me if gallstones require surgical removal.",
        hint2: "Compound word beginning with 'Gall' and ending with 'bladder'.",
        funFact: "Bile concentrated inside this organ can be up to 10 times more potent than when freshly made by the liver!",
        tractStage: 4
      },
      {
        id: "pancreas",
        number: "04",
        name: "Pancreas",
        aliases: ["pancreas", "pancreatic gland"],
        icon: "pancreas",
        emoji: "🥖",
        color: "#D97706",
        tag: "Dual Endocrine & Exocrine",
        clue: "I lie horizontally behind the stomach. I deliver a cocktail of digestive enzymes (lipase, protease, amylase) plus alkaline sodium bicarbonate to neutralize burning stomach acid.",
        hint1: "Also produces the hormones insulin and glucagon to balance blood sugar.",
        hint2: "An 8-letter word starting with 'P' and ending with 'S'.",
        funFact: "Its bicarbonate secretion is practically identical to household baking soda, safeguarding your delicate intestinal walls!",
        tractStage: 4
      },
      {
        id: "bile",
        number: "05",
        name: "Bile",
        aliases: ["bile", "gall", "bile fluid"],
        icon: "bile",
        emoji: "🧪",
        color: "#CA8A04",
        tag: "Fat Emulsification",
        clue: "I am a bitter, yellowish-green alkaline fluid. I act like natural dish soap, emulsifying large lipid globules into microscopic droplets so lipases can digest them.",
        hint1: "Synthesized in the liver and stored in the gallbladder.",
        hint2: "A short 4-letter word starting with 'B'. Rhymes with 'mile'.",
        funFact: "Bile's pigments (bilirubin from recycled red blood cells) are what give human waste its characteristic brown color!",
        tractStage: 4
      },
      {
        id: "gastric-juice",
        number: "06",
        name: "Gastric Juice",
        aliases: ["gastric juice", "hydrochloric acid", "hcl", "stomach acid", "gastric acid"],
        icon: "gastric-juice",
        emoji: "⚡",
        color: "#E11D48",
        tag: "Chemical Breakdown",
        clue: "I am a caustic mixture containing hydrochloric acid (pH 1.5 - 2) and pepsinogen. I unravel dense protein structures and eradicate ingested microorganisms before they cause illness.",
        hint1: "Secreted by parietal and chief cells within the gastric mucosa.",
        hint2: "Two words: starts with 'Gastric' and ends with 'Juice' (or named after its acid: HCl).",
        funFact: "The acidity in your stomach is roughly equivalent to car battery acid!",
        tractStage: 3
      }
    ]
  },
  {
    level: 3,
    title: "Level 3: Microscopic & Molecular Mastery",
    subtitle: "Enzymes, cellular structures, and physiological mechanisms",
    badge: "Molecular Mastery",
    themeColor: "#9333EA",
    description: "Delve into the molecular biology, cellular architecture, and biomechanics of human digestion.",
    cards: [
      {
        id: "amylase",
        number: "01",
        name: "Amylase",
        aliases: ["amylase", "salivary amylase", "ptyalin", "pancreatic amylase"],
        icon: "enzyme-carb",
        emoji: "🍞",
        color: "#EA580C",
        tag: "Carbohydrate Catalysis",
        clue: "I am the enzyme responsible for cleaving complex polysaccharides like starches and glycogen into simpler disaccharides such as maltose. I work in the mouth and small intestine.",
        hint1: "If you chew a saltine cracker for 60 seconds without swallowing, I make it taste sweet!",
        hint2: "Starts with 'A', ends with 'ase' (the universal enzyme suffix).",
        funFact: "Human saliva contains such high concentrations of this enzyme that starch begins breaking down within seconds of chewing!",
        tractStage: 1
      },
      {
        id: "pepsin",
        number: "02",
        name: "Pepsin",
        aliases: ["pepsin", "pepsin enzyme"],
        icon: "enzyme-protein",
        emoji: "🥩",
        color: "#9333EA",
        tag: "Protease Catalyst",
        clue: "I am an active protease created when inactive pepsinogen meets stomach acid. I slice peptide bonds within dietary proteins, reducing long polypeptide chains into smaller peptides.",
        hint1: "Named from the Greek word 'pepsis' meaning digestion; namesake of Pepsi-Cola.",
        hint2: "A 6-letter enzyme beginning with 'P' and ending with 'in'.",
        funFact: "It is one of very few human enzymes that thrives in an ultra-acidic pH around 2.0; it denatures in neutral pH!",
        tractStage: 3
      },
      {
        id: "lipase",
        number: "03",
        name: "Lipase",
        aliases: ["lipase", "pancreatic lipase", "gastric lipase"],
        icon: "enzyme-fat",
        emoji: "🧈",
        color: "#EAB308",
        tag: "Lipid Cleavage",
        clue: "I am the primary enzyme charged with breaking down dietary triglycerides into free fatty acids and monoglycerides after bile has emulsified them into micelles.",
        hint1: "The root 'lipo-' refers to fat/lipid in Greek.",
        hint2: "Starts with 'L' and ends with 'ase'.",
        funFact: "Without this enzyme, our bodies cannot absorb fat-soluble vitamins (A, D, E, and K) essential for vision, bones, and immunity!",
        tractStage: 4
      },
      {
        id: "villi",
        number: "04",
        name: "Villi",
        aliases: ["villi", "microvilli", "villus", "intestinal villi"],
        icon: "villi",
        emoji: "🌾",
        color: "#0D9488",
        tag: "Surface Area Multipliers",
        clue: "We are millions of velvety, finger-like projections protruding from the inner lining of the small intestine. Each of us contains a capillary bed and a lacteal for lipid absorption.",
        hint1: "Singular form is 'villus'; micro-projections on our cells are called 'microvilli'.",
        hint2: "A 5-letter anatomical word beginning with 'V' and ending with 'I'.",
        funFact: "These microscopic fingers amplify the intestinal absorptive surface area by an astonishing 30 to 60 times!",
        tractStage: 4
      },
      {
        id: "peristalsis",
        number: "05",
        name: "Peristalsis",
        aliases: ["peristalsis", "peristaltic movement", "peristaltic wave", "peristaltic motion"],
        icon: "peristalsis",
        emoji: "〰️",
        color: "#2563EB",
        tag: "Involuntary Motility",
        clue: "I am the coordinated, alternating contraction and relaxation of circular and longitudinal smooth muscles that propels contents through the esophagus, stomach, and intestines.",
        hint1: "Operates autonomously via the enteric nervous system, continuing even while you sleep.",
        hint2: "An 11-letter biological term starting with 'P' and ending with 'sis'.",
        funFact: "This mechanical wave is so powerful that astronauts can swallow and digest food normally in zero-gravity space!",
        tractStage: 2
      },
      {
        id: "microbiome",
        number: "06",
        name: "Gut Microbiome",
        aliases: ["gut microbiome", "microbiome", "gut flora", "microbiota", "gut bacteria", "intestinal flora"],
        icon: "microbiome",
        emoji: "🦠",
        color: "#DB2777",
        tag: "Symbiotic Ecosystem",
        clue: "We are trillions of symbiotic microorganisms living primarily in the large intestine. We ferment indigestible fiber, synthesize vitamins K and B12, and educate your immune system.",
        hint1: "Our collective genome contains over 100 times more unique genes than human DNA.",
        hint2: "Two words: starts with 'Gut' and ends with 'Microbiome' (or 'Flora').",
        funFact: "Your gut contains up to 2 kg (4.4 lbs) of bacteria — roughly the same weight as the human brain!",
        tractStage: 5
      }
    ]
  }
];

// SVG Icon definitions (Apple-style clean, crisp solid vector paths)
const ORGAN_SVGS = {
  "mouth": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 28C16 18 48 18 52 28C56 38 48 48 32 48C16 48 8 38 12 28Z"/>
    <path d="M12 28C24 36 40 36 52 28"/>
    <path d="M22 32V38M32 34V42M42 32V38" stroke-width="2"/>
    <path d="M24 24H40" stroke-width="2" stroke-dasharray="3 3"/>
  </svg>`,
  
  "esophagus": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 8C26 8 28 20 25 32C22 44 26 56 26 56"/>
    <path d="M38 8C38 8 40 20 37 32C34 44 38 56 38 56"/>
    <path d="M25 22C29 24 33 24 37 22" stroke-width="2"/>
    <path d="M24 34C28 36 32 36 36 34" stroke-width="2"/>
    <path d="M26 46C30 48 34 48 38 46" stroke-width="2"/>
    <circle cx="31" cy="14" r="3" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="30" cy="28" r="3.5" fill="currentColor" fill-opacity="0.4"/>
  </svg>`,

  "stomach": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M28 8V16C28 16 16 18 12 30C8 42 16 52 28 54C40 56 52 48 50 34C48 22 40 16 40 16"/>
    <path d="M28 16C36 20 40 26 40 32C40 38 34 44 26 42" stroke-width="2" stroke-dasharray="2 3"/>
    <path d="M18 36C22 38 28 38 32 36" stroke-width="2"/>
  </svg>`,

  "small-intestine": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="12" y="12" width="40" height="40" rx="20" stroke-opacity="0.2" stroke-dasharray="4 4"/>
    <path d="M20 22C24 18 32 18 36 22C40 26 44 26 48 22"/>
    <path d="M16 30C22 34 26 34 32 30C38 26 42 26 48 30"/>
    <path d="M16 38C22 38 26 44 32 44C38 44 42 38 48 38"/>
    <path d="M22 48C26 50 34 50 38 46"/>
  </svg>`,

  "large-intestine": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M18 48V24C18 17.3726 23.3726 12 30 12H34C40.6274 12 46 17.3726 46 24V48"/>
    <path d="M14 42C14 42 18 40 18 36C18 32 14 30 14 30C14 30 18 28 18 24"/>
    <path d="M50 42C50 42 46 40 46 36C46 32 50 30 50 30C50 30 46 28 46 24"/>
    <path d="M24 16C28 16 30 12 34 12"/>
    <path d="M30 46V54"/>
  </svg>`,

  "rectum": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M26 12H38V34C38 40 42 46 42 50C42 54 38 56 32 56C26 56 22 54 22 50C22 46 26 40 26 34V12Z"/>
    <path d="M26 24H38M26 32H38" stroke-width="2"/>
    <ellipse cx="32" cy="50" rx="5" ry="2" stroke-width="2"/>
  </svg>`,

  "salivary": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M32 10C32 10 20 26 20 38C20 45 25 50 32 50C39 50 44 45 44 38C44 26 32 10 32 10Z"/>
    <circle cx="28" cy="36" r="3" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="36" cy="40" r="2" fill="currentColor" fill-opacity="0.4"/>
    <path d="M32 20C30 25 26 30 26 34" stroke-width="1.8"/>
  </svg>`,

  "liver": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 24C16 16 38 12 50 20C56 24 54 36 46 44C36 54 18 50 14 42C10 34 10 28 12 24Z"/>
    <path d="M32 15C32 24 36 34 44 40" stroke-width="2" stroke-dasharray="3 3"/>
    <circle cx="24" cy="30" r="3" fill="currentColor" fill-opacity="0.2"/>
  </svg>`,

  "gallbladder": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M34 10V18C34 18 42 22 44 30C46 38 42 46 34 50C26 54 20 46 22 36C24 28 30 22 30 18V10"/>
    <path d="M28 32C32 30 36 34 38 38" stroke-width="2"/>
    <path d="M26 10H38" stroke-width="2"/>
  </svg>`,

  "pancreas": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 28C16 22 22 18 28 22L46 30C52 34 52 42 46 44C40 46 34 40 26 38L18 36C16 34 16 30 16 28Z"/>
    <path d="M22 28L44 36" stroke-width="2" stroke-dasharray="2 3"/>
    <path d="M28 26L30 38M36 29L38 41" stroke-width="1.8"/>
  </svg>`,

  "bile": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="32" r="20"/>
    <circle cx="28" cy="26" r="5" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="38" cy="34" r="4" fill="currentColor" fill-opacity="0.2"/>
    <circle cx="26" cy="38" r="3" fill="currentColor" fill-opacity="0.2"/>
    <path d="M18 32C22 30 26 34 30 32C34 30 38 34 42 32C46 30 48 32 48 32"/>
  </svg>`,

  "gastric-juice": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 12H44V20L38 30V48C38 52 34 54 30 54H26C22 54 20 50 20 46V12Z"/>
    <path d="M20 20H44"/>
    <path d="M22 36C26 34 30 38 34 36C38 34 40 36 40 36" stroke-width="2"/>
    <circle cx="28" cy="44" r="2.5" fill="currentColor"/>
    <circle cx="34" cy="41" r="1.5" fill="currentColor"/>
    <path d="M30 6V12"/>
  </svg>`,

  "enzyme-carb": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="32" cy="32" r="18"/>
    <path d="M24 24L40 40M40 24L24 40" stroke-width="2.5"/>
    <circle cx="24" cy="24" r="3" fill="currentColor"/>
    <circle cx="40" cy="40" r="3" fill="currentColor"/>
    <circle cx="40" cy="24" r="3" fill="currentColor"/>
    <circle cx="24" cy="40" r="3" fill="currentColor"/>
  </svg>`,

  "enzyme-protein": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="20" width="36" height="24" rx="12"/>
    <path d="M26 20V44M38 20V44" stroke-width="2" stroke-dasharray="2 3"/>
    <circle cx="20" cy="32" r="3" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="32" cy="32" r="3" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="44" cy="32" r="3" fill="currentColor" fill-opacity="0.3"/>
  </svg>`,

  "enzyme-fat": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M20 16C20 16 28 20 28 32C28 44 20 48 20 48"/>
    <path d="M32 16C32 16 40 20 40 32C40 44 32 48 32 48"/>
    <circle cx="20" cy="16" r="4" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="32" cy="16" r="4" fill="currentColor" fill-opacity="0.3"/>
    <circle cx="44" cy="16" r="4" fill="currentColor" fill-opacity="0.3"/>
    <path d="M44 16C44 16 50 20 50 32C50 44 44 48 44 48"/>
  </svg>`,

  "villi": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 52H52"/>
    <path d="M18 52V24C18 20 24 20 24 24V52"/>
    <path d="M28 52V16C28 12 34 12 34 16V52"/>
    <path d="M38 52V22C38 18 44 18 44 22V52"/>
    <path d="M21 28V36M31 22V36M41 28V36" stroke-width="1.8" stroke-dasharray="2 2"/>
  </svg>`,

  "peristalsis": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 24C20 24 22 18 30 18C38 18 40 24 48 24C52 24 54 22 54 22"/>
    <path d="M12 40C20 40 22 34 30 34C38 34 40 40 48 40C52 40 54 38 54 38"/>
    <circle cx="30" cy="26" r="5" fill="currentColor" fill-opacity="0.4"/>
    <path d="M28 26L34 26" stroke-width="2"/>
    <path d="M31 23L34 26L31 29" stroke-width="2"/>
  </svg>`,

  "microbiome": `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <rect x="14" y="24" width="22" height="12" rx="6" transform="rotate(-20 25 30)"/>
    <rect x="28" y="32" width="24" height="12" rx="6" transform="rotate(30 40 38)"/>
    <circle cx="42" cy="18" r="5"/>
    <circle cx="20" cy="46" r="4"/>
    <circle cx="30" cy="16" r="2" fill="currentColor"/>
    <circle cx="48" cy="48" r="2.5" fill="currentColor"/>
  </svg>`
};
