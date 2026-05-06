import { Level } from './types';

export const DIFFICULTY_CONFIG = {
  easy: { levels: 20, label: 'Easy' },
  medium: { levels: 50, label: 'Medium' },
  hard: { levels: 100, label: 'Hard' },
};

export const LEVELS: Record<string, Level[]> = {
  easy: [
    { id: 1, original: "I never want to see you again", tutorial: "Welcome to UNSAY! Tap 'never' to flip the meaning, then press UNSAY.", requiredRemovals: 1 },
    { id: 2, original: "You are definitely not alone", tutorial: "Remove 'definitely' and 'not' to reveal a darker, simpler truth. You must delete exactly 2 words.", requiredRemovals: 2 },
    { id: 3, original: "She said she did not love him", requiredRemovals: 1 },
    { id: 4, original: "The king is dead, long live the king", requiredRemovals: 4 },
    { id: 5, original: "It is absolutely impossible to win", requiredRemovals: 2 },
    { id: 6, original: "I am definitely going to fail this test", requiredRemovals: 2 },
    { id: 7, original: "You should not trust anyone here", requiredRemovals: 1 },
    { id: 8, original: "Nothing matters in the end anyway", requiredRemovals: 2 },
    { id: 9, original: "There is no way to escape the trap", requiredRemovals: 1 },
    { id: 10, original: "I will never forget what you did", requiredRemovals: 1 },
    { id: 11, original: "Nobody believes in the old legends anymore", requiredRemovals: 2 },
    { id: 12, original: "It was not a dark and stormy night", requiredRemovals: 1 },
    { id: 13, original: "Silence is a sign of great wisdom", requiredRemovals: 3 },
    { id: 14, original: "The truth will always set you free", requiredRemovals: 1 },
    { id: 15, original: "Fear is the mind killer, I will not fear", requiredRemovals: 2 },
    { id: 16, original: "Do not go gentle into that good night", requiredRemovals: 1 },
    { id: 17, original: "Justice is blind and sometimes quite deaf", requiredRemovals: 2 },
    { id: 18, original: "Money cannot buy you true happiness", requiredRemovals: 2 },
    { id: 19, original: "History is written by the victors", requiredRemovals: 2 },
    { id: 20, original: "The cake is a lie", requiredRemovals: 2 },
  ],
  medium: Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    requiredRemovals: 2 + (i % 3),
    original: [
      "The evidence suggests that the witness was lying",
      "The extremely dangerous chemical escaped the lab",
      "We found no reason to believe the story was fake",
      "It was a mistake to think we were safe here",
      "The moon is a cold and lonely place to visit",
      "Every cloud has a silver lining if you look hard",
      "Knowledge is power but ignorance is often bliss",
      "The best things in life are usually quite expensive",
      "Time heals all wounds except for the deep ones",
      "A journey of a thousand miles begins with a step"
    ][i % 10] + (i > 9 ? ` ${i}` : "")
  })),
  hard: Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    requiredRemovals: 3 + (i % 4),
    original: [
      "To be or not to be, that is the question",
      "All that glitters is not gold, but it is shiny",
      "Beauty is in the eye of the beholder or the artist",
      "In the middle of difficulty lies great opportunity",
      "The unexamined life is not worth living for some",
      "Whatever you are, be a good one or a strange one",
      "To live is the rarest thing in the world today",
      "Man is born free and everywhere he is in chains",
      "The only thing we have to fear is fear itself",
      "Hell is other people when the coffee runs out"
    ][i % 10] + (i > 9 ? ` number ${i}` : "")
  }))
};
