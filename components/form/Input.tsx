import React from 'react';

type Props = {
  id: string;
  placeholder: string;
};

const Input = ({ id, placeholder }: Props) => {
  return (
    <input
      type='text'
      name={id}
      id={id}
      className='block w-full border px-6 py-4 rounded-full focus:outline-none'
      placeholder={placeholder}
      required
    />
  );
};

export default Input;
