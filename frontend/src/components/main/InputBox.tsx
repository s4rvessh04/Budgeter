import React from 'react';

type Props = {
  labelClassName?: string;
  inputClassName?: string;
  type?: string;
  name?: string;
  value?: string;
  placeholder?: string;
  labelName?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
  disabled?: boolean;
};

export const InputBox: React.FC<Props> = (props: Props) => {
  const handleLabelClassName = (className: string | undefined) => {
    return String(
      `relative text-xs font-semibold px-1 left-2.5 top-3 bg-white text-current ${className}`
    );
  };

  const handleInputClassName = (className: string | undefined) => {
    return String(
      `w-full border-2 px-3 py-3 text-sm font-semibold bg-white rounded-lg focus:outline-none focus:border-blue-600 border-gray-300 text-gray-900 ${className}`
    );
  };

  return (
    <div className='text-gray-600 focus-within:text-blue-600'>
      <label className={handleLabelClassName(props.labelClassName)}>
        {props.labelName}
      </label>
      {props.required ? (
        <input
          type={props.type}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          required
          disabled={props.disabled}
          className={handleInputClassName(props.inputClassName)}
        />
      ) : (
        <input
          type={props.type}
          name={props.name}
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          disabled={props.disabled}
          className={handleInputClassName(props.inputClassName)}
        />
      )}
    </div>
  );
};
