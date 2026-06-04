import { apiClient } from "../api/api";
import type { IPromotion } from "./promotion.type";

export const PromotionService = {
    async getPromotion(): Promise<IPromotion[]> {
        const res = await apiClient.get(`/api/promotions`);

        console.log(res);
        return res.data.data;
    },
};
