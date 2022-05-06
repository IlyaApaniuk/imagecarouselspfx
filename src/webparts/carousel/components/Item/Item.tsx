import * as React from "react";

import { ICarouselItem } from "../../models/ICarouselItem";

import styles from "./Item.module.scss";

export interface IItemProps {
    item: ICarouselItem;
    fontSize: number;
    fontColor: string;
    shouldRenderTitle: boolean;
    isEditMode: boolean;
    sliderHeight: number | string;
}

const Item: React.FC<IItemProps> = ({ item, fontSize, fontColor, shouldRenderTitle, isEditMode, sliderHeight }) => {
    return (
        <div className={styles.itemWrapper} style={{ height: sliderHeight }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href={!item.link || isEditMode ? undefined : item.link} data-interception="off" rel="noopener noreferrer" target="_blank">
                <img src={item.imageSrc} className={styles.image} alt="logo" height={sliderHeight} />
                {shouldRenderTitle && (
                    <div className={styles.titleWrapper} style={{ color: fontColor }}>
                        <span style={{ fontSize }}>{item.title}</span>
                        <span className={styles.description}>{item.description}</span>
                    </div>
                )}
            </a>
        </div>
    );
};

export default Item;
