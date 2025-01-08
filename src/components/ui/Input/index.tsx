import styles from "./input.module.scss";

type PropsTypes = {
  label?: string;
  name: string;
  type: string;
  placeholder?: string;
  defaultValue?: string;
  disabled?: boolean;
  onChange?: (e: any) => void;
  className?: string;
  inputMode?:
    | "search"
    | "email"
    | "tel"
    | "text"
    | "url"
    | "none"
    | "numeric"
    | "decimal";
  value?: string;
};
const Input = ({
  label,
  name,
  type,
  placeholder,
  defaultValue,
  disabled,
  onChange,
  className,
  inputMode,
  value,
}: PropsTypes) => {
  return (
    <>
      <div className={`${styles.container} ${className}`}>
        {label && (
          <label htmlFor={name} className={styles.container__label}>
            {label}
          </label>
        )}
        <input
          type={type}
          placeholder={placeholder}
          name={name}
          id={name}
          className={styles.container__input}
          defaultValue={defaultValue}
          disabled={disabled}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Input;
