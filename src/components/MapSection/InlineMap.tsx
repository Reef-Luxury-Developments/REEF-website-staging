import React, { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  Circle,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Landmark item type
export interface landmarkItem {
  id: string;
  name: string;
  iconType?: {
    url: string;
    id: string;
    name: string;
  } | null;
  time: string;
  lat?: number;
  lng?: number;
}

// Inline Map Component for Community Details with Zone View
interface InlineMapProps {
  lat: number;
  lng: number;
  landmarks: landmarkItem[];
  activeId: string | null;
  communityName?: string;
  onMarkerClick: (destinationId: string) => void;
}

// Component to handle opening popup for active marker
interface ActiveMarkerProps {
  landmark: landmarkItem;
  isActive: boolean;
  onMarkerClick: (landmarkId: string) => void;
}

const ActiveMarker: React.FC<ActiveMarkerProps> = ({
  landmark,
  isActive,
  onMarkerClick,
}) => {
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (isActive && markerRef.current) {
      // Open the popup when marker becomes active
      markerRef.current.openPopup();
    }
  }, [isActive]);

  const dLat = landmark.lat;
  const dLng = landmark.lng;

  if (!isValidCoord(dLat, dLng)) return null;

  return (
    <Marker
      ref={markerRef}
      position={[dLat!, dLng!]}
      icon={createLandmarkIcon(isActive)}
      zIndexOffset={isActive ? 1000 : 0}
      eventHandlers={{
        click: () => {
          onMarkerClick(landmark.id);
        },
      }}
    >
      <Popup className="font-sans" autoPan={false}>
        <div className="text-center min-w-[120px]">
          <div className="font-bold text-slate-900">{landmark.name}</div>
          <div className="flex items-center justify-center gap-2 mt-1 text-xs font-medium text-[#40C2CC]">
            <span>{landmark.time}</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

// Helper to validate coordinates
const isValidCoord = (lat: any, lng: any) => {
  const numLat = Number(lat);
  const numLng = Number(lng);
  return (
    !isNaN(numLat) &&
    !isNaN(numLng) &&
    typeof numLat === "number" &&
    typeof numLng === "number"
  );
};

// Create custom landmark icon - keep static pin icon
const createLandmarkIcon = (isActive: boolean) => {
  return L.divIcon({
    className: "bg-transparent",
    html: `
      <div class="relative flex flex-col items-center justify-center w-10 h-10 group">
        <div class="relative flex items-center justify-center w-8 h-8 transition-transform duration-300 transform ${
          isActive ? "scale-110" : "scale-100"
        }">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${
            isActive ? "#40C2CC" : "#475569"
          }" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full drop-shadow-md">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3" fill="white"></circle>
          </svg>
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 38],
    popupAnchor: [0, -40],
  });
};

// Create zone pulse icon for community location
const createZonePulseIcon = () => {
  return L.divIcon({
    className: "bg-transparent pointer-events-none",
    html: `
      <div class="relative flex items-center justify-center w-[200px] h-[200px]">
        <div class="absolute w-full h-full bg-[#40C2CC] rounded-full opacity-30 animate-ping"></div>
        <div class="absolute w-[80%] h-[80%] bg-[#40C2CC] rounded-full opacity-10"></div>
      </div>
    `,
    iconSize: [200, 200],
    iconAnchor: [100, 100],
  });
};

// Map Controller Component - adjusts view based on selected landmark
interface MapControllerProps {
  communityLat: number;
  communityLng: number;
  selectedLandmark: landmarkItem | null;
}

const MapController: React.FC<MapControllerProps> = ({
  communityLat,
  communityLng,
  selectedLandmark,
}) => {
  const map = useMap();
  const mounted = useRef(false);

  useEffect(() => {
    if (!isValidCoord(communityLat, communityLng)) return;

    // Detect mobile screen size
    const isMobile = window.innerWidth < 768;

    if (
      selectedLandmark &&
      isValidCoord(selectedLandmark.lat, selectedLandmark.lng)
    ) {
      const bounds = L.latLngBounds(
        [communityLat, communityLng],
        [selectedLandmark.lat!, selectedLandmark.lng!]
      );

      // Use smaller padding on mobile to prevent over-zooming out
      // and ensure the distance line is visible
      const padding: [number, number] = isMobile ? [40, 20] : [150, 100];
      const maxZoom = isMobile ? 15 : 14;

      map.fitBounds(bounds, {
        padding,
        animate: true,
        duration: 1.5,
        maxZoom,
      });
    } else {
      // Lower initial zoom on mobile to show more area
      const initialZoom = isMobile ? 12 : 13;
      map.setView([communityLat, communityLng], initialZoom, {
        animate: true,
        duration: 1.5,
      });
    }

    mounted.current = true;
  }, [selectedLandmark, map, communityLat, communityLng]);

  return null;
};

const InlineMap: React.FC<InlineMapProps> = ({
  lat,
  lng,
  landmarks,
  activeId,
  communityName,
  onMarkerClick,
}) => {
  const validComm = isValidCoord(lat, lng);
  const initialCenter: [number, number] = validComm
    ? [lat, lng]
    : [25.0844, 55.1704];

  const activeLandmark = landmarks.find((lm) => lm.id === activeId) || null;
  const zonePulseIcon = createZonePulseIcon();

  // Detect mobile for initial zoom and interaction settings
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const initialZoom = isMobile ? 12 : 13;

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={false}
        dragging={!isMobile}
        doubleClickZoom={!isMobile}
        style={{ height: "100%", width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://qa.carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />

        <MapController
          communityLat={lat}
          communityLng={lng}
          selectedLandmark={activeLandmark}
        />

        {validComm && (
          <>
            {/* Zone Pulse Animation */}
            <Marker
              position={[lat, lng]}
              icon={zonePulseIcon}
              zIndexOffset={-100}
              interactive={false}
            />

            {/* Community Zone Circle */}
            <Circle
              center={[lat, lng]}
              radius={1200}
              pathOptions={{
                color: "transparent",
                fillColor: "#40C2CC",
                fillOpacity: 0.2,
              }}
            >
              <Popup className="font-sans">
                <div className="text-center">
                  <div className="font-bold text-slate-900">
                    {communityName || "Community Zone"}
                  </div>
                  <div className="text-xs text-slate-500">Community Zone</div>
                </div>
              </Popup>
            </Circle>
          </>
        )}

        {/* Landmark Markers */}
        {landmarks.map((lm) => {
          const isActive = activeId === lm.id;
          return (
            <ActiveMarker
              key={lm.id}
              landmark={lm}
              isActive={isActive}
              onMarkerClick={onMarkerClick}
            />
          );
        })}

        {/* Polyline to active landmark */}
        {activeLandmark &&
          isValidCoord(activeLandmark.lat, activeLandmark.lng) &&
          validComm && (
            <Polyline
              positions={[
                [lat, lng],
                [activeLandmark.lat!, activeLandmark.lng!],
              ]}
              pathOptions={{
                color: "#40C2CC",
                weight: 2,
                opacity: 0.7,
                dashArray: "10, 10",
                lineCap: "round",
              }}
            />
          )}
      </MapContainer>
    </div>
  );
};

export default InlineMap;
