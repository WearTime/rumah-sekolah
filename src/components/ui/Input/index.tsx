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
          onChange={onChange}
        />
      </div>
    </>
  );
};

export default Input;
