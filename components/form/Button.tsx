import React, { memo } from 'react';

type Props = {
  id: string;
  spanId?: string;
  children: React.ReactNode;
  hidden?: boolean;

  loading?: boolean;
};

const Button = ({ children, id, spanId, hidden, loading }: Props) => {
  return (
    <button
      id={id}
      className={
        'block w-full px-6 py-4 bg-blue-700 hover:bg-blue-900 text-white rounded-full' +
        (hidden ? ' hidden ' : '') +
        (loading ? ' loading' : '')
      }
      type='submit'
    >
      {spanId ? (
        <span
          id={spanId}
          className='button-text'
          style={{ visibility: loading ? 'hidden' : 'visible' }}
        >
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default memo(Button);
