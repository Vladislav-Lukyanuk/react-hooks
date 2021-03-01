import { useState, useCallback, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { stringify, parse, ParsedQs } from 'qs';
import { isNil } from 'lodash-es';

import { AnyObject } from 'types';

type TQueryParams = {
  [key: string]: {
    initialValue: AnyObject;
    formatter?: (value: string) => AnyObject;
  };
};

const makeSearchString = <T>(values: T) => {
  const newQsValue = stringify(values);

  return `?${newQsValue}`;
};

const chooseValues = <T>(savedQuery: ParsedQs, params: TQueryParams): T =>
  Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      const formatter = (value.formatter && value.formatter) || ((value: string) => value);

      return [
        key,
        isNil(savedQuery[key]) ? value.initialValue : formatter(savedQuery[key] as string),
      ];
    })
  ) as T;

export const useQuery = <T>(params: TQueryParams, useReplace = false): [T, (value: T) => void] => {
  const { search, pathname } = useLocation();
  const { push, replace } = useHistory();

  const historyGo = useReplace ? replace : push;

  const savedQuery = parse(search.replace('?', ''));
  const chosenQuery = chooseValues<T>(savedQuery, params);

  const [value, setValue] = useState<T>(chosenQuery);

  useEffect(() => {
    setValue(chosenQuery);
  }, [chosenQuery, search]);

  const onSetValue = useCallback(
    (newValue: T) => {
      setValue(newValue);

      historyGo({
        pathname,
        search: makeSearchString(newValue),
      });
    },
    [historyGo, pathname]
  );

  return [value, onSetValue];
};
