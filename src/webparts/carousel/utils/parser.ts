import constants from "../config/constants";
import { ICarouselItem } from "../models/ICarouselItem";

export default function parseCarouselItems(items: unknown[]): ICarouselItem[] | null {
    try {
        return items.map(i => {
            return {
                id: i[constants.listFields.id],
                title: i[constants.listFields.title],
                imageSrc: i[constants.listFields.imageSrc]?.Url,
                link: i[constants.listFields.link]?.Url,
                description: i[constants.listFields.description]
            } as ICarouselItem;
        });
    } catch (e) {
        throw new Error(e);
    }
}
