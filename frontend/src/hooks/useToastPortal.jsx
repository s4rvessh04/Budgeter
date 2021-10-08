import { useState, useEffect } from 'react';

import { uuid } from 'shared';

export const useToastPortal = () => {
  const [loaded, setLoaded] = useState(false);
  const [portalId] = useState(`toast-portal-${uuid()}`);

  useEffect(() => {
    const div = document.createElement('div');
    div.id = portalId;
    div.className = 'lg:w-auto w-full fixed lg:top-5 top-3 lg:right-6';
    document.getElementsByTagName('body')[0].prepend(div);
    setLoaded(true);

    return () => document.getElementsByTagName('body')[0].removeChild(div);
  }, [portalId]);

  return { loaded, portalId };
};
