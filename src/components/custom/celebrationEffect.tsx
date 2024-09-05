"use client";
import React, {useState} from 'react';
import { CSSProperties } from 'react';

const emojis = ['🎉', '🎊', '✨', '🥳', '🎈']; // Add more emojis as needed




const CelebrationButton = () => {
  const [isCelebrating, setIsCelebrating] = useState(false);

  const handleCelebrate = () => {
    setIsCelebrating(true);
    setTimeout(() => {
      setIsCelebrating(false);
    }, 1000); // emojis disappear after 1 second
  };

  return (
    <div>
      <button onClick={handleCelebrate} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        I'm sold already, I'm ready to hire Will!
      </button>
      {isCelebrating && <CelebrationEffect />}
    </div>
  );
};

export default CelebrationButton;





const CelebrationEffect = () => {
  const emojiSpans = [];

  for (let i = 0; i < 100; i++) {
    const animationDuration = Math.random() * 1 + 1;  // Duration between 1 and 2 seconds
    const angle = Math.random() * 360;  // Degrees
    const distance = 1000 + Math.random() * 100;  // 100% to 200% distance from the center
    const emoji = emojis[Math.floor(Math.random() * emojis.length)];
    const style: CSSProperties = {
      position: 'fixed',
      left: '50%',  // Start from center of the viewport
      top: '50%',
      transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${distance}%)`,
      animation: `move ${animationDuration}s linear`,
      fontSize: '24px'
    };
    emojiSpans.push(<span key={i} style={style}>{emoji}</span>);
  }

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden', pointerEvents: 'none' }}>
      {emojiSpans}
    </div>
  );
};


