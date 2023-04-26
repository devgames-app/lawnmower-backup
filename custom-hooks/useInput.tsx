import { ChangeEvent, useCallback, useState } from 'react';

const useInput = () => {
  const [value, setValue] = useState<string>('');

  return {
    setValue,
    inputProps: {
      onChange: useCallback(
        ({ target }: ChangeEvent<HTMLInputElement>) => setValue(target.value),
        []
      ),
      value,
    },
  };
};

export default useInput;
