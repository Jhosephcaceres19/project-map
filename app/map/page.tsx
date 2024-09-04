"use client";
import React, { useState, useEffect } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import MapGL, {
  NavigationControl,
  Marker,
  Popup,
  GeolocateControl,
  Source,
  Layer,
} from "react-map-gl";
import Navbar from "../Navbar";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_API_KEY; // Asegúrate de tener tu token de Mapbox aquí

export default function Map() {
  const [points, setPoints] = useState([
    { longitude: null, latitude: null },
    { longitude: null, latitude: null },
  ]);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number | null;
    latitude: number | null;
    text: string;
  } | null>(null);
  const [route, setRoute] = useState(null); // Estado para almacenar la ruta

  const handleMapClick = (event) => {
    const { lng, lat } = event.lngLat;
    if (!points[0].longitude) {
      setPoints([
        { longitude: lng, latitude: lat },
        { longitude: null, latitude: null },
      ]);
      setPopupInfo({ longitude: lng, latitude: lat, text: "Punto 1" });
    } else if (!points[1].longitude) {
      setPoints([{ ...points[0] }, { longitude: lng, latitude: lat }]);
      setPopupInfo({ longitude: lng, latitude: lat, text: "Punto 2" });
    } else {
      setPoints([
        { longitude: lng, latitude: lat },
        { longitude: null, latitude: null },
      ]);
      setPopupInfo(null);
      setRoute(null); // Reinicia la ruta si seleccionas nuevos puntos
    }
  };

  // Obtener la ruta entre los puntos seleccionados
  useEffect(() => {
    const getRoute = async () => {
      if (points[0].longitude && points[1].longitude) {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${points[0].longitude},${points[0].latitude};${points[1].longitude},${points[1].latitude}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
        );
        const data = await response.json();
        setRoute(data.routes[0].geometry); // Guarda la geometría de la ruta
      }
    };

    getRoute();
  }, [points]); // Ejecutar cuando los puntos cambien

  const lineGeoJSON = route || {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: points
            .map((p) => [p.longitude, p.latitude])
            .filter((c) => c[0] !== null && c[1] !== null),
        },
      },
    ],
  };

  return (
    <div>
      <Navbar />

      <div className="w-full bg-sky-400 flex justify-center items-center h-screen px-8">
        <MapGL
          mapboxAccessToken={MAPBOX_TOKEN}
          initialViewState={{
            longitude: -66.156798,
            latitude: -17.393801,
            zoom: 14,
          }}
          style={{ width: "100%", height: "40vh", borderRadius: "20px" }}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
          onClick={handleMapClick}
        >
          {/* Mostrar marcadores para los puntos seleccionados */}
          {points.map((point, index) =>
            point.longitude && point.latitude ? (
              <Marker
                key={index}
                longitude={point.longitude}
                latitude={point.latitude}
              >
                {/* Puedes personalizar el marcador aquí */}
              </Marker>
            ) : null
          )}

          {/* Mostrar la línea entre los puntos si ambos están seleccionados */}
          {route && (
            <Source id="route" type="geojson" data={lineGeoJSON}>
              <Layer
                id="route"
                type="line"
                source="route"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": "#1014C5",
                  "line-width": 4,
                }}
              />
            </Source>
          )}

          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeButton={true}
              closeOnClick={false}
              anchor="top"
              className="mt-4"
            >
              <div className="text-center text-md xl:text-xl text-black">
                <h3>{popupInfo.text}</h3>
              </div>
            </Popup>
          )}

          <NavigationControl position="top-right" />
          <GeolocateControl position="top-left" />
        </MapGL>
      </div>
    </div>
  );
}
