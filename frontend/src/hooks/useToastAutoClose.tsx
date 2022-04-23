import { useState, useEffect } from 'react';

type Props = {
  toasts: any;
  setToasts: Function;
  autoClose: Boolean;
  autoCloseTime?: number;
};

export const useToastAutoClose = ({
  toasts,
  setToasts,
  autoClose,
  autoCloseTime,
}: Props) => {
  const [removing, setRemoving] = useState('');

  useEffect(() => {
    if (removing) {
      setToasts((t: any) => t.filter((t: any) => t.id !== removing));
    }
  }, [removing, setToasts]);

  useEffect(() => {
    if (autoClose && toasts.length) {
      const id = toasts[toasts.length - 1].id;
      setTimeout(
        () => setRemoving(id),
        autoCloseTime !== undefined ? autoCloseTime : 5000
      );
    }
  }, [toasts, autoCloseTime, autoClose]);
};
