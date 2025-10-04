import React, { useState } from 'react';
import CalculatorButton from './CalculatorButton';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [isResult, setIsResult] = useState(false);

  const formatDisplayValue = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return value; // Return original value if not a number (e.g. "Error")

    if (Math.abs(num) > 999999999 || (Math.abs(num) < 0.0000001 && num !== 0)) {
        return num.toExponential(4);
    }
    try {
        return new Intl.NumberFormat('en-US', {
            maximumFractionDigits: 8,
        }).format(num);
    } catch {
        return value; 
    }
  };

  const getDisplayFontSize = (text: string) => {
    if (text.length > 15) return 'text-3xl';
    if (text.length > 9) return 'text-4xl';
    return 'text-6xl';
  }
  
  const inputDigit = (digit: string) => {
    if (isResult) {
      setDisplay(digit);
      setIsResult(false);
    } else {
      if (display === '0') {
        setDisplay(digit);
      } else {
        setDisplay(display + digit);
      }
    }
  };

  const getLastNumberInfo = () => {
    // Regex to find the last number in the string.
    // It can be an integer or a float, and can be negative.
    // It correctly handles cases like '10+-5' by finding '-5'.
    const match = display.match(/(-?[\d.]+)$/);

    if (match) {
        const numberPart = match[0];
        const expressionPart = display.substring(0, display.length - numberPart.length);
        return { expressionPart, numberPart };
    }

    // Fallback for when the display doesn't end in a number 
    return { expressionPart: display, numberPart: '' };
  }

  const inputDecimal = () => {
    if (isResult) {
        setDisplay('0.');
        setIsResult(false);
        return;
    }
    
    const lastChar = display.slice(-1);
    // If last char is an operator, start a new number with '0.'
    if (['+', '-', '×', '÷'].includes(lastChar)) {
        setDisplay(display + '0.');
        return;
    }
    
    // Otherwise, check the last number part to see if it already has a decimal
    const { numberPart } = getLastNumberInfo();
    if (!numberPart.includes('.')) {
        setDisplay(display + '.');
    }
  };


  const clearAll = () => {
    setDisplay('0');
    setIsResult(false);
  };

  const toggleSign = () => {
    if (display === 'Error') return;
    
    if (isResult) {
      setDisplay(String(parseFloat(display) * -1));
      return;
    }

    const { expressionPart, numberPart } = getLastNumberInfo();
    
    if (numberPart && parseFloat(numberPart) !== 0) {
        const newNumberPart = String(parseFloat(numberPart) * -1);
        setDisplay(expressionPart + newNumberPart);
    }
  };

  const inputPercent = () => {
     if (display === 'Error') return;

     if (isResult) {
      setDisplay(String(parseFloat(display) / 100));
      return;
    }
    
    const { expressionPart, numberPart } = getLastNumberInfo();
    
    if (numberPart) {
        const newNumberPart = String(parseFloat(numberPart) / 100);
        setDisplay(expressionPart + newNumberPart);
    }
  };

  const handleOperator = (nextOperator: string) => {
    if (display === 'Error') {
      setDisplay('0' + nextOperator);
      return;
    }
    setIsResult(false);
    const lastChar = display.slice(-1);

    if (['+', '-', '×', '÷'].includes(lastChar)) {
      setDisplay(display.slice(0, -1) + nextOperator);
    } else {
      setDisplay(display + nextOperator);
    }
  };

  const handleEquals = () => {
    const lastChar = display.slice(-1);
    if (isResult || ['+', '-', '×', '÷', '.'].includes(lastChar)) {
        return;
    }
    
    try {
      const expressionToEvaluate = display
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
        
      const result = new Function('return ' + expressionToEvaluate)();
      
      if (!isFinite(result)) {
        setDisplay('Error');
      } else {
        setDisplay(String(result));
      }
      setIsResult(true);
    } catch (error) {
      setDisplay('Error');
      setIsResult(true);
    }
  };

  return (
    <div className="w-full max-w-xs sm:max-w-sm mx-auto bg-[#F0F0F0] rounded-3xl shadow-2xl p-6 space-y-4 border-4 border-gray-600">
      <div className={`bg-white text-[#4D4D4D] ${getDisplayFontSize(display)} text-right font-bold p-4 rounded-lg break-words border-2 border-gray-400 h-24 flex items-center justify-end`}>
        <span>{isResult ? formatDisplayValue(display) : display}</span>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {/* Function Keys - Green */}
        <CalculatorButton onClick={clearAll} className="bg-[#0FBD8C] text-white">AC</CalculatorButton>
        <CalculatorButton onClick={toggleSign} className="bg-[#0FBD8C] text-white">+/-</CalculatorButton>
        <CalculatorButton onClick={inputPercent} className="bg-[#0FBD8C] text-white">%</CalculatorButton>
        
        {/* Operator Keys - Blue */}
        <CalculatorButton onClick={() => handleOperator('÷')} className="bg-[#4C97FF] text-white">÷</CalculatorButton>

        {/* Number Keys - Orange */}
        <CalculatorButton onClick={() => inputDigit('7')} className="bg-[#FFAB19] text-white">7</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('8')} className="bg-[#FFAB19] text-white">8</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('9')} className="bg-[#FFAB19] text-white">9</CalculatorButton>
        
        {/* Operator Key - Blue */}
        <CalculatorButton onClick={() => handleOperator('×')} className="bg-[#4C97FF] text-white">×</CalculatorButton>

        {/* Number Keys - Orange */}
        <CalculatorButton onClick={() => inputDigit('4')} className="bg-[#FFAB19] text-white">4</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('5')} className="bg-[#FFAB19] text-white">5</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('6')} className="bg-[#FFAB19] text-white">6</CalculatorButton>
        
        {/* Operator Key - Blue */}
        <CalculatorButton onClick={() => handleOperator('-')} className="bg-[#4C97FF] text-white">-</CalculatorButton>
        
        {/* Number Keys - Orange */}
        <CalculatorButton onClick={() => inputDigit('1')} className="bg-[#FFAB19] text-white">1</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('2')} className="bg-[#FFAB19] text-white">2</CalculatorButton>
        <CalculatorButton onClick={() => inputDigit('3')} className="bg-[#FFAB19] text-white">3</CalculatorButton>

        {/* Operator Key - Blue */}
        <CalculatorButton onClick={() => handleOperator('+')} className="bg-[#4C97FF] text-white">+</CalculatorButton>
        
        {/* Number Keys - Orange */}
        <CalculatorButton onClick={() => inputDigit('0')} className="bg-[#FFAB19] text-white col-span-2">0</CalculatorButton>
        <CalculatorButton onClick={inputDecimal} className="bg-[#FFAB19] text-white">.</CalculatorButton>
        
        {/* Equals Key - Blue */}
        <CalculatorButton onClick={handleEquals} className="bg-[#4C97FF] text-white">=</CalculatorButton>
      </div>
    </div>
  );
};

export default Calculator;