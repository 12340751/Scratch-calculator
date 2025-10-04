import React from 'react';

interface CalculatorButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const CalculatorButton: React.FC<CalculatorButtonProps> = ({ onClick, children, className }) => {
  const baseClasses = "text-3xl sm:text-4xl font-bold rounded-xl h-16 sm:h-20 flex items-center justify-center focus:outline-none transition-all duration-150";
  const hoverClasses = "hover:brightness-110 active:brightness-90 transform active:scale-95";
  
  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${hoverClasses} ${className}`}
    >
      {children}
    </button>
  );
};

export default CalculatorButton;
