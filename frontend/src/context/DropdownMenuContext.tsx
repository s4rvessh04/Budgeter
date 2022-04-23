import React from 'react';

interface Obj {
  dropdownRef?: React.RefObject<HTMLElement>;
  isActive?: Boolean;
  setIsActive?: Function;
  onClick?: Function;
  // selected?: Array<any>;
  selected?: boolean;
  setSelected?: Function;
}

export const DropdownMenuContext = React.createContext<Obj>({
  onClick: () => {},
});
