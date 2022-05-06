import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import { PageContext } from "@microsoft/sp-page-context";

import constants from "../config/constants";
import { ICarouselItem } from "../models/ICarouselItem";
import parseCarouselItems from "../utils/parser";

export default class CarouselService {
    public static readonly serviceKey = ServiceKey.create<CarouselService>("carousel:CarouselService", CarouselService);

    private spHttpClient: SPHttpClient;

    private pageContext: PageContext;

    constructor(serviceScope: ServiceScope) {
        serviceScope.whenFinished(() => {
            this.spHttpClient = serviceScope.consume(SPHttpClient.serviceKey);
            this.pageContext = serviceScope.consume(PageContext.serviceKey);
        });
    }

    public async getCarouselItems(): Promise<ICarouselItem[]> {
        try {
            const params = `$select=${constants.listFields.id},${constants.listFields.title},${constants.listFields.imageSrc},${constants.listFields.link},${constants.listFields.description}`;
            const url = this.listUrlBuilder(constants.listName, "items", null, params);
            const listItems = await this.getListItems<ICarouselItem>(url, parseCarouselItems);

            return listItems;
        } catch (e) {
            console.error(`Error on getting items - ${e}`);

            throw new Error(e);
        }
    }

    private async getListItems<T>(url: string, parser?: (data: unknown[]) => T[]): Promise<T[]> {
        try {
            const response: SPHttpClientResponse = await this.spHttpClient.get(url, SPHttpClient.configurations.v1, {
                headers: {
                    Accept: "application/json;odata.metadata=none"
                }
            });

            if (!response.ok) {
                const error = await response.json();

                throw new Error(error?.error?.message);
            }

            const result = (await response.json()).value;

            return parser ? parser(result) : result;
        } catch (e) {
            console.error(e);

            throw new Error(e);
        }
    }

    private listUrlBuilder(listTitle: string, type: "items" | "fields" = "items", itemId?: number, params?: string): string {
        const apiUrl = `${this.pageContext.web.absoluteUrl}/_api/web/lists/GetByTitle('${listTitle}')/${type}${itemId ? `(${itemId})` : ""}${params ? `?${params}` : ""}`;

        return apiUrl;
    }
}
