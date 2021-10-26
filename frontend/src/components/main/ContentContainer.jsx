import React from 'react';

export const ContentContainer = (props) => {
  const mainContainerClass = 'max-h-screen overflow-auto flex flex-col flex-1';

  const handleContainerClasses = (className) => {
    return String(`${mainContainerClass} ${className}`);
  };

  return (
    <div className={handleContainerClasses(props.className)}>
      {props.children}
    </div>
  );
};
