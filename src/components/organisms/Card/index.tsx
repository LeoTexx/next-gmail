import { forwardRef, ComponentProps } from "react";

import styles from "./card.module.css";

export interface CardProps
  extends Omit<ComponentProps<"div">, "className" | "children"> {
  title: string;
  description: string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, description, ...rest }, ref) => {
    return (
      <div ref={ref} className={styles.card} {...rest}>
        <div className={styles.content}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.callToActionContainer}></div>
        </div>
      </div>
    );
  }
);

export default Card;
