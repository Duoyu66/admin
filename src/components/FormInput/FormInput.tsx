import type { ChangeEvent, InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import styles from './FormInput.module.less';

interface FormFieldBaseProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export interface TextInputProps extends FormFieldBaseProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'name'> {
  type?: 'text' | 'email' | 'password';
}

export interface TextareaProps extends FormFieldBaseProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'> {}

export interface SelectInputProps extends FormFieldBaseProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> {
  options: { label: string; value: string }[];
}

/** 文本输入框 */
export function FormInput({
  label,
  name,
  required,
  error,
  className = '',
  type = 'text',
  value,
  onChange,
  ...rest
}: TextInputProps) {
  return (
    <div className={`${styles.field} ${error ? styles.fieldError : ''} ${className}`}>
      <label
        htmlFor={name}
        className={`${styles.label} ${required ? styles.labelRequired : ''}`}
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className={styles.input}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

/** 多行文本 */
export function FormTextarea({
  label,
  name,
  required,
  error,
  className = '',
  value,
  onChange,
  ...rest
}: TextareaProps) {
  return (
    <div className={`${styles.field} ${error ? styles.fieldError : ''} ${className}`}>
      <label
        htmlFor={name}
        className={`${styles.label} ${required ? styles.labelRequired : ''}`}
      >
        {label}
      </label>
      <textarea
        id={name}
        name={name}
        className={styles.textarea}
        value={value}
        onChange={onChange}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

/** 下拉选择 */
export function FormSelect({
  label,
  name,
  required,
  error,
  className = '',
  options,
  value,
  onChange,
  ...rest
}: SelectInputProps) {
  return (
    <div className={`${styles.field} ${error ? styles.fieldError : ''} ${className}`}>
      <label
        htmlFor={name}
        className={`${styles.label} ${required ? styles.labelRequired : ''}`}
      >
        {label}
      </label>
      <select
        id={name}
        name={name}
        className={styles.select}
        value={value}
        onChange={onChange}
        {...rest}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export type FormChangeHandler = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
