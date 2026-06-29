# Football Penalty Shootout

A simple browser-based football penalty shootout game built with HTML, CSS, and vanilla JavaScript.

## Overview

In this game, you try to score as many penalties as possible against an AI goalkeeper. Choose a shot direction, beat the keeper, and build your score before you run out of lives.

## Features

- Player name and country selection
- Three shot directions: left, center, and right
- AI goalkeeper that dives randomly
- Score tracking
- 3 lives per game
- High score saved in `localStorage`
- Simple sound effects using the Web Audio API
- Responsive layout for desktop and mobile

## How to Run

1. Open `index.html` in a web browser.
2. Click **Start Game**.
3. Enter your name and choose a country.
4. Pick a shot direction and try to score goals.

## How to Play

- A goal is scored when your shot direction is different from the goalkeeper's dive.
- If the goalkeeper guesses your direction, you lose a life.
- You start with 3 lives.
- The game ends when all lives are lost.

## Controls

- Click or tap one of the direction buttons:
  - Left
  - Center
  - Right

## Game Screens

- **Welcome Screen**: Start the game or view the about section
- **Setup Screen**: Enter player name and select country
- **Game Screen**: Take penalty shots and track score/lives
- **Game Over Screen**: See your final score and best score
- **About Screen**: Read instructions and rules

## File Structure

```text
Penalty Shootout Game/
├── index.html
├── styles.css
├── script.js
└── README.md
```

## Notes

- The high score is stored locally in your browser.
- No external libraries are required.
- The game works completely offline once the files are opened in a browser.

