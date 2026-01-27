import { ChangeEvent, MouseEventHandler } from 'react';
import clsx from 'clsx';

interface ButtonProps {
  variant: 'primary' | 'secondary';
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  children: React.ReactNode;
}

const Button = ({ variant, onClick, disabled, children }: ButtonProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded px-4 py-2 focus:ring-2 focus:ring-offset-2 focus:outline-none',
        variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
        variant === 'secondary' && 'bg-gray-600 text-white hover:bg-gray-700',
        disabled && 'cursor-not-allowed opacity-50',
        !disabled && 'cursor-pointer'
      )}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
export default Button;
