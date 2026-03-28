# 📟 Retro-Terminal: Projekt Cisza

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Technology: JavaScript](https://img.shields.io/badge/Technology-JavaScript-f7df1e.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

> **Project Silence** is an interactive Escape Room game set within a retro terminal emulator environment. Developed as an engineering thesis, this project merges puzzle-solving mechanics with the educational aspects of navigating text-based operating systems.

---

## 📝 About the Project

This project serves as a playable game and a demonstration of porting classic Escape Room mechanics into a virtual terminal environment. The primary research goal was to evaluate how a text-based interface impacts player immersion and how AI-driven narration can effectively build suspense.

### Core Project Pillars:
* **Modular Architecture:** The system is designed with a clear, modular structure, allowing for easy expansion of new puzzles, file modules, and game logic.
* **AI Narration:** Integration of **ElevenLabs** voice synthesis to create a unique, atmospheric, and high-stakes narrative experience.
* **Interactive File System:** A realistic simulation of a VFS (Virtual File System) that requires analytical thinking and command-line proficiency from the player.

---

## 🚀 Key Features

### 📂 Virtual File System (VFS)
Explore hidden directories, search through system logs, and uncover encrypted clues. The system supports standard terminal commands, providing a realistic "hacker" feel.

### ⏱️ Time Pressure
A built-in countdown timer constantly tracks the seconds remaining. If the clock hits zero, the mission fails immediately, forcing the player to make quick, decisive moves under pressure.

### 🎙️ Audio Immersion
* **AI Narrator:** The system utilizes the ElevenLabs API to deliver voice-over lines that introduce the story and guide the player.
* **Iconic Audio Cues:** Features legendary sound effects inspired by the **Metal Gear Solid** series (Scream, Mission Complete) to signal critical game states (Victory/Game Over).

---

## 🛠️ Tech Stack

The game is built using modern web technologies to ensure high performance and ease of deployment:

* **Frontend:** Vanilla JavaScript, HTML5, CSS3 (Retro CRT styling).
* **Backend:** Node.js (for local development and server-side logic).
* **Audio Engine:** ElevenLabs API (Speech Synthesis).
* **Base Engine:** [Retro Terminal](https://github.com/ogulkokan/retro-terminal) – heavily modified and extended with custom logic modules.

---

## 💻 Local Setup

Follow these steps to run the game on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mdczapla/MWHER.git

2. **Start the server:**
   You can use any HTTP server. The simplest way is using http-server via npm:

   ```bash
   npx http-server -p 8000 -c-1

      The -c-1 flag disables caching, which is recommended during testing.

3. **Access the game:**
   Open your browser and navigate to: http://localhost:8000/start.html

4. **Begin the mission:** 
   Follow the narrator's instructions displayed on the terminal.
