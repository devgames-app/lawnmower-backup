import { ChangeEvent, useCallback, useState } from 'react';

const useInput = () => {
  const [value, setValue] = useState<string>('');

  return {
    value,
    onChange: useCallback(
      ({ target }: ChangeEvent<HTMLInputElement>) => setValue(target.value),
      []
    ),
  };
};

export default useInput;
