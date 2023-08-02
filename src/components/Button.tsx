import Link from "next/link";
import styles from "./button.module.css";

type ButtonProps = {
  text: string;
  onClick?: () => void;
  variant: "primary" | "primary2" | "secondary" | "delete";
  icon?: React.ReactNode;
  href?: string;
};

export function Button(props: ButtonProps) {
  if (props.href) {
    return (
      <Link
        href={props.href}
        className={
          props.variant === "primary"
            ? styles.primary
            : props.variant === "primary2"
            ? styles.primary2
            : props.variant === "delete"
            ? styles.delete
            : styles.secondary
        }
      >
        {props.text}
        {props.icon}
      </Link>
    );
  }

  return (
    <button
      onClick={props.onClick}
      className={
        props.variant === "primary"
          ? styles.primary
          : props.variant === "primary2"
          ? styles.primary2
          : props.variant === "delete"
          ? styles.delete
          : styles.secondary
      }
      type={props.onClick ? "button" : "submit"}
    >
      {props.text}
      {props.icon}
    </button>
  );
}
