import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:pointer-events-none disabled:opacity-50',
          {
            primary:
              'bg-gradient-to-r from-[#ff7f50] to-[#ff6b6b] font-bold rounded-xl text-xl shadow-xl hover:shadow-2xl transition-all duration-300 text-white',
            secondary:
              'bg-gray-100 text-gray-900 hover:bg-gray-200 focus-visible:ring-gray-500',
            outline:
              'border border-gray-300 bg-transparent hover:bg-gray-100 focus-visible:ring-gray-500',
          }[variant],
          {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4',
            lg: 'h-12 px-6 text-lg',
          }[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';