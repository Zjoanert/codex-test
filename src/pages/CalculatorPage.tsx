import React, { useState } from 'react';
import './CalculatorPage.css';

function factorial(n: number): number {
  if (n < 0) return NaN;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

export default function CalculatorPage() {
  const [input, setInput] = useState('');
  const [ans, setAns] = useState(0);
  const [angleMode, setAngleMode] = useState<'DEG' | 'RAD'>('DEG');
  const append = (value: string) => setInput((prev) => prev + value);

  const evaluate = () => {
    try {
      const replaced = input
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/Ans/g, ans.toString())
        .replace(/sin\(/g, `Math.sin(`)
        .replace(/cos\(/g, `Math.cos(`)
        .replace(/tan\(/g, `Math.tan(`);
      const expr = angleMode === 'DEG'
        ? replaced.replace(/Math\.sin\(([^)]+)\)/g, (_, x) => `Math.sin((${x})*Math.PI/180)`)
            .replace(/Math\.cos\(([^)]+)\)/g, (_, x) => `Math.cos((${x})*Math.PI/180)`)
            .replace(/Math\.tan\(([^)]+)\)/g, (_, x) => `Math.tan((${x})*Math.PI/180)`)
        : replaced;
      // handle factorial
      const factExpr = expr.replace(/(\d+)!/g, (_, n) => `factorial(${n})`);
      // eslint-disable-next-line no-new-func
      const result = Function('factorial', `return ${factExpr}`)(factorial);
      setAns(result);
      setInput('');
    } catch {
      setInput('');
    }
  };

  const clearEntry = () => setInput('');

  return (
    <div className="calculator-page">
      <div className="top-section">
        <button className="history-btn">⏰</button>
        <div className="history-display">Ans = {ans.toFixed(5)}</div>
        <div className="display">{input || '0'}</div>
      </div>
      <div className="grid">
        <button className={angleMode === 'RAD' ? 'active' : ''} onClick={() => setAngleMode('RAD')}>Rad</button>
        <button onClick={() => append('(')}>(</button>
        <button onClick={() => append(')')}>)</button>
        <button onClick={() => append('!')}>x!</button>
        <button onClick={() => append('**')}>**</button>
        <button className={angleMode === 'DEG' ? 'active' : ''} onClick={() => setAngleMode('DEG')}>Deg</button>

        <button onClick={() => append('Inv')}>Inv</button>
        <button onClick={() => append('sin(')}>sin</button>
        <button onClick={() => append('7')}>7</button>
        <button onClick={() => append('8')}>8</button>
        <button onClick={() => append('9')}>9</button>
        <button onClick={() => append('%')}>%</button>
        <button onClick={clearEntry}>CE</button>

        <button onClick={() => append('π')}>π</button>
        <button onClick={() => append('cos(')}>cos</button>
        <button onClick={() => append('4')}>4</button>
        <button onClick={() => append('5')}>5</button>
        <button onClick={() => append('6')}>6</button>
        <button onClick={() => append('/')}>÷</button>

        <button onClick={() => append('e')}>e</button>
        <button onClick={() => append('tan(')}>tan</button>
        <button onClick={() => append('1')}>1</button>
        <button onClick={() => append('2')}>2</button>
        <button onClick={() => append('3')}>3</button>
        <button onClick={() => append('*')}>×</button>

        <button onClick={() => append('Ans')}>Ans</button>
        <button onClick={() => append('e')}>EXP</button>
        <button onClick={() => append('0')}>0</button>
        <button onClick={() => append('.')}>.</button>
        <button className="equals" onClick={evaluate}>=</button>
        <button onClick={() => append('-')}>−</button>

        <div className="empty" />
        <button onClick={() => append('+')}>+</button>
      </div>
      <div className="bottom-bar">Maths solver &gt;</div>
    </div>
  );
}

