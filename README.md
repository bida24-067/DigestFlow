# 🏖️ DigestBeach: Educational Digestive System Games

A vibrant tropical beach board game and puzzle experience designed for primary school students (ages 6–11) to master the human digestive system through playful mechanics, kid-friendly multiple choice questions, and interactive puzzle blasting.

---

## 🌟 Game Modes

### 1. 🎲 Tropical Snakes & Ladders Board Game
- **Interactive 6×6 Board (36 Tiles)**: Follows a winding serpentine path across a sunny beach, from **Tile 1 (START: Mouth & Teeth Station 👄)** to **Tile 36 (Grand Finish Champion 🏆)**.
- **Question on Every Dice Roll**:
  - Every time the 3D beach die is rolled, an engaging digestive question is presented with 4 large tap buttons and a helpful hint.
  - **1 Point Awarded** for every correct answer, tracked live in the scoreboard!
- **Bot Turns Require Player Input**:
  - When playing vs **Barnaby Crab (CPU)**, Crab rolls the die and asks the student to help solve the question!
  - Correct answers award points to the student and Crab happily scuttles forward!
- **🌟 Lucky 6 Rewards**:
  - Rolling a **6** triggers the **Double Question Challenge** (2 questions in sequence!).
  - Earn up to **+2 Points** (1 per question).
  - Gives a **Free Extra Roll** after leaping 6 steps forward!
- **Full Journey Progress Visualization**:
  - **Live Progress Bar**: Fills smoothly from 0% to 100% with contextual organ updates (`Tile 14 of 36 • Liver & Bile Factory`).
  - **Milestone Checkpoints**: 👄 Mouth (1) ➔ 🎢 Food Pipe (5) ➔ 🧪 Stomach (9) ➔ 🏭 Liver (13) ➔ 🌿 Small Intestine (27) ➔ 🌊 Large Intestine (31) ➔ 🏆 Finish (36).
  - **Sand Footstep Trail**: All visited squares glow with a warm tropical sand trail and `👣` footsteps marking the journey completed so far.
  - **Active Tile Pulse**: The current tile is highlighted with an animated ocean glow.
- **Classic Ladders & Sea Snakes**:
  - 🪜 **Bamboo Ladders**: Climb up for great chewing, fiber, and bile boosts.
  - 🐍 **Sea Snakes**: Slide down when swallowing whole food or drinking fizzy soda.

---

### 2. 🧩 Digestive Block Blast Mini-Game
- **In-App Toggle**: Switch between the board game and Block Blast instantly using the top navigation pill (`🧩 Block Blast Mini-Game` / `🎲 Back to Board Game`).
- **Fluid Drag & Drop (Touch & Mouse)**:
  - Drag shapes directly from the tray onto the 8×8 grid with live finger/cursor tracking and glowing drop shadow.
  - Touch-optimized with an ergonomic finger offset so you can clearly see the board underneath.
- **Tap-to-Select Accessible Fallback**:
  - Tap any piece in the tray to select it, then tap anywhere on the board to drop it!
- **Educational Digestive Word Matching**:
  - Pieces hold digestive words (`Mouth 👄`, `Stomach 🧪`, `Liver 🏭`) and meanings (`Chews food`, `Acid blender`, `Cleans blood`).
  - **Adjacent Match Blast**: Placing a Word block directly touching its Meaning block triggers an instant golden match burst (`+250 Points`)!
  - **Line Blasts**: Fill complete 8-block rows or columns to trigger block blasts, sound effects, and combo multipliers (`x2`, `x3`, etc.).

---

## 🚀 How to Run Locally

Because the project is built with vanilla HTML5, CSS3, and modern Web APIs, no build tools or package managers are required!

Simply open `index.html` in any browser, or run a local server:

```bash
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your web browser.
