import { DependencyList, RefObject, useEffect, useState } from 'react';

const INITIAL_WIDTH = 0;

export const useWidth = (ref: RefObject<HTMLElement>, ...dependencies: DependencyList): number => {
  const [width, setWidth] = useState(INITIAL_WIDTH);

  useEffect(() => {
    setWidth(ref.current?.clientWidth || INITIAL_WIDTH);
  }, [dependencies, ref]);

  return width;
};
