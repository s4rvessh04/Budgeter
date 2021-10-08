import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';

import { useToastPortal } from 'hooks';
import { Toast } from 'components';
import { uuid } from 'shared';

export const ToastPortal = forwardRef(({ autoClose, autoCloseTime }, ref) => {
  const [toasts, setToasts] = useState([]);
  const { loaded, portalId } = useToastPortal();

  const removeToast = (id) => {
    setToasts(toasts.filter((t) => t.id !== id));
  };

  useImperativeHandle(ref, () => ({
    addMessage(toast) {
      setToasts([...toasts, { ...toast, id: uuid() }]);
    },
  }));

  return (
    loaded &&
    ReactDOM.createPortal(
      <div className='lg:box-border flex-col items-center'>
        {toasts.map((t) => (
          <Toast
            key={t.id}
            onClose={() => removeToast(t.id)}
            mainMessage={t.mainMessage}
            subMessage={t.subMessage}
            icon={t.icon}
          />
        ))}
      </div>,
      document.getElementById(portalId)
    )
  );
});
