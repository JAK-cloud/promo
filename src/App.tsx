import { useEffect, useState, useCallback, useRef } from "react";
import type { IPromotion } from "./services/promotion.type";
import { IMAGE_URL } from "./services/imageUrl";
import { PromotionService } from "./services/promotion.services";
import { getSocket, disconnectSocket } from "./services/socket";
import "./App.css";

const AUTOPLAY_INTERVAL = 8000;

function App() {
    const [promotions, setPromotions] = useState<IPromotion[]>([]);
    const [activeSlide, setActiveSlide] = useState(0);
    const autoplayRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const fetchData = useCallback(async () => {
        try {
            const data = await PromotionService.getPromotion();
            setPromotions(data);
        } catch (err) {
            console.error("Failed to fetch promotions", err);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const socket = getSocket();

        socket.on("promotion-refresh", () => fetchData());

        return () => {
            socket.off("promotion-refresh");
            disconnectSocket();
        };
    }, [fetchData]);

    const startAutoplay = useCallback(() => {
        if (autoplayRef.current) clearInterval(autoplayRef.current);

        autoplayRef.current = setInterval(() => {
            setActiveSlide((prev) => (promotions.length > 0 ? (prev + 1) % promotions.length : 0));
        }, AUTOPLAY_INTERVAL);
    }, [promotions.length]);

    useEffect(() => {
        if (promotions.length > 1) {
            startAutoplay();
        }
        return () => {
            if (autoplayRef.current) clearInterval(autoplayRef.current);
        };
    }, [promotions.length, startAutoplay]);

    if (promotions.length === 0) {
        return <div className="promo-fullscreen-empty" />;
    }

    const currentPromo = promotions[activeSlide] || promotions[0];
    const mediaUrl = IMAGE_URL(currentPromo.mediaUrl);

    return (
        <div className="promo-fullscreen-container">
            {currentPromo.mediaType === "image"
                ? mediaUrl && <img key={currentPromo.id} src={mediaUrl} alt={currentPromo.title} className="promo-fullscreen-media fade-in" />
                : mediaUrl && <video key={currentPromo.id} src={mediaUrl} className="promo-fullscreen-media fade-in" muted autoPlay loop playsInline />}
        </div>
    );
}

export default App;
