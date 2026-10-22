/**
 * DigestBeach - Snakes & Ladders Edition
 * Educational Curriculum, Cards, and 36-Tile Snakes & Ladders Board Map
 */

// 36-Tile Snakes & Ladders Board Configuration (6 rows x 6 columns)
const SNAKES_AND_LADDERS_CONFIG = {
  totalTiles: 36,
  rows: 6,
  cols: 6,
  // 🪜 Ladders: startTile (bottom) -> endTile (top)
  ladders: [
    { from: 3, to: 16, title: "Saliva Slide Up! 🪜", text: "Good chewing and saliva made food glide right up!" },
    { from: 8, to: 22, title: "Fiber Power Ladder! 🪜", text: "Healthy crunchy veggies boosted your digestion!" },
    { from: 15, to: 26, title: "Bile Supercharge! 🪜", text: "Bile bubbles melted all the fats! Climb up!" },
    { from: 21, to: 32, title: "Villi Fast-Track! 🪜", text: "Millions of tiny villi grabbed nutrients! Zoom up!" }
  ],
  // 🐍 Snakes / Beach Water-Slides: fromTile (head) -> toTile (tail)
  snakes: [
    { from: 12, to: 2, title: "Forgot to Chew! 🐍", text: "Gulp! Food was swallowed whole. Slide back down to chew!" },
    { from: 17, to: 4, title: "Fizzy Soda Hiccup! 🐍", text: "Burp! Too much fizz made you hiccup back down!" },
    { from: 29, to: 14, title: "Need More Water! 🐍", text: "Dehydration slowed things down. Drink water and slide down!" },
    { from: 35, to: 18, title: "Spicy Pepper Gurgle! 🐍", text: "Whoa, spicy! Tummy rumble slides you back to recover!" }
  ],
  // Special tiles (Organ stops & beach bonuses)
  tiles: {
    1: { type: "organ", cardId: "mouth", name: "Mouth 👄", tag: "Start: Chewing Station" },
    5: { type: "organ", cardId: "esophagus", name: "Food Pipe 🎢", tag: "Swallow Wave" },
    7: { type: "bonus", bonusType: "coconut", stars: 30, name: "Coconut Break 🥥", text: "Chilled coconut water! +30 Bonus Stars!" },
    9: { type: "organ", cardId: "stomach", name: "Stomach 🧪", tag: "Acid Blender" },
    11: { type: "bonus", bonusType: "starfish", stars: 40, name: "Lucky Starfish ⭐", text: "You found a lucky starfish! +40 Bonus Stars!" },
    13: { type: "organ", cardId: "liver", name: "Liver 🏭", tag: "Body Factory" },
    19: { type: "organ", cardId: "gallbladder", name: "Gallbladder 🥑", tag: "Bile Pouch" },
    20: { type: "bonus", bonusType: "shell", stars: 50, name: "Pearl Shell 🐚", text: "Shiny beach treasure! +50 Bonus Stars!" },
    23: { type: "organ", cardId: "pancreas", name: "Pancreas 🥖", tag: "Juice Guard" },
    25: { type: "bonus", bonusType: "roll", name: "Beach Ball 🏐", text: "Extra roll! Roll the dice again!" },
    27: { type: "organ", cardId: "small-intestine", name: "Small Intestine 🌿", tag: "Vitamin Sponge" },
    31: { type: "organ", cardId: "large-intestine", name: "Large Intestine 🌊", tag: "Water Saver" },
    34: { type: "organ", cardId: "microbiome", name: "Gut Bugs 🦠", tag: "Friendly Helpers" },
    36: { type: "finish", name: "Grand Finish 🏆", tag: "Digestive Champion!" }
  }
};

