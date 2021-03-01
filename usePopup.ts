import { useState, useEffect, useMemo, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { useQuery } from './useQuery';

const INITIAL_POPUP_STATE = {
  popup: {
    initialValue: null,
  },
};

let timeout: number;

type TUsePopupState = {
  popup: string | null;
};

export const usePopupState = () => {
  const { goBack } = useHistory();
  const [{ popup }] = useQuery<TUsePopupState>(INITIAL_POPUP_STATE);
  const [mountedPopup, setMountedPopup] = useState<string | null>(popup);

  useEffect(() => {
    if (popup) {
      timeout && clearTimeout(timeout);
      setMountedPopup(popup);

      return;
    }

    timeout = window.setTimeout(() => {
      setMountedPopup(null);
    }, 300);
  }, [popup]);

  useEffect(() => {
    return () => {
      timeout && clearTimeout(timeout);
    };
  }, []);

  const isOpened = useMemo(() => Boolean(popup), [popup]);

  const onClose = useCallback(() => {
    goBack();
  }, [goBack]);

  return {
    mountedPopup,
    isOpened,
    onClose,
  };
};
