import { Howl } from 'howler';

// Using some standard frequencies or public URLs if possible
// For now, I'll use placeholders or simple synth-like sounds via Web Audio if Howler can take them
// Or I'll find some royalty free URLs

export const sounds = {
  click: new Howl({
    src: ['https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tink.wav'],
    volume: 0.4
  }),
  success: new Howl({
    src: ['https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/clap.wav'],
    volume: 0.5
  }),
  fail: new Howl({
    src: ['https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/boom.wav'],
    volume: 0.4
  }),
  transition: new Howl({
    src: ['https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/snare.wav'],
    volume: 0.4
  }),
  sparkle: new Howl({
    src: ['https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/ride.wav'],
    volume: 0.4
  })
};

export const playSound = (name: keyof typeof sounds) => {
  try {
    const sound = sounds[name];
    if (sound.state() === 'unloaded') {
      sound.load();
    }
    sound.play();
  } catch (e) {
    console.warn(`Sound play failed for ${name}:`, e);
  }
};

// Add error listeners to sounds
Object.entries(sounds).forEach(([name, sound]) => {
  sound.on('loaderror', (id, err) => console.error(`Audio Load Error (${name}):`, err));
  sound.on('playerror', (id, err) => console.error(`Audio Play Error (${name}):`, err));
});

export const stopSound = (name: keyof typeof sounds) => {
  sounds[name].stop();
};
