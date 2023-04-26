import React, { memo } from 'react';

type Props = {
  placeholder: string;
};

const Input = ({ placeholder, ...props }: Props) => {
  return (
    <input
      type='text'
      className='block w-full border px-6 py-4 rounded-full focus:outline-none'
      placeholder={placeholder}
      required
      {...props}
    />
  );
};

export default memo(Input);
