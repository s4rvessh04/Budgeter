import { useState, useEffect } from 'react';

import { uuid } from 'shared';

export const useModalPortal = () => {
  const [loaded, setLoaded] = useState(false);
  const [portalId] = useState(`modal-portal-${uuid()}`);

  useEffect(() => {
    const div = document.createElement('div');
    div.id = portalId;
    div.className = 'z-50 absolute backdrop-filter backdrop-blur-sm';
    document.getElementsByTagName('body')[0].prepend(div);
    setLoaded(true);

    return () => document.getElementsByTagName('body')[0].removeChild(div);
  }, [portalId]);

  return { loaded, portalId };
};
