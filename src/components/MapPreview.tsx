import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Props = {
    lat: number;
    lng: number;
    onClick?: () => void;
};

export default function MapPreview({ lat, lng, onClick }: Props) {
    return (
        <div
            className="relative rounded-xl overflow-hidden border cursor-pointer"
            onClick={onClick}
        >
            <MapContainer
                key={`${lat}-${lng}`}
                center={[lat, lng]}
                zoom={16}
                style={{ height: 180, width: "100%" }}
                dragging={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[lat, lng]} />
            </MapContainer>

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/10 flex items-end justify-end p-2">
                <span className="text-xs bg-white/90 px-2 py-1 rounded">
                    Nhấn để chỉnh sửa
                </span>
            </div>
        </div>
    );
}
