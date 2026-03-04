import React, { useEffect, useState } from "react";
import { useTheme } from "../../theme/ThemeProvider";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import HeaderOfSection from "../HeaderOfSection";
import { useLanguage } from "../../i18n/LanguageProvider";

interface Location {
  id: number;
  name: string;
  lat: number;
  lng: number;
}

type MapProps = {
  data?: {
    lat?: number;
    long?: number; // some APIs use 'long'
    lng?: number; // or 'lng'
    name?: string;
    area?: string;
    areaDescription?: string;
    allLandmarks?: Array<{
      landmarkId?: string;
      name?: string;
      iconUrl?: string;
      lat?: number;
      long?: number;
      lng?: number;
    }>;
  };
};

const Map = ({ data }: MapProps) => {
  const theme = useTheme();
  const { t } = useLanguage();
  const [locations, setLocations] = useState<Location[]>([]);
  const [landmarks, setLandmarks] = useState<
    Array<{
      id: string;
      name: string;
      lat: number;
      lng: number;
      iconUrl?: string;
    }>
  >([]);
  // Normalize optional polyline coordinates coming from backend (various shapes)
  const rawPolyline: any =
    (data as any)?.polyline ||
    (data as any)?.polylinePoints ||
    (data as any)?.polylineLatLngs ||
    (data as any)?.latlngs ||
    (data as any)?.route;
  const polylinePositions: Array<[number, number]> = Array.isArray(rawPolyline)
    ? ((rawPolyline as any[])
        .map((p: any) => {
          if (Array.isArray(p) && p.length >= 2) {
            const a = Number(p[0]);
            const b = Number(p[1]);
            return isFinite(a) && isFinite(b)
              ? ([a, b] as [number, number])
              : null;
          }
          const lat = typeof p?.lat === "number" ? p.lat : Number(p?.lat);
          const lng =
            typeof p?.lng === "number"
              ? p.lng
              : typeof p?.long === "number"
              ? p.long
              : Number(p?.long);
          return isFinite(lat) && isFinite(lng)
            ? ([lat, lng] as [number, number])
            : null;
        })
        .filter(Boolean) as Array<[number, number]>)
    : [];

  useEffect(() => {
    // If lat/long provided via props, use them
    const hasProjectCoords =
      data &&
      typeof data.lat === "number" &&
      typeof (data.long ?? data.lng) === "number";
    if (hasProjectCoords && data) {
      const lng =
        typeof data.lng === "number" ? data.lng : (data.long as number);
      setLocations([
        { id: 1, name: data.name ?? "Location", lat: data.lat as number, lng },
      ]);
    }

    // Landmarks from backend
    const arr = Array.isArray(data?.allLandmarks) ? data!.allLandmarks! : [];
    const normalized = arr
      .map((lm: any) => {
        const lat = typeof lm?.lat === "number" ? lm.lat : undefined;
        const lng =
          typeof lm?.lng === "number"
            ? lm.lng
            : typeof lm?.long === "number"
            ? lm.long
            : undefined;
        if (typeof lat === "number" && typeof lng === "number") {
          return {
            id: String(lm.landmarkId || `${lat},${lng}`),
            name: lm.name || "Landmark",
            lat,
            lng,
            iconUrl: lm.iconUrl,
          };
        }
        return null;
      })
      .filter(Boolean) as Array<{
      id: string;
      name: string;
      lat: number;
      lng: number;
      iconUrl?: string;
    }>;
    setLandmarks(normalized);

    // Fallback fetch if no data provided at all
    if (!hasProjectCoords && normalized.length === 0) {
      fetch("/api/locations")
        .then((res) => res.json())
        .then((data) => setLocations(data))
        .catch((err) => console.error("Failed to fetch locations:", err));
    }
  }, [data]);

  return (
    <section className="w-full py-12 md:py-24">
      <div>
        <HeaderOfSection
          title={<span className="">{data?.area}</span>}
          subTitle={t("slider.project_location")}
          endContentClassName={``}
          endContent={
            <>
              <p>{data?.areaDescription}</p>
            </>
          }
        />

        {/* Map */}
        <div className="w-full h-[550px] overflow-hidden">
          <MapContainer
            center={[
              locations[0]?.lat ?? landmarks[0]?.lat ?? 25.0844,
              locations[0]?.lng ?? landmarks[0]?.lng ?? 55.1704,
            ]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            {/* Fly camera to provided coordinates with zoom-in when available */}
            <FlyToLocation
              lat={locations[0]?.lat}
              lng={locations[0]?.lng}
              zoom={16}
            />
            <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
            {/* Project location marker with an online icon distinct from landmarks */}
            {locations[0] && (
              <Marker
                position={[locations[0].lat, locations[0].lng]}
                icon={L.icon({
                  iconUrl:
                    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                })}
              >
                <Popup>{locations[0].name || "Project"}</Popup>
              </Marker>
            )}
            {/* Optional MAIN polyline coming directly from backend */}
            {polylinePositions.length >= 2 && (
              <>
                {/* Distinct style for the main polyline */}
                <Polyline
                  positions={polylinePositions}
                  pathOptions={{
                    color: "#0A181A",
                    weight: 4,
                    opacity: 0.95,
                    dashArray: "6,6",
                  }}
                />
                {/* Mark start and end points with unique icons */}
                <Marker
                  position={polylinePositions[0]}
                  icon={L.icon({
                    iconUrl: "/assets/Start.png",
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -28],
                  })}
                >
                  <Popup>Start</Popup>
                </Marker>
                <Marker
                  position={polylinePositions[polylinePositions.length - 1]}
                  icon={L.icon({
                    iconUrl: "/assets/End.png",
                    iconSize: [36, 36],
                    iconAnchor: [18, 36],
                    popupAnchor: [0, -28],
                  })}
                >
                  <Popup>End</Popup>
                </Marker>
                <FitToPolyline positions={polylinePositions} />
              </>
            )}
            {/* Draw polylines from project location to each landmark instead of a black dot */}
            {locations[0] &&
              landmarks.map((lm) => (
                <Polyline
                  key={`line-${lm.id}`}
                  positions={[
                    [locations[0].lat, locations[0].lng],
                    [lm.lat, lm.lng],
                  ]}
                  pathOptions={{ color: "#40C2CC", weight: 1, opacity: 0.9 }}
                />
              ))}

            {/* Landmark markers with their icons */}
            {landmarks.map((lm) => (
              <Marker
                key={lm.id}
                position={[lm.lat, lm.lng]}
                icon={L.icon({
                  iconUrl: lm.iconUrl || "/assets/Icon.svg",
                  iconSize: [20, 20],
                  iconAnchor: [10, 10],
                  popupAnchor: [0, 0],
                })}
              >
                <Popup>{lm.name}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </section>
  );
};

export default Map;

// Imperative helper to move/zoom the map when coords change
const FlyToLocation = ({
  lat,
  lng,
  zoom = 16,
}: {
  lat?: number;
  lng?: number;
  zoom?: number;
}) => {
  const map = useMap();
  useEffect(() => {
    if (typeof lat === "number" && typeof lng === "number") {
      map.flyTo([lat, lng], zoom, { duration: 1.0 });
    }
  }, [lat, lng, zoom, map]);
  return null;
};

// Fit bounds to a provided polyline when available
const FitToPolyline = ({
  positions,
}: {
  positions: Array<[number, number]>;
}) => {
  const map = useMap();
  useEffect(() => {
    if (positions && positions.length >= 2) {
      const bounds = L.latLngBounds(positions.map(([a, b]) => L.latLng(a, b)));
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [positions, map]);
  return null;
};
