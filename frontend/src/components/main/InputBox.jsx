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
}) => {
  const handleLabelClassName = (className) => {
    return String(
      `absolute text-xs font-semibold px-1 transform translate-x-2 -top-2 bg-white text-current ${className}`
    );
  };

  const handleInputClassName = (className) => {
    return String(
      `w-full border-2 px-3 py-3 text-sm font-semibold bg-white rounded-lg border-gray-300 focus:border-gray-900 text-gray-900 ${className}`
    );
  };

  return (
    <div className='relative text-gray-600 focus-within:text-gray-900'>
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
          className={handleInputClassName(inputClassName)}
        />
      ) : (
        <input
          type={type}
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          className={handleInputClassName(inputClassName)}
        />
      )}
    </div>
  );
};
