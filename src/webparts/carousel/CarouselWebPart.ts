import * as React from "react";
import * as ReactDom from "react-dom";
import { DisplayMode, Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneToggle, PropertyPaneSlider } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "CarouselWebPartStrings";
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from "@pnp/spfx-property-controls";

import Carousel, { ICarouselProps } from "./components/Carousel/Carousel";

export interface ICarouselWebPartProps {
    fontSize: number;
    fontColor: string;
    shouldRenderTitle: boolean;
    shouldRenderArrows: boolean;
    autoplaySpeed: number;
    sliderHeight: number;
}

export default class CarouselWebPart extends BaseClientSideWebPart<ICarouselWebPartProps> {
    public render(): void {
        const element: React.ReactElement<ICarouselProps> = React.createElement(Carousel, {
            fontSize: this.properties.fontSize || 14,
            fontColor: this.properties.fontColor,
            shouldRenderTitle: this.properties.shouldRenderTitle,
            shouldRenderArrows: this.properties.shouldRenderArrows,
            serviceScope: this.context.serviceScope,
            autoplaySpeed: isNaN(this.properties.autoplaySpeed) ? 1000 : this.properties.autoplaySpeed * 1000,
            isEditMode: this.displayMode === DisplayMode.Edit,
            sliderHeight: isNaN(this.properties.sliderHeight) ? 200 : this.properties.sliderHeight
        });

        ReactDom.render(element, this.domElement);
    }

    protected onDispose(): void {
        ReactDom.unmountComponentAtNode(this.domElement);
    }

    protected get dataVersion(): Version {
        return Version.parse("1.0");
    }

    protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
        return {
            pages: [
                {
                    header: {
                        description: strings.PropertyPaneDescription
                    },
                    groups: [
                        {
                            groupName: strings.FontGroupName,
                            groupFields: [
                                PropertyPaneSlider("fontSize", {
                                    label: strings.FontSize,
                                    value: this.properties.fontSize,
                                    min: 14,
                                    max: 40
                                }),
                                PropertyFieldColorPicker("fontColor", {
                                    label: "Color",
                                    selectedColor: this.properties.fontColor,
                                    onPropertyChange: this.onPropertyPaneFieldChanged,
                                    properties: this.properties,
                                    disabled: false,
                                    debounce: 300,
                                    isHidden: false,
                                    alphaSliderHidden: false,
                                    style: PropertyFieldColorPickerStyle.Full,
                                    iconName: "Precipitation",
                                    key: "colorFieldId"
                                }),
                                PropertyPaneToggle("shouldRenderTitle", {
                                    label: strings.ShouldRenderTitle,
                                    checked: this.properties.shouldRenderTitle
                                })
                            ]
                        },
                        {
                            groupName: strings.OtherSettings,
                            groupFields: [
                                PropertyPaneToggle("shouldRenderArrows", {
                                    label: strings.ShouldRenderArrows,
                                    checked: this.properties.shouldRenderArrows
                                }),
                                PropertyPaneSlider("autoplaySpeed", {
                                    label: strings.AutoplaySpeed,
                                    value: this.properties.autoplaySpeed,
                                    min: 1,
                                    max: 30
                                }),
                                PropertyPaneSlider("sliderHeight", {
                                    label: strings.SliderHeight,
                                    value: this.properties.sliderHeight,
                                    min: 200,
                                    max: 600
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
