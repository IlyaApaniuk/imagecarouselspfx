import * as React from "react";
import * as ReactDom from "react-dom";
import { DisplayMode, Version } from "@microsoft/sp-core-library";
import { IPropertyPaneConfiguration, PropertyPaneToggle, PropertyPaneSlider, PropertyPaneDropdown } from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import * as strings from "CarouselWebPartStrings";
import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle, PropertyFieldMultiSelect } from "@pnp/spfx-property-controls";

import Carousel, { ICarouselProps } from "./components/Carousel/Carousel";
import TextPosition from "./models/TextPosition";
import { ICarouselItem } from "./models/ICarouselItem";
import CarouselService from "./services/CarouselService";

export interface ICarouselWebPartProps {
    fontSize: number;
    fontColor: string;
    shouldRenderTitle: boolean;
    shouldRenderArrows: boolean;
    autoplaySpeed: number;
    sliderHeight: number;
    textPosition: TextPosition;
    selectedItems: number[];
}

export default class CarouselWebPart extends BaseClientSideWebPart<ICarouselWebPartProps> {
    private items: ICarouselItem[] = [];

    protected async onInit(): Promise<void> {
        const service = this.context.serviceScope.consume(CarouselService.serviceKey);

        this.items = await service.getCarouselItems();

        return super.onInit();
    }

    public render(): void {
        const element: React.ReactElement<ICarouselProps> = React.createElement(Carousel, {
            fontSize: this.properties.fontSize,
            fontColor: this.properties.fontColor,
            shouldRenderTitle: this.properties.shouldRenderTitle,
            shouldRenderArrows: this.properties.shouldRenderArrows,
            selectedItems: this.items.filter(item => {
                return this.properties.selectedItems?.some(id => id === item.id);
            }),
            autoplaySpeed: this.properties.autoplaySpeed * 1000,
            isEditMode: this.displayMode === DisplayMode.Edit,
            sliderHeight: this.properties.sliderHeight,
            textPosition: this.properties.textPosition || TextPosition.Left
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
                                }),
                                PropertyPaneDropdown("textPosition", {
                                    label: strings.TextPosition,
                                    selectedKey: this.properties.textPosition,
                                    options: [
                                        {
                                            key: TextPosition.Left,
                                            text: strings.LeftTextPosion
                                        },
                                        {
                                            key: TextPosition.Center,
                                            text: strings.CenterTextPosion
                                        },
                                        {
                                            key: TextPosition.Right,
                                            text: strings.RightTextPosion
                                        }
                                    ]
                                })
                            ]
                        },
                        {
                            groupName: strings.OtherSettings,
                            groupFields: [
                                PropertyFieldMultiSelect("selectedItems", {
                                    key: "selectedItemsId",
                                    label: strings.SelectedItemsLabel,
                                    selectedKeys: this.properties.selectedItems,
                                    options: this.items.map(item => {
                                        return {
                                            key: item.id,
                                            text: item.title
                                        };
                                    })
                                }),
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
                                    max: 500
                                })
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
