import React, { memo } from 'react';

type Props = {
  id: string;
  spanId?: string;
  children: React.ReactNode;
  hidden?: boolean;
};

const Button = ({ children, id, spanId, hidden }: Props) => {
  return (
    <button
      id={id}
      className={
        'block w-full px-6 py-4 bg-blue-700 hover:bg-blue-900 text-white rounded-full ' +
        (hidden && 'hidden')
      }
      type='submit'
    >
      {spanId ? (
        <span id={spanId} className='button-text'>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default memo(Button);
