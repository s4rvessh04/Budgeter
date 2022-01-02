import React from 'react';

export const InputBox = ({
  labelClassName,
  inputClassName,
  type,
  name,
  value,
  placeholder,
  labelName,
  onChange,
  required,
  disabled = false,
}) => {
  const handleLabelClassName = (className) => {
    return String(
      `relative text-xs font-semibold px-1 left-2.5 top-3 bg-white text-current ${className}`
    );
  };

  const handleInputClassName = (className) => {
    return String(
      `w-full border-2 px-3 py-3 text-sm font-semibold bg-white rounded-lg focus:outline-none focus:border-blue-600 border-gray-300 text-gray-900 ${className}`
    );
  };

  return (
    <div className='text-gray-600 focus-within:text-blue-600'>
      <label className={handleLabelClassName(labelClassName)}>
        {labelName}
      </label>
      {required ? (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          required
          disabled={disabled}
          className={handleInputClassName(inputClassName)}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
          className={handleInputClassName(inputClassName)}
        />
      )}
    </div>
  );
};
