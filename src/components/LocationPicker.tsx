import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from "react-leaflet";
import { MdLocationPin } from "react-icons/md";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { BiCurrentLocation } from "react-icons/bi";

export interface Location {
  lat: number;
  lng: number;
}

type Props = {
  value?: Location | null;
  onChange?: (loc: Location | null) => void;
  onConfirm?: (loc: Location) => void;

  initialCenter?: [number, number];
  initialZoom?: number;

  confirmText?: string;
  className?: string;
};

function ClickPicker({ onPick }: { onPick: (latlng: Location) => void }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function LocateButton({ onLocate }: { onLocate: (latlng: Location) => void }) {
  const map = useMap();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!wrapRef.current) return;
    // chặn click/touch/scroll “lọt” xuống map
    L.DomEvent.disableClickPropagation(wrapRef.current);
    L.DomEvent.disableScrollPropagation(wrapRef.current);
  }, []);

  const locate = () => {
    if (!navigator.geolocation) {
      toast.error("Trình duyệt không hỗ trợ GPS");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const latlng = { lat: latitude, lng: longitude };

        onLocate(latlng);

        // Move tới vị trí hiện tại (có animate)
        map.flyTo([latitude, longitude], Math.max(map.getZoom(), 16), { animate: true });
      },
      () => toast.error("Không lấy được vị trí hiện tại"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <div ref={wrapRef} className="absolute right-3 top-3 z-[1000]">
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          locate();
        }}
        className="inline-flex items-center justify-center rounded-full bg-red-600 p-3 text-white shadow-lg ring-1 ring-red-200 transition hover:bg-red-700 active:scale-95"
        aria-label="Vị trí hiện tại"
        title="Vị trí hiện tại"
      >
        <BiCurrentLocation className="h-6 w-6" />
      </button>
    </div>
  );
}

export default function LocationPicker({
  value,
  onChange,
  onConfirm,
  initialCenter = [21.5942, 105.8482],
  initialZoom = 13,
  confirmText = "Xác nhận vị trí",
  className,
}: Props) {
  const [inner, setInner] = useState<Location | null>(null);

  const location = value !== undefined ? value : inner;
  const setLocation = (loc: Location | null) => {
    if (value === undefined) setInner(loc);
    onChange?.(loc);
  };

  const markerIcon = useMemo(() => {
    const html = renderToStaticMarkup(
      <div className="relative">
        <MdLocationPin className="h-10 w-10 text-red-600 " />
      </div>
    );

    return L.divIcon({
      html,
      className: "",
      iconSize: [40, 40],
      iconAnchor: [20, 36],
    });
  }, []);

  const handleConfirm = () => {
    if (!location) {
      toast.error("Bạn chưa chọn vị trí");
      return;
    }
    onConfirm?.(location);
  };

  return (
    <div className={className}>
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 relative h-[75vh]">
        {/* Map */}
        <MapContainer
          center={initialCenter}
          zoom={initialZoom}
          className="absolute inset-0 w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <ClickPicker onPick={setLocation} />
          <LocateButton onLocate={setLocation} />

          {location && (
            <Marker position={[location.lat, location.lng]} icon={markerIcon} />
          )}
        </MapContainer>

        <div className="absolute inset-x-0 bottom-4 z-[1001] flex justify-center px-3">
          <button
                type="button"
                onClick={handleConfirm}
                disabled={!location}
                className="inline-flex w-full max-w-md items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500 disabled:shadow-none"
            >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
