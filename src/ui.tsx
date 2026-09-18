import type { ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from 'react';
import type { LucideIcon, LucideProps } from 'lucide-react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'tertiary' | 'secondary' | 'marketingPrimary';
  size?: 'sm' | 'lg';
  iconOnly?: boolean;
  start?: ReactNode;
};
export function Button({ variant, size: _size, iconOnly: _iconOnly, start, children, className = '', ...props }: ButtonProps) {
  return <button className={`local-button ${variant || ''} ${className}`} {...props}>{start}{children}</button>;
}
type FieldProps = { label: string; description?: string };
export function Input({ label, description, ...props }: InputHTMLAttributes<HTMLInputElement> & FieldProps) {
  return <label className="local-field"><span>{label}</span><input {...props}/>{description && <small>{description}</small>}</label>;
}
export function Textarea({ label, description, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps) {
  return <label className="local-field"><span>{label}</span><textarea {...props}/>{description && <small>{description}</small>}</label>;
}
export function Icon({ as: Component, size, ...props }: Omit<LucideProps, 'size'> & { as: LucideIcon; size?: 'sm' | number }) {
  return <Component size={size === 'sm' ? 16 : size ?? 20} {...props}/>;
}