// Educational Cards for Quiz Stops
const ALL_ORGAN_CARDS = [
  {
    id: "mouth",
    name: "Mouth",
    emoji: "👄",
    color: "#F97316",
    tag: "Chewing & Tasting",
    childRiddle: "I am on your face! Your teeth chew food here, and your spit makes it soft and wet so you can swallow.",
    options: ["👄 The Mouth", "🧪 The Stomach", "🌿 The Intestine", "👂 The Ear"],
    correctIndex: 0,
    hint: "It has teeth, a tongue, and smiles for photos!",
    funFact: "Your teeth are covered in enamel, which is even harder than your bones!"
  },
  {
    id: "esophagus",
    name: "Food Pipe (Esophagus)",
    emoji: "🎢",
    color: "#0EA5E9",
    tag: "The Food Slide",
    childRiddle: "I am a long, stretchy muscular slide behind your throat. I squeeze food down to your tummy like a wave!",
    options: ["🎢 Food Pipe (Esophagus)", "👃 Nose", "👄 Mouth", "👣 Feet"],
    correctIndex: 0,
    hint: "It connects your throat directly to your stomach.",
    funFact: "Muscles squeeze food down, so you could swallow even if you were upside down on monkey bars!"
  },
  {
    id: "stomach",
    name: "Stomach",
    emoji: "🧪",
    color: "#F59E0B",
    tag: "Tummy Blender",
    childRiddle: "I am a stretchy pouch in your tummy. I churn food with special juices like a blender until it's soupy!",
    options: ["🧪 Stomach", "🧠 Brain", "👄 Mouth", "👁️ Eye"],
    correctIndex: 0,
    hint: "Your tummy growls here when you are hungry!",
    funFact: "Your stomach makes a protective coat of slime so its strong acids don't hurt it!"
  },
  {
    id: "liver",
    name: "Liver",
    emoji: "🏭",
    color: "#EF4444",
    tag: "Body's Super Factory",
    childRiddle: "I am the largest organ inside your body! I clean your blood, store sugar for energy, and make green bile to break down fats.",
    options: ["🏭 Liver", "👃 Nose", "🦷 Tooth", "👣 Toe"],
    correctIndex: 0,
    hint: "Located under your right ribs. It can regrow if a piece is hurt!",
    funFact: "The liver works on more than 500 different body jobs at the same time!"
  },
  {
    id: "gallbladder",
    name: "Gallbladder",
    emoji: "🥑",
    color: "#84CC16",
    tag: "Bile Backpack",
    childRiddle: "I am a tiny green pear-shaped pouch hiding under the liver. I save up bile and squirt it when you eat french fries or cheese!",
    options: ["🥑 Gallbladder", "👂 Ear", "🧠 Brain", "🦴 Ribs"],
    correctIndex: 0,
    hint: "It stores the green juice made by the liver.",
    funFact: "The bile inside is super concentrated — like extra-strong dish soap for oily food!"
  },
  {
    id: "pancreas",
    name: "Pancreas",
    emoji: "🥖",
    color: "#F59E0B",
    tag: "Juice & Sugar Guard",
    childRiddle: "I sit quietly behind your stomach. I make enzyme juices to break down food, and insulin to balance sugar in your blood!",
    options: ["🥖 Pancreas", "👄 Mouth", "👁️ Eye", "🫀 Heart"],
    correctIndex: 0,
    hint: "Helps control your energy and blood sugar.",
    funFact: "Its juice works just like baking soda to keep your tummy acid from burning!"
  },
  {
    id: "small-intestine",
    name: "Small Intestine",
    emoji: "🌿",
    color: "#22C55E",
    tag: "Vitamin Sponge",
    childRiddle: "I am a super-long, wiggly tube in your belly. I soak up all the good vitamins, energy, and nutrients from food into your blood!",
    options: ["🌿 Small Intestine", "🦴 Leg Bone", "🎢 Food Pipe", "👃 Nose"],
    correctIndex: 0,
    hint: "Even though it's called 'small', it is very long (about 20 feet)!",
    funFact: "If you stretched it out straight, it would be longer than 3 grown-ups lying head-to-toe!"
  },
  {
    id: "large-intestine",
    name: "Large Intestine",
    emoji: "🌊",
    color: "#A855F7",
    tag: "Water Saver",
    childRiddle: "I wrap around your tummy like a picture frame. I soak up water so your body stays hydrated, and pack what's left over.",
    options: ["🌊 Large Intestine", "🫀 Heart", "👄 Mouth", "🧪 Stomach"],
    correctIndex: 0,
    hint: "Also known as the 'colon'. Wider than the small intestine.",
    funFact: "It drinks back up to 6 cups of water from your food every single day so you don't get thirsty!"
  },
  {
    id: "microbiome",
    name: "Gut Microbiome",
    emoji: "🦠",
    color: "#EC4899",
    tag: "Friendly Belly Bugs",
    childRiddle: "We are trillions of friendly little bacteria living happily in your gut. We help digest veggies, make vitamins, and fight off bad germs!",
    options: ["🦠 Gut Microbiome (Friendly Bugs)", "🦟 Mosquitoes", "🐜 Ants", "🪰 Houseflies"],
    correctIndex: 0,
    hint: "Friendly, healthy bacteria living in your belly.",
    funFact: "Your belly has more friendly gut bugs than there are stars in the Milky Way galaxy!"
  }
];

