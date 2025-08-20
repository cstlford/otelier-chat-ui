import { ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./Button.module.css";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant: "purpleBlue" | "purplePink" | "semiTransparent" | "neutral";
  size: "sm" | "md" | "lg";
}

export default function Button({
  children,
  type = "button",
  variant,
  size,
  disabled,
  onClick,
  ...rest
}: Props) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.btn} ${styles[variant]} ${styles[size]}`}
      {...rest}
    >
      {children}
    </button>
  );
}
