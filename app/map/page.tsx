"use client";
import React, { useState } from "react";
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
    }
  };

  const lineGeoJSON = {
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
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
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
          {points[0].longitude && points[1].longitude && (
            <Source id="line" type="geojson" data={lineGeoJSON}>
              <Layer
                id="line"
                type="line"
                source="line"
                layout={{
                  "line-cap": "round",
                  "line-join": "round",
                }}
                paint={{
                  "line-color": "#FF5733",
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
