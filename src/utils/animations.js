import { Easing } from 'react-native-reanimated';

// Spring configurations
export const SPRING_CONFIG = {
  gentle: { damping: 15, stiffness: 120, mass: 1 },
  bouncy: { damping: 10, stiffness: 150, mass: 0.8 },
  snappy: { damping: 20, stiffness: 300, mass: 0.8 },
  slow: { damping: 20, stiffness: 80, mass: 1.2 },
};

// Timing presets
export const TIMING = {
  fast: { duration: 200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  normal: { duration: 350, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  slow: { duration: 500, easing: Easing.bezier(0.25, 0.1, 0.25, 1) },
  entrance: { duration: 600, easing: Easing.bezier(0.0, 0.0, 0.2, 1) },
};

// Stagger delay between items
export const STAGGER_DELAY = 50; // ms between each card

// Card press animation values
export const CARD_PRESS = {
  scale: 0.97,
  duration: 100,
};

// Moti animation presets for declarative use
export const motiPresets = {
  fadeInUp: {
    from: { opacity: 0, translateY: 30 },
    animate: { opacity: 1, translateY: 0 },
    transition: { type: 'timing', duration: 500, easing: Easing.bezier(0.0, 0.0, 0.2, 1) },
  },
  fadeInRight: {
    from: { opacity: 0, translateX: 40 },
    animate: { opacity: 1, translateX: 0 },
    transition: { type: 'timing', duration: 400, easing: Easing.bezier(0.0, 0.0, 0.2, 1) },
  },
  fadeIn: {
    from: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { type: 'timing', duration: 400 },
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', damping: 15, stiffness: 150 },
  },
  bounceIn: {
    from: { opacity: 0, scale: 0.3 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: 'spring', damping: 12, stiffness: 200 },
  },
};
