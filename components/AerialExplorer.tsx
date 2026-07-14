"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Navigation, MousePointer2, Thermometer, Droplets, Wind, Wifi, BatteryMedium, Compass, Crosshair, Power, Loader2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
// === TAMBAHAN: Import context bahasa global ===
import { useLanguage } from "../context/LanguageContext";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""; 

// Menggunakan KEY kamus untuk menerjemahkan data lokasi di Peta
const mapLocations = [
  {
    id: 1,
    titleKey: "loc1_title",
    typeKey: "loc1_type",
    statusKey: "stat_normal",
    lng: 104.27882688457521, lat: -5.238698319624318,
    descKey: "loc1_desc",
    sensor: { temp: "42°C", ph: "2.1", sulfur: "12 ppm" }
  },
  {
    id: 2,
    titleKey: "loc2_title",
    typeKey: "loc2_type",
    statusKey: "stat_safe1",
    lng: 104.274690, lat: -5.251999,
    descKey: "loc2_desc",
    sensor: { temp: "26°C", ph: "7.0", sulfur: "0.5 ppm" }
  },
  {
    id: 3,
    titleKey: "loc3_title",
    typeKey: "loc3_type",
    statusKey: "stat_normal",
    lng: 104.266782, lat: -5.246098,
    descKey: "loc3_desc",
    sensor: { temp: "35°C", ph: "4.5", sulfur: "8 ppm" }
  },
  {
    id: 4,
    titleKey: "loc4_title",
    typeKey: "loc4_type",
    statusKey: "stat_safe2",
    lng: 104.26727197333017, lat: -5.236056616428336,
    descKey: "loc4_desc",
    sensor: { temp: "55°C", ph: "3.0", sulfur: "25 ppm" }
  },
  {
    id: 5,
    titleKey: "loc5_title",
    typeKey: "loc5_type",
    statusKey: "stat_warn1",
    lng: 104.25928872886739, lat: -5.237142698064301,
    descKey: "loc5_desc",
    sensor: { temp: "95°C", ph: "1.5", sulfur: "85 ppm" }
  },
  {
    id: 6,
    titleKey: "loc6_title",
    typeKey: "loc6_type",
    statusKey: "stat_warn2",
    lng: 104.2635823976347, lat: -5.239053909820962,
    descKey: "loc6_desc",
    sensor: { temp: "78°C", ph: "2.8", sulfur: "60 ppm" }
  },
];

