import * as React from "react";
import classNames from "classnames";
import { IconButton } from "@fluentui/react/lib/Button";

import styles from "./ArrowButton.module.scss";

export interface IArrowButtonProps {
    direction: "prev" | "next";
    // eslint-disable-next-line react/require-default-props
    onClick?: () => void;
}

const ArrowButton: React.FC<IArrowButtonProps> = ({ direction, onClick }) => (
    <div className={classNames(styles.slideButtonCtn, "arrow-button", direction === "prev" ? styles.prevButton : styles.nextButton)}>
        <IconButton className={styles.slideButton} iconProps={direction === "prev" ? { iconName: "ChevronLeft" } : { iconName: "ChevronRight" }} onClick={onClick} />
    </div>
);

export default React.memo(ArrowButton);
