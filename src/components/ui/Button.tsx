import type { JSX } from 'preact';

export interface ButtonProps {
  /** Text shown inside the button. */
  label: string;
  /** Visual emphasis. */
  variant?: 'primary' | 'secondary';
  /** Disable interaction and dim the button. */
  disabled?: boolean;
  onClick?: JSX.MouseEventHandler<HTMLButtonElement>;
}

const VARIANTS: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary: 'bg-brand-600 text-white hover:bg-brand-700',
  secondary: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
};

export function Button({
  label,
  variant = 'primary',
  disabled = false,
  onClick,
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      class={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]}`}
    >
      {label}
    </button>
  );
}
