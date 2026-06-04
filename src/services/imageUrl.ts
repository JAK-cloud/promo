export const IMAGE_URL = (mediaUrl: string | null | undefined) => {
    if (!mediaUrl) return undefined;

    return `${import.meta.env.VITE_PORTAL_URL}/${mediaUrl}`;
};
