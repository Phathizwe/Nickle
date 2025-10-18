// src/components/ui/checkbox.js

import React from 'react';
import PropTypes from 'prop-types';

const Checkbox = ({
  label,
  checked,
  onCheckedChange,
  disabled = false,
  labelPosition = "right",
  size = "md",
}) => {
  // Define size options
  const sizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={`flex items-center space-x-2 ${labelPosition === "left" ? "flex-row-reverse" : "flex-row"}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        disabled={disabled}
        className={`text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 ${sizes[size]} ${disabled ? 'cursor-not-allowed' : ''}`}
      />
      {label && (
        <label
          className={`text-gray-700 ${disabled ? 'opacity-50' : ''}`}
          onClick={() => !disabled && onCheckedChange(!checked)}
        >
          {label}
        </label>
      )}
    </div>
  );
};

// Prop types for validation and to provide default values
Checkbox.propTypes = {
  label: PropTypes.string,
  checked: PropTypes.bool.isRequired,
  onCheckedChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  labelPosition: PropTypes.oneOf(['left', 'right']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Checkbox;
