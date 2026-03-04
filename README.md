# Retro-Terminal: Projekt Cisza

A simple Escape Room style terminal emulator game built with JavaScript and Node.js.

# About the Project
This project was created as an engineering thesis for educational and scientific purposes. It serves to demonstrate Escape Room game mechanics in a computer terminal environment.

## Key Features

- **Virtual File System:** Search for clues in game files and hidden directories.
- **Timer:** Beware of time! When it reaches 0, you will lose the game and fail the mission.
- **AI Narration:** The system uses **ElevenLabs** artificial intelligence to generate a suspenseful narrator's voice that introduces the player to the story.
- **Iconic Audio Cues:** In case of failure (Game Over), the system plays the iconic alarm and scream known from the **Metal Gear Solid** series at the end of the game.

## How to Use (locally)

1. Clone the repository to your local machine.
2. Start server e.g. `npx http-server -p 8000`
   2.1. (Optional)* Use `-c-1` flag for disabling caching during development.
3. Open `start.html`
4. Start game

============================================

### References & Credits

* **Retro Terminal (Base Engine):** [https://github.com/ogulkokan/retro-terminal](https://github.com/ogulkokan/retro-terminal)
* **Voice Synthesis:** Narration audio generated using [ElevenLabs](https://elevenlabs.io/)
* **Sound Effects:** Game Over audio inspired by [Metal Gear Solid - Game Over](https://www.youtube.com/watch?v=PbmkzEgYfWI)
