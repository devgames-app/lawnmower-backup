import React from 'react';

type Props = {
  id: string;
  spanId?: string;
  children: React.ReactNode;
};

const Button = ({ children, id, spanId }: Props) => {
  return (
    <button
      id={id}
      className='block w-full px-6 py-4 bg-blue-700 hover:bg-blue-900 text-white rounded-full'
      type='submit'
    >
      {spanId && (
        <span id={spanId} className='button-text'>
          {children}
        </span>
      )}
    </button>
  );
};

export default Button;