export default function AerialExplorer() {
  // === Panggil kekuatan Global State ===
  const { t } = useLanguage();

  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedLoc, setSelectedLoc] = useState<typeof mapLocations[0] | null>(null);
  const [isRotating, setIsRotating] = useState(true);
  
  const [liveCoords, setLiveCoords] = useState({ lng: 104.2690, lat: -5.2430 });
  const [isThermalMode, setIsThermalMode] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const isRotatingRef = useRef(true);
  const startRotationRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/satellite-streets-v12",
      center: [104.2690, -5.2430],
      zoom: 13,
      pitch: 65,
      bearing: 0,
      antialias: true,
      interactive: true,
    });

    mapRef.current = map;

    map.on("load", () => {
      setMapLoaded(true);
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      const routeCoordinates = mapLocations.map(loc => [loc.lng, loc.lat]);
      routeCoordinates.push([mapLocations[0].lng, mapLocations[0].lat]); 

      map.addSource("flight-path", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: routeCoordinates,
          },
        },
      });

      map.addLayer({
        id: "flight-path-line",
        type: "line",
        source: "flight-path",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#f59e0b", 
          "line-width": 2.5,
          "line-dasharray": [2, 4], 
          "line-opacity": 0.8,
        },
      });

      let animationId: number;

      const rotateCamera = () => {
        if (!isRotatingRef.current) return; 
        const currentBearing = map.getBearing();
        map.rotateTo(currentBearing + 0.15, { duration: 0 });
        animationId = requestAnimationFrame(rotateCamera);
      };
      
      rotateCamera();

      const stopRotation = () => {
        isRotatingRef.current = false;
        setIsRotating(false);
        if (animationId) cancelAnimationFrame(animationId);
      };

      startRotationRef.current = () => {
        if (!isRotatingRef.current) {
          isRotatingRef.current = true;
          setIsRotating(true);
          rotateCamera();
        }
      };

      mapLocations.forEach((loc) => {
        const el = document.createElement("div");
        
        // Cek tipe menggunakan terjemahan ID sebagai dasar logika warna
        const isKawah = loc.typeKey === "loc5_type" || loc.typeKey === "loc6_type" || loc.typeKey === "loc4_type"; 
        const bgColor = isKawah ? "bg-orange-500" : "bg-cyan-500";
        const shadowColor = isKawah ? "shadow-[0_0_15px_rgba(249,115,22,0.8)]" : "shadow-[0_0_15px_rgba(6,182,212,0.8)]";
        
        el.innerHTML = `
          <div class="relative flex items-center justify-center w-8 h-8">
            <span class="absolute inline-flex w-full h-full rounded-full ${bgColor} opacity-40 animate-ping"></span>
            <div class="relative flex items-center justify-center w-4 h-4 rounded-full border-2 border-white ${bgColor} ${shadowColor}"></div>
          </div>
        `;
        el.className = "cursor-pointer";
        
        new mapboxgl.Marker(el)
          .setLngLat([loc.lng, loc.lat])
          .addTo(map);

        el.addEventListener("click", (e) => {
          e.stopPropagation();
          setSelectedLoc(loc);
          stopRotation(); 
          map.flyTo({ center: [loc.lng, loc.lat], zoom: 15.5, pitch: 70, essential: true });
        });
      });

      map.on("move", () => {
        setLiveCoords({
          lng: map.getCenter().lng,
          lat: map.getCenter().lat
        });
      });

      map.on("dragstart", stopRotation);
      map.on("zoomstart", stopRotation);
    });

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleClosePopup = () => {
    setSelectedLoc(null); 
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [104.2690, -5.2430], zoom: 13, pitch: 65, essential: true, speed: 1.2 });
      mapRef.current.once("moveend", () => {
        if (startRotationRef.current && !isRotatingRef.current) startRotationRef.current();
      });
    }
  };

  return (
    <section className="py-20 px-4 max-w-7xl mx-auto" id="explorer">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">{t("map_title")}</h2>
        <p className="text-slate-600">{t("map_desc")}</p>
      </div>

      <div className="relative w-full h-[600px] bg-slate-900 rounded-3xl overflow-hidden border-4 border-slate-800 shadow-xl">
        
        <div 
          ref={mapContainer} 
          className={`absolute inset-0 w-full h-full transition-all duration-1500 ease-in-out ${
            isThermalMode 
              ? "hue-rotate-220 saturate-[3] contrast-125 invert-[0.1]" 
              : ""
          }`} 
        />

        {/* === MAP LOADING SKELETON === */}
        <AnimatePresence>
          {!mapLoaded && (
            <motion.div
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 z-30 bg-slate-900 flex flex-col items-center justify-center"
            >
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-full border-2 border-emerald-500/30 flex items-center justify-center">
                  <Loader2 size={36} className="text-emerald-400 animate-spin" />
                </div>
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 animate-ping"></span>
              </div>
              <p className="text-emerald-400 font-mono text-sm font-bold tracking-widest uppercase mb-2">
                {t("map_title")}
              </p>
              <p className="text-emerald-100/50 text-xs font-mono">
                Initializing Mapbox GL • Terrain DEM • Satellite Layer
              </p>
              <div className="mt-6 flex items-center gap-3 text-emerald-500/60 font-mono text-[10px]">
                <span className="flex items-center gap-1"><Compass size={12} /> LAT: -5.24300</span>
                <span>|</span>
                <span className="flex items-center gap-1">LNG: 104.26900</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-0 left-0 w-full bg-slate-900/85 backdrop-blur-md border-b border-emerald-500/30 text-emerald-400 font-mono text-[10px] sm:text-xs z-10 px-4 py-2 flex flex-wrap justify-between items-center shadow-lg shadow-emerald-900/20">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-bold tracking-wider text-emerald-300">
              <Crosshair size={14} className="animate-spin-slow" /> AEROSUOH VTOL-X1
            </span>
            <span className="hidden md:flex items-center gap-1 text-emerald-500"><Wifi size={14} /> 98%</span>
            <span className="hidden md:flex items-center gap-1 text-emerald-500"><BatteryMedium size={14} /> 84% 22.4V</span>
          </div>
          
          <div className="flex items-center gap-4 text-emerald-200">
            <span className="hidden sm:inline-block">ALT: 450m ASL</span>
            <span className="hidden sm:inline-block">SPD: 12 m/s</span>
            <span className="bg-emerald-900/50 px-2 py-1 rounded border border-emerald-700/50 flex items-center gap-2">
              <Compass size={14} className="text-emerald-400" />
              LAT: {liveCoords.lat.toFixed(5)} | LNG: {liveCoords.lng.toFixed(5)}
            </span>
          </div>
        </div>

        <div className="absolute top-12 left-4 pointer-events-none z-10 flex flex-col gap-2 mt-2">
          <p className="bg-slate-900/70 backdrop-blur-md text-emerald-400 font-mono text-sm px-3 py-1.5 rounded-lg flex items-center gap-2 border border-emerald-500/30 shadow-lg uppercase">
            <Navigation size={16} className={isRotating ? "animate-spin" : ""} /> 
            {isRotating ? t("map_auto_on") : t("map_auto_off")}
          </p>
          {!isRotating && (
             <p className="text-xs text-white bg-red-500/80 px-2 py-1 rounded inline-block w-max shadow-lg shadow-red-500/20">
               {t("map_auto_warn")}
             </p>
          )}
        </div>

        {/* === HANYA BAGIAN INI YANG DIUBAH (Posisi & Bentuk Sudut) === */}
        <div 
          onClick={() => setIsThermalMode(!isThermalMode)}
          className={`absolute bottom-0 left-0 z-20 w-36 sm:w-48 h-24 sm:h-32 bg-slate-900 border-t border-r ${isThermalMode ? 'border-emerald-500 shadow-emerald-900/50' : 'border-rose-500/50 shadow-rose-900/20'} rounded-tr-2xl overflow-hidden shadow-lg cursor-pointer hover:scale-105 transition-all group`}
        >
          <div className="absolute top-1.5 left-2 flex items-center gap-1.5 z-20">
            <div className={`w-2 h-2 rounded-full animate-pulse ${isThermalMode ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]'}`}></div>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-white tracking-wider drop-shadow-md">
              {isThermalMode ? t("map_therm_on") : t("map_therm_off")}
            </span>
          </div>
          
          <div className="w-full h-full bg-linear-to-br from-indigo-900 via-rose-600 to-amber-400 opacity-60 animate-pulse"></div>
          
          <div className="absolute inset-0 flex items-center justify-center opacity-40">
            <div className="w-8 h-8 border border-white rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-white rounded-full"></div>
            </div>
          </div>
          <div className="absolute top-0 left-0 w-full h-0.5 bg-white/20 animate-[ping_3s_ease-in-out_infinite]"></div>

          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm z-30">
            <Power size={24} className={isThermalMode ? 'text-rose-400 mb-1' : 'text-emerald-400 mb-1'} />
            <span className="text-white text-[10px] font-bold tracking-widest text-center px-2">
              {isThermalMode ? t("map_therm_btn_on") : t("map_therm_btn_off")}
            </span>
          </div>
        </div>

        <div className="absolute bottom-4 right-4 pointer-events-none z-10 text-white bg-slate-900/60 px-3 py-2 rounded-lg backdrop-blur text-xs flex items-center gap-2 border border-slate-700 shadow-lg">
          <MousePointer2 size={14} /> {t("map_ctrl")}
        </div>

        <AnimatePresence>
          {selectedLoc && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="absolute top-16 right-6 w-80 md:w-96 bg-white/95 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-slate-200 z-20"
            >
              <button 
                onClick={handleClosePopup}
                className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{t(selectedLoc.titleKey as any)}</h3>
              <p className="text-xs font-mono text-emerald-600 mb-4 bg-emerald-50 inline-block px-2 py-1 rounded border border-emerald-100">
                TGT LOCK: {selectedLoc.lat.toFixed(5)}, {selectedLoc.lng.toFixed(5)}
              </p>
              
              <div className="flex items-center gap-2 mb-4">
                <span className="px-2 py-1 bg-slate-100 border border-slate-200 text-slate-700 text-xs rounded-full font-medium shadow-sm">{t(selectedLoc.typeKey as any)}</span>
                <span className={`px-2 py-1 text-xs rounded-full font-medium shadow-sm border ${t(selectedLoc.statusKey as any).includes('Waspada') || t(selectedLoc.statusKey as any).includes('Alert') ? 'bg-red-50 text-red-600 border-red-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                  {t(selectedLoc.statusKey as any)}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center text-center shadow-sm">
                  <Thermometer size={18} className="text-rose-500 mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider">{t("map_temp")}</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedLoc.sensor.temp}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center text-center shadow-sm">
                  <Droplets size={18} className="text-blue-500 mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider">{t("map_ph")}</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedLoc.sensor.ph}</span>
                </div>
                <div className="bg-slate-50 border border-slate-100 rounded-lg p-2 flex flex-col items-center text-center shadow-sm">
                  <Wind size={18} className="text-amber-500 mb-1" />
                  <span className="text-[10px] text-slate-400 font-bold tracking-wider">{t("map_gas")}</span>
                  <span className="text-sm font-mono font-bold text-slate-800">{selectedLoc.sensor.sulfur}</span>
                </div>
              </div>
              
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm text-slate-700 leading-relaxed flex items-start gap-2">
                  <Info size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  {t(selectedLoc.descKey as any)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}