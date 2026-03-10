import React, { useState, useEffect } from 'react';
import './SearchBar.css';

function SearchBar() {
  const hints = [
    "Shampoo",
    "Paracetamol",
    "Cough Syrup",
    "Vitamin C",
    "Face Mask",
    "Sanitizer"
  ];

  const [, setIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % hints.length);
        setFade(true);
      }, 300);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
   <div className="searchbar">
  <div className="searchbar__input-container">
    <input
      type="text"
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      className="searchbar__input"
    />
    {inputValue === '' && (
      <div className="searchbar__placeholder" 
     style={{ opacity: inputValue ? 0 : 1 }}>
  What are you looking for? <span className="searchbar__try-text">Try Face Mask</span>
</div>
    )}
  </div>
</div>

  );
}

export default SearchBar;