// 25+ Engaging Questions Asked On Every Dice Roll!
const DIGESTIVE_ROLL_QUESTIONS = [
  {
    id: "q-mouth-entry",
    topic: "The Mouth 👄",
    question: "Where does your food begin its journey through your body?",
    emoji: "👄",
    options: ["👄 In your Mouth", "👂 In your Ears", "🦶 On your Feet", "👃 In your Nose"],
    correctIndex: 0,
    hint: "You smile and chew with it every day!",
    funFact: "Your mouth produces about 1 to 2 liters of saliva every single day!"
  },
  {
    id: "q-teeth-job",
    topic: "Teeth 🦷",
    question: "What do your teeth do to food when you take a bite?",
    emoji: "🦷",
    options: ["🦷 Bite, crush, and grind food", "🎨 Paint food purple", "❄️ Freeze food cold", "🎶 Sing songs to food"],
    correctIndex: 0,
    hint: "They make big food chunks into tiny soft bits.",
    funFact: "Tooth enamel is the hardest substance in the entire human body!"
  },
  {
    id: "q-saliva-job",
    topic: "Saliva 💧",
    question: "What does spit (saliva) do to help you digest food?",
    emoji: "💧",
    options: ["💧 Wets food & softens it to swallow", "🧊 Turns food to ice", "🔥 Makes food spicy", "🎈 Turns food into a balloon"],
    correctIndex: 0,
    hint: "It keeps your mouth moist and starts breaking down carbs.",
    funFact: "Saliva contains special enzymes called amylase that start breaking down bread and starches immediately!"
  },
  {
    id: "q-esophagus-tube",
    topic: "Food Pipe 🎢",
    question: "What is the name of the stretchy tube connecting your mouth to your stomach?",
    emoji: "🎢",
    options: ["🎢 Food Pipe (Esophagus)", "🛝 Playground Slide", "🚲 Bicycle Chain", "🎺 Brass Trumpet"],
    correctIndex: 0,
    hint: "It squeezes food downward with gentle muscular waves.",
    funFact: "The wave of muscular squeezes that pushes food down is called peristalsis!"
  },
  {
    id: "q-stomach-blender",
    topic: "The Stomach 🧪",
    question: "What does your stomach act like to churn and mix food?",
    emoji: "🧪",
    options: ["🥣 A churning blender with digestive juices", "⏰ An alarm clock", "📻 A music radio", "🔦 A flashlight"],
    correctIndex: 0,
    hint: "It sloshes and grinds food into a smooth liquid soup.",
    funFact: "Food stays in your stomach for about 2 to 4 hours while getting churned!"
  },
  {
    id: "q-stomach-acid",
    topic: "Stomach Juices ⚡",
    question: "Why does the stomach make strong acid?",
    emoji: "⚡",
    options: ["⚡ To break down proteins & kill bad germs", "💡 To light up your belly", "❄️ To freeze dinner", "🫧 To blow bubblegum bubbles"],
    correctIndex: 0,
    hint: "It sanitizes food and helps digestive enzymes do their work.",
    funFact: "Stomach acid is strong enough that your body grows a fresh stomach lining every few days!"
  },
  {
    id: "q-liver-bile",
    topic: "The Liver 🏭",
    question: "What special green juice does the liver make to help break down oily fats?",
    emoji: "🏭",
    options: ["🟢 Bile", "🧃 Apple Juice", "🥛 Chocolate Milk", "🥫 Tomato Ketchup"],
    correctIndex: 0,
    hint: "It acts just like dish soap washing grease off a pan!",
    funFact: "The liver is the only internal organ that can naturally regrow itself if injured!"
  },
  {
    id: "q-gallbladder-pouch",
    topic: "Gallbladder 🥑",
    question: "Where is bile stored until you eat foods with healthy fats?",
    emoji: "🥑",
    options: ["🥑 Gallbladder", "🎒 School Backpack", "🧤 Winter Mittens", "🧢 Sun Hat"],
    correctIndex: 0,
    hint: "A small pear-shaped pouch tucked right under the liver.",
    funFact: "When oily food enters your intestine, the gallbladder squirts bile like a water pistol!"
  },
  {
    id: "q-pancreas-sugar",
    topic: "The Pancreas 🥖",
    question: "What does the pancreas make to balance sugar and give your body steady energy?",
    emoji: "🥖",
    options: ["🥖 Insulin & digestive juices", "🎈 Helium gas", "🧂 Table salt", "🍋 Lemon seeds"],
    correctIndex: 0,
    hint: "It helps your cells absorb glucose for playtime energy.",
    funFact: "The pancreas also neutralizes stomach acid so it doesn't irritate your intestines!"
  },
  {
    id: "q-small-intestine-length",
    topic: "Small Intestine 🌿",
    question: "Why is the small intestine super long (about 20 feet)?",
    emoji: "🌿",
    options: ["🌿 To soak up as many vitamins & nutrients as possible", "🎪 To jump rope with", "📦 To store toys", "🧶 To knit sweaters"],
    correctIndex: 0,
    hint: "It has a huge surface area covered in tiny absorbent villi.",
    funFact: "If you flattened all the tiny folds in the small intestine, it would cover a whole tennis court!"
  },
  {
    id: "q-villi-sponges",
    topic: "Tiny Villi 🧽",
    question: "What are the tiny finger-like bumps inside the small intestine called?",
    emoji: "🧽",
    options: ["🧽 Villi", "🌲 Pine needles", "🐾 Cat paws", "🪶 Bird feathers"],
    correctIndex: 0,
    hint: "They act like microscopic sponges absorbing vitamins into blood.",
    funFact: "Villi increase the intestine's absorption power by more than 30 times!"
  },
  {
    id: "q-large-intestine-water",
    topic: "Large Intestine 🌊",
    question: "What is the main superpower of the large intestine?",
    emoji: "🌊",
    options: ["🌊 Drinking back leftover water to keep you hydrated", "Chewing crunchy apples", "Smelling flowers", "Hearing loud music"],
    correctIndex: 0,
    hint: "It reclaims cups of water so your body stays refreshed.",
    funFact: "The large intestine absorbs about 1.5 liters of water back into your body every day!"
  },
  {
    id: "q-microbiome-friends",
    topic: "Gut Microbiome 🦠",
    question: "Who are the trillions of friendly helpers living in your belly?",
    emoji: "🦠",
    options: ["🦠 Friendly gut bacteria (Microbiome)", "🐜 Ants from the garden", "🐟 Goldfish", "🐝 Honeybees"],
    correctIndex: 0,
    hint: "Healthy bacteria that love fruits, vegetables, and yogurt!",
    funFact: "Your microbiome helps produce Vitamin K, which helps cuts and scrapes clot and heal!"
  },
  {
    id: "q-water-importance",
    topic: "Healthy Habits 💧",
    question: "Why is drinking clean water important for your digestive system?",
    emoji: "💧",
    options: ["💧 It keeps food moving smoothly and avoids tummy ache", "🪨 It turns tummy food into rocks", "🫧 It turns your skin blue", "⚡ It makes you run at lightspeed"],
    correctIndex: 0,
    hint: "Water keeps everything soft, hydrated, and gliding along.",
    funFact: "Your digestive system uses about 9 liters of liquid every day to process your meals!"
  },
  {
    id: "q-fiber-power",
    topic: "Fiber Power 🥦",
    question: "Which foods give you crunchy fiber that helps your intestines work best?",
    emoji: "🥦",
    options: ["🥦 Crunchy veggies, apples, and whole grains", "🍬 Sticky chewy candy", "🥤 Fizzy soda pop", "🍦 Melting ice cream bars"],
    correctIndex: 0,
    hint: "Fruits and veggies with crisp skin have lots of fiber!",
    funFact: "Fiber acts like a gentle body broom, sweeping everything through your digestive tract!"
  },
  {
    id: "q-chewing-speed",
    topic: "Mindful Eating ⏳",
    question: "Why is it best to chew your food slowly instead of gulping it down?",
    emoji: "⏳",
    options: ["⏳ It prevents choking and gives your stomach an easier job", "So you can swallow whole hamburgers", "So your lunch turns into soup instantly", "To practice counting to 100"],
    correctIndex: 0,
    hint: "Chewing well gives your tummy smaller pieces to dissolve.",
    funFact: "Digestion starts before you even take a bite — just smelling good food makes your mouth water!"
  },
  {
    id: "q-tongue-taste",
    topic: "The Tongue 👅",
    question: "What do the taste buds on your tongue help you do?",
    emoji: "👅",
    options: ["👅 Taste sweet, salty, sour, and savory flavors", "👂 Listen to secrets", "👁️ See in the dark", "👃 Smell beach breeze"],
    correctIndex: 0,
    hint: "It helps you enjoy chocolate, strawberries, and pretzels!",
    funFact: "You have about 10,000 taste buds, and they replace themselves every 2 weeks!"
  },
  {
    id: "q-stomach-growl",
    topic: "Tummy Rumblings 🔊",
    question: "Why does your tummy sometimes rumble or growl when you are hungry?",
    emoji: "🔊",
    options: ["🔊 Muscular waves squeeze air and fluid in an empty tummy", "A tiny kitten is purring inside", "A battery needs recharging", "Your ribs are clattering"],
    correctIndex: 0,
    hint: "When the tummy is empty, digestive wave echoes sound louder!",
    funFact: "The medical word for stomach rumbling is 'borborygmus' (say: bor-bo-RIG-mus)!"
  },
  {
    id: "q-blood-delivery",
    topic: "Nutrient Transport 🩸",
    question: "How do healthy vitamins get from your intestine to your muscles and brain?",
    emoji: "🩸",
    options: ["🩸 Through your bloodstream highway", "🚲 On a miniature skateboard", "🪁 Carried by balloons", "Through your shoelaces"],
    correctIndex: 0,
    hint: "Your heart pumps blood that carries nutrients everywhere.",
    funFact: "Within seconds of being absorbed, nutrients travel via the portal vein straight to your liver!"
  },
  {
    id: "q-healthy-snacks",
    topic: "Super Foods 🍌",
    question: "Which snack gives your digestive system vitamins, fiber, and steady energy?",
    emoji: "🍌",
    options: ["🍌 A fresh banana with a cup of water", "A bowl of pure white sugar", "A slice of raw tree bark", "Empty air"],
    correctIndex: 0,
    hint: "It's yellow, delicious, and easy to peel!",
    funFact: "Bananas contain pectin, a type of fiber that helps keep your gut calm and happy!"
  },
  {
    id: "q-digestive-time",
    topic: "The Big Journey 🗺️",
    question: "About how long does the complete digestive journey take from start to finish?",
    emoji: "🗺️",
    options: ["🗺️ About 24 to 48 hours (1 to 2 days)", "⏱️ Exactly 3 seconds", "🗓️ 10 whole years", "100 days"],
    correctIndex: 0,
    hint: "Your body works carefully and thoroughly overnight to absorb nutrients.",
    funFact: "Your digestive system works on your dinner even while you are fast asleep!"
  },
  {
    id: "q-stomach-coat",
    topic: "Stomach Protection 🛡️",
    question: "How does the stomach protect its own walls from its strong acid?",
    emoji: "🛡️",
    options: ["🛡️ A thick, slippery coat of protective mucus", "A metal shield", "It wears a rain jacket", "It turns off at night"],
    correctIndex: 0,
    hint: "A special protective slime layer coats the inside.",
    funFact: "Without this mucus coat, stomach acid could burn through the stomach lining!"
  },
  {
    id: "q-gut-bugs-food",
    topic: "Feeding Friendly Bugs 🥣",
    question: "What food do your friendly gut bacteria love to eat the most?",
    emoji: "🥣",
    options: ["🥣 Plant fiber from fruits, oats, and veggies", "Plastic wrappers", "Salty potato chips only", "Ice cubes"],
    correctIndex: 0,
    hint: "They ferment colorful plant fibers and turn them into healthy vitamins!",
    funFact: "Eating yogurt with active cultures adds billions of helpful friendly bacteria to your tummy!"
  },
  {
    id: "q-epiglottis-door",
    topic: "The Little Trapdoor 🚪",
    question: "What tiny flap folds down over your windpipe when you swallow so food doesn't go down the wrong pipe?",
    emoji: "🚪",
    options: ["🚪 Epiglottis", "Eyelid", "Fingernail", "Ear canal"],
    correctIndex: 0,
    hint: "It acts like a railroad switch, directing food to the esophagus and air to the lungs.",
    funFact: "If you talk and laugh while swallowing, the epiglottis might open slightly, causing a cough!"
  }
];

// Helper to get a random question (avoiding immediate repeats)
let _lastQuestionId = null;
function getRandomDigestiveQuestion() {
  const available = DIGESTIVE_ROLL_QUESTIONS.filter(q => q.id !== _lastQuestionId);
  const q = available[Math.floor(Math.random() * available.length)];
  _lastQuestionId = q.id;
  return q;
}
