import { forwardRef, useState, useImperativeHandle } from 'react';
import ReactDOM from 'react-dom';

import { useToastPortal, useToastAutoClose } from 'hooks';
import { Toast } from 'components';
import { uuid } from 'shared';

type T = {
  id: React.Key | null | undefined;
  mainMessage: string | null;
  subMessage: string | undefined;
  icon: null | undefined;
};

type Props = {
  autoClose: boolean;
  autoCloseTime?: number;
};

type MessageHandler = {
  addMessage: (toast: any) => void;
};

export const ToastPortal = forwardRef<MessageHandler, Props>((props, ref) => {
  const { autoClose = false, autoCloseTime = 5000 } = props;
  const [toasts, setToasts] = useState<any>([]);
  const { loaded, portalId } = useToastPortal();

  useToastAutoClose({ toasts, setToasts, autoClose, autoCloseTime });

  const removeToast = (id: React.Key | null | undefined) => {
    setToasts(toasts.filter((t: T) => t.id !== id));
  };

  useImperativeHandle(ref, () => ({
    addMessage(toast) {
      setToasts([...toasts, { ...toast, id: uuid() }]);
    },
  }));

  return (
    <div>
      {loaded &&
        ReactDOM.createPortal(
          <div className='lg:flex-none flex-col items-center'>
            {toasts.map((t: T) => (
              <Toast
                key={t.id}
                onClose={() => removeToast(t.id)}
                mainMessage={t.mainMessage}
                subMessage={t.subMessage}
                icon={t.icon}
              />
            ))}
          </div>,
          document.getElementById(portalId)!
        )}
    </div>
  );
});
