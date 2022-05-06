import * as React from "react";
import { ServiceScope } from "@microsoft/sp-core-library";
import Slider, { Settings } from "react-slick";
import { Spinner, SpinnerSize } from "@fluentui/react/lib/Spinner";
import { IconButton } from "@fluentui/react/lib/Button";
import classNames from "classnames";

import { ICarouselItem } from "../../models/ICarouselItem";
import CarouselService from "../../services/CarouselService";
import Item from "../Item/Item";
import ArrowButton from "../ArrowButton/ArrowButton";

import styles from "./Carousel.module.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export interface ICarouselProps {
    fontSize: number;
    fontColor: string;
    shouldRenderTitle: boolean;
    shouldRenderArrows: boolean;
    serviceScope: ServiceScope;
    autoplaySpeed: number;
    isEditMode: boolean;
    sliderHeight: number;
}

const Carousel: React.FC<ICarouselProps> = ({ fontSize, fontColor, shouldRenderTitle, shouldRenderArrows, serviceScope, autoplaySpeed, isEditMode, sliderHeight }) => {
    const [items, setItems] = React.useState<ICarouselItem[]>([]);
    const [loading, setLoading] = React.useState<boolean>(false);
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

    React.useEffect(() => {
        const getItems = async () => {
            setLoading(true);
            const service = serviceScope.consume(CarouselService.serviceKey);
            const result = await service.getCarouselItems();

            setItems(result);
            setLoading(false);
        };

        getItems();
    }, [serviceScope]);

    return (
        <div className={classNames(styles.carouselWrapper, isFullScreen ? styles.fullScreenView : "")} style={{ height: isFullScreen ? "100%" : sliderHeight }}>
            {loading ? (
                <Spinner className={styles.spinner} size={SpinnerSize.large} />
            ) : (
                <>
                    <Slider {...settings} arrows={shouldRenderArrows} autoplaySpeed={autoplaySpeed}>
                        {items.map(item => (
                            <Item
                                key={item.id}
                                item={item}
                                fontSize={fontSize}
                                fontColor={fontColor}
                                shouldRenderTitle={shouldRenderTitle}
                                isEditMode={isEditMode}
                                sliderHeight={isFullScreen ? "100%" : sliderHeight}
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
