import * as React from "react";
import Slider, { Settings } from "react-slick";
import { IconButton } from "@fluentui/react/lib/Button";
import classNames from "classnames";
import * as strings from "CarouselWebPartStrings";

import { ICarouselItem } from "../../models/ICarouselItem";
import Item from "../Item/Item";
import ArrowButton from "../ArrowButton/ArrowButton";
import TextPosition from "../../models/TextPosition";

import styles from "./Carousel.module.scss";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface ICarouselProps {
    fontSize: number;
    fontColor: string;
    shouldRenderTitle: boolean;
    shouldRenderArrows: boolean;
    autoplaySpeed: number;
    isEditMode: boolean;
    sliderHeight: number;
    textPosition: TextPosition;
    selectedItems: ICarouselItem[];
}

const Carousel: React.FC<ICarouselProps> = ({
    fontSize,
    fontColor,
    shouldRenderTitle,
    shouldRenderArrows,
    autoplaySpeed,
    isEditMode,
    selectedItems,
    sliderHeight,
    textPosition
}) => {
    const [isFullScreen, setFullScreen] = React.useState<boolean>(false);

    const settings: Settings = {
        dots: false,
        infinite: true,
        speed: 500,
        autoplay: true,
        pauseOnHover: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        className: styles.sliderWrapper,
        prevArrow: <ArrowButton direction="prev" />,
        nextArrow: <ArrowButton direction="next" />
    };

    return (
        <div className={classNames(styles.carouselWrapper, isFullScreen ? styles.fullScreenView : "")} style={{ height: isFullScreen ? "100%" : sliderHeight }}>
            {selectedItems.length === 0 ? (
                <div className={styles.titleWrapper}>
                    <h4>{strings.NoItemsSelectedLabel}</h4>
                </div>
            ) : (
                <>
                    <Slider {...settings} arrows={shouldRenderArrows} autoplaySpeed={autoplaySpeed}>
                        {selectedItems.map(item => (
                            <Item
                                key={item.id}
                                item={item}
                                fontSize={fontSize}
                                fontColor={fontColor}
                                shouldRenderTitle={shouldRenderTitle}
                                isEditMode={isEditMode}
                                sliderHeight={isFullScreen ? "100%" : sliderHeight}
                                bottomPersents={isFullScreen ? "25%" : "10%"}
                                textPosition={textPosition}
                            />
                        ))}
                    </Slider>
                    <IconButton
                        className={styles.fullScreenButton}
                        iconProps={isFullScreen ? { iconName: "BackToWindow" } : { iconName: "FullScreen" }}
                        onClick={() => setFullScreen(isEditMode ? false : !isFullScreen)}
                    />
                </>
            )}
        </div>
    );
};

export default Carousel;
