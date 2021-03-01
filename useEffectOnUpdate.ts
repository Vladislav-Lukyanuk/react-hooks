import { DependencyList, EffectCallback, useEffect, useRef } from 'react';

export const useEffectOnUpdate = (effect: EffectCallback, dependencies: DependencyList) => {
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      effect();
    }
  }, dependencies);
};
