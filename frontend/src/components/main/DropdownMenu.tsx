import React from 'react';

import { DropdownMenuContext } from 'context';

type Props = {
  children: JSX.Element | JSX.Element[];
};

type ButtonProps = {
  icon?: JSX.Element;
  iconPosition?: String;
  text?: String;
};

type MenuListProps = {
  position: String;
  alignItems: String;
  children: JSX.Element | JSX.Element[];
};

type ItemProps = {
  text: string;
  value: string | number;
  onClick?: Function;
};

const classBuilder = (mainClass: String, addClass: String) => {
  return `${mainClass} ${addClass}`;
};

export const DropdownMenu = ({ children }: Props) => {
  const dropdownRef = React.useRef<HTMLElement>(null);

  const [isActive, setIsActive] = React.useState(false);
  const [selected, setSelected] = React.useState(false);

  const onClick = () => setIsActive(!isActive);

  React.useEffect(() => {
    const pageClickEvent = (e: MouseEvent) => {
      if (
        dropdownRef.current !== null &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setIsActive(!isActive);
    };

    if (isActive) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => window.removeEventListener('click', pageClickEvent);
  }, [isActive]);

  return (
    <DropdownMenuContext.Provider
      value={{
        dropdownRef,
        isActive,
        setIsActive,
        onClick,
        selected,
        setSelected,
      }}>
      <div className='relative'>{children}</div>
    </DropdownMenuContext.Provider>
  );
};

const Button = ({ icon, iconPosition, text }: ButtonProps) => {
  const mainClass =
    'flex items-center justify-between relative bg-gray-100 p-2.5 ml-2.5 rounded-lg';

  return (
    <DropdownMenuContext.Consumer>
      {({ onClick }) => (
        <button
          onClick={() => onClick && onClick()}
          className={classBuilder(
            mainClass,
            iconPosition?.toLowerCase() === 'left'
              ? 'flex-row'
              : 'flex-row-reverse'
          )}>
          {icon} <span>{text}</span>
        </button>
      )}
    </DropdownMenuContext.Consumer>
  );
};

const MenuList = ({ position, children, alignItems }: MenuListProps) => {
  const mainClass =
    'absolute font-semibold w-44 mt-2 shadow-md border border-gray-200 bg-white rounded-xl p-2 duration-200';

  return (
    <DropdownMenuContext.Consumer>
      {({ dropdownRef, isActive }) => (
        <nav
          ref={dropdownRef}
          className={classBuilder(
            mainClass,
            `${position} ${isActive ? 'visible aDD-enter' : 'aDD-exit'}`
          )}>
          <ul
            className={classBuilder('list-none w-full', `text-${alignItems}`)}>
            {children}
          </ul>
        </nav>
      )}
    </DropdownMenuContext.Consumer>
  );
};

const Item = ({ value, text, onClick }: ItemProps) => {
  const mainClass = 'px-2 py-2 hover:bg-gray-100 rounded-md mb-1 w-full';
  return (
    <DropdownMenuContext.Consumer>
      {({ selected, setSelected }) => (
        <li
          className={classBuilder(mainClass, selected ? 'bg-gray-100' : '')}
          value={value}
          onClick={() => {
            if (onClick) onClick(value);
            if (setSelected) setSelected(!selected);
          }}>
          {text}
        </li>
      )}
    </DropdownMenuContext.Consumer>
  );
};

DropdownMenu.MenuList = MenuList;
DropdownMenu.Button = Button;
MenuList.Item = Item;
