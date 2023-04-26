import React, { memo } from 'react';

type Props = {
  span?: boolean;
  children: React.ReactNode;
  hidden?: boolean;
  onClick?: () => void;
  loading?: boolean;
  type?: 'button';
};

const Button = ({ children, span, hidden, loading, onClick, type }: Props) => {
  const handleClick = () => {
    onClick && onClick();
  };
  return (
    <button
      className={
        'block w-full px-6 py-4 bg-blue-700 hover:bg-blue-900 text-white rounded-full' +
        (hidden ? ' hidden ' : '') +
        (loading ? ' loading' : '')
      }
      type={type ? type : 'submit'}
      disabled={loading}
      onClick={handleClick}
    >
      {span ? (
        <span style={{ visibility: loading ? 'hidden' : 'visible' }}>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default memo(Button);
