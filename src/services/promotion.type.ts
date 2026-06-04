export interface IPromotion {
    id: number;
    title: string;
    mediaType: "image" | "video";
    mediaUrl: string;
    isActive: boolean;
    createdAt: string;
}
