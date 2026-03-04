import { getConfig } from './configLoader.js';

// Content Getters
export function getBanner() {
  const config = getConfig();
  return config?.content?.banner || 'Welcome to Retro Terminal';
}

export function getHelp() {
  const config = getConfig();
  return config?.content?.help || 'Help information not configured.';
}

export function getTutorial(){
  const config = getConfig();
  return config?.content.tutorial || 'Tutorial not configured'
}

export function getGameover(){
  const config = getConfig();
  return config?.content.gameover || 'Gameover'
}

export function getIntro(){
  const config = getConfig();
  return config?.content.intro || 'Intro'
}