import { useCallback, useRef } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect';
import { omit, pick } from 'lodash/fp';

export const useQueryGrabber = <R extends {}, O extends {}>(
  callBack: (newQuery: R & (O | {})) => void,
  defaultRequiredParams: R,
  defaultOptionalParams: O | {} = {}
): [(queryParams: R | O) => void, () => void, () => void] => {
  const requiredSection = useRef<R | null>(null);
  const optionalSection = useRef<O | {} | null>(null);

  useDeepCompareEffect(() => {
    requiredSection.current = defaultRequiredParams;
    optionalSection.current = defaultOptionalParams;
  }, [defaultRequiredParams, defaultOptionalParams]);

  const applyQuery = useCallback(
    (queryParams: R | O) => {
      const requiredParams = pick(Object.keys(defaultRequiredParams), {
        ...requiredSection.current,
        ...queryParams,
      }) as R;

      const optionalParams = omit(Object.keys(defaultRequiredParams), {
        ...optionalSection.current,
        ...queryParams,
      }) as O | {};

      requiredSection.current = requiredParams;
      optionalSection.current = optionalParams;

      callBack({ ...requiredParams, ...optionalParams });
    },
    [callBack, defaultRequiredParams]
  );

  const flushOptionalParams = useCallback(() => {
    optionalSection.current = {};
  }, []);

  const setDefaultParams = useCallback(() => {
    requiredSection.current = defaultRequiredParams;
    optionalSection.current = defaultOptionalParams;
  }, [defaultRequiredParams, defaultOptionalParams]);

  return [applyQuery, flushOptionalParams, setDefaultParams];
};
