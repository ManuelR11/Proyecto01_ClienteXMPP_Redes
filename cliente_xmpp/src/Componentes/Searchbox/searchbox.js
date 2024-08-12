import React, { useState } from 'react';
import './searchbox.css';

const SearchBox = ({ placeholder, onSearch }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  return (
    <div className="search-box">
      <input 
        type="text" 
        value={inputValue} 
        onChange={handleInputChange} 
        onKeyPress={handleKeyPress} 
        placeholder={placeholder} 
      />
    </div>
  );
};

export default SearchBox;
