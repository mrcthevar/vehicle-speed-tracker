export const getAIInsights = (speed) => {
    if (speed > 80) {
      return 'Whoa, slow down! Driving too fast can be risky.';
    } else if (speed < 30) {
      return 'Nice and steady! This speed is great for saving gas.';
    } else {
      return 'Good job! Your speed is just right.';
    }
  };