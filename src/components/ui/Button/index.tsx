import styles from "./button.module.scss";

type PropsTypes = {
  type: "button" | "submit" | "reset" | undefined;
  onClick?: () => void;
  children: React.ReactNode;
  variant?: string;
  className?: string;
  disabled?: boolean;
};
const Button = ({
  type,
  onClick,
  children,
  variant = "primary",
  className,
  disabled,
}: PropsTypes) => {
  return (
    <>
      <button
        type={type}
        onClick={onClick}
        className={`${styles.button} ${styles[variant]} ${className}`}
        disabled={disabled}
      >
        {children}
      </button>
    </>
  );
};

export default Button;
