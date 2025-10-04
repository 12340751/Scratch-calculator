import React, { useRef } from 'react';
import Calculator from './components/Calculator';

const App: React.FC = () => {
  const meowSoundRef = useRef<HTMLAudioElement | null>(null);

  const getMeowSound = () => {
    if (!meowSoundRef.current) {
      meowSoundRef.current = new Audio('https://cdn.freesound.org/previews/131/131660_2398466-lq.mp3');
      meowSoundRef.current.volume = 0.5;
    }
    return meowSoundRef.current;
  };

  const handleCatClick = () => {
    const meowSound = getMeowSound();
    meowSound.currentTime = 0;
    meowSound.play().catch(error => {
      console.error("Error playing sound:", error);
    });
  };

  return (
    <div className="min-h-screen bg-[#A6D9F7] flex flex-col items-center justify-center p-4">
      <img 
        src="https://technovationchallenge.org/wp-content/uploads/2024/06/ScratchCat-Small.png" 
        alt="Clickable Scratch Cat that meows" 
        className="w-24 h-24 mb-4 cursor-pointer transition-transform duration-200 hover:scale-110 active:scale-95"
        aria-hidden="true"
        onClick={handleCatClick}
        title="Click me!"
      />
      <Calculator />
    </div>
  );
};

export default App;
