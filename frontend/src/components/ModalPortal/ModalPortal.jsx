import React, { forwardRef, useImperativeHandle, useState } from 'react';
import ReactDOM from 'react-dom';

import { useModalPortal } from 'hooks';
import { Modal } from 'components';
import { uuid } from 'shared';

export const ModalPortal = forwardRef(({ autoClose, autoCloseTime }, ref) => {
  const [modal, setModal] = useState(null);
  const { loaded, portalId } = useModalPortal();

  const removeModal = () => {
    setModal(null);
  };

  useImperativeHandle(ref, () => ({
    addMessage(modal) {
      modal.id = uuid();
      setModal(modal);
    },
  }));

  return (
    loaded &&
    ReactDOM.createPortal(
      <div className=''>
        {modal && (
          <Modal
            key={modal.id}
            onClose={() => removeModal()}
            mainMessage={modal.mainMessage}
            subMessage={modal.subMessage}
            icon={modal.icon}
            secondaryAction={modal.secondaryAction}
          />
        )}
      </div>,
      document.getElementById(portalId)
    )
  );
});
