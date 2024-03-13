import React, { useState } from 'react';

function OptionsButtonGroup({ selectedValue, options, onChange }) {
  const [selectedButton, setSelectedButton] = useState(selectedValue);

  const handleButtonClick = (value) => {
    setSelectedButton(value);
    onChange(value);
  };

  return (
    <div className="containerOptions">
      <div className="ButtonContainerOptions">
        {options.map((option) => (
          <button
            key={option.value}
            className={selectedButton === option.value ? 'active' : ''}
            onClick={() => handleButtonClick(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default OptionsButtonGroup;
