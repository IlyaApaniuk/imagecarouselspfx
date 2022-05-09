declare interface ICarouselWebPartStrings {
  PropertyPaneDescription: string;
  FontGroupName: string;
  FontSize: string;
  ShouldRenderTitle: string;
  OtherSettings: string;
  ShouldRenderArrows: string;
  AutoplaySpeed: string;
  SliderHeight: string;
  TextPosition: string;
  LeftTextPosion: string;
  CenterTextPosion: string;
  RightTextPosion: string;
}

declare module 'CarouselWebPartStrings' {
  const strings: ICarouselWebPartStrings;
  export = strings;
}
