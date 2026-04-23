(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/SafePulse/apps/dispatcher-web/src/components/LeafletMap.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>LeafletMap
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/leaflet/dist/leaflet-src.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Fix default marker icon
delete __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.prototype._getIconUrl;
__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png'
});
const incidentIcon = __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
    className: 'custom-marker',
    html: `
    <div class="relative">
      <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-50"></div>
    </div>
  `,
    iconSize: [
        32,
        32
    ],
    iconAnchor: [
        16,
        16
    ]
});
const unitIcon = __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
    className: 'custom-marker',
    html: `
    <div class="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
      <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7h4a1 1 0 011 1v6.05A2.5 2.5 0 0115.95 16H15a1 1 0 01-1-1V7z" />
      </svg>
    </div>
  `,
    iconSize: [
        24,
        24
    ],
    iconAnchor: [
        12,
        12
    ]
});
const smallIncidentIcon = __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].divIcon({
    className: 'custom-marker',
    html: `<div class="w-4 h-4 bg-orange-500 rounded-full opacity-70"></div>`,
    iconSize: [
        16,
        16
    ],
    iconAnchor: [
        8,
        8
    ]
});
function LeafletMap({ selectedIncident, incidents, units, defaultCenter, defaultZoom }) {
    _s();
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mapRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const layerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Initialize map
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            if (!containerRef.current) return;
            const map = __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].map(containerRef.current).setView(defaultCenter, defaultZoom);
            __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            const layers = __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].layerGroup().addTo(map);
            mapRef.current = map;
            layerRef.current = layers;
            // Invalidate map size when the container is resized (e.g. drag-to-resize panels)
            const observer = new ResizeObserver({
                "LeafletMap.useEffect": ()=>{
                    map.invalidateSize();
                }
            }["LeafletMap.useEffect"]);
            observer.observe(containerRef.current);
            return ({
                "LeafletMap.useEffect": ()=>{
                    observer.disconnect();
                    map.remove();
                    mapRef.current = null;
                    layerRef.current = null;
                }
            })["LeafletMap.useEffect"];
        }
    }["LeafletMap.useEffect"], []);
    // Update markers whenever data changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LeafletMap.useEffect": ()=>{
            const map = mapRef.current;
            const layers = layerRef.current;
            if (!map || !layers) return;
            layers.clearLayers();
            // Selected incident marker + accuracy circle
            if (selectedIncident?.latestLocation) {
                const { latitude, longitude, accuracy } = selectedIncident.latestLocation;
                __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                    latitude,
                    longitude
                ], {
                    icon: incidentIcon
                }).bindPopup(`<div class="text-sm">
            <p class="font-semibold">${selectedIncident.emergencyType.toUpperCase()}</p>
            <p>${selectedIncident.callerPhone || ''}</p>
          </div>`).addTo(layers);
                if (accuracy) {
                    __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].circle([
                        latitude,
                        longitude
                    ], {
                        radius: accuracy,
                        color: '#ef4444',
                        fillColor: '#ef4444',
                        fillOpacity: 0.1,
                        weight: 1
                    }).addTo(layers);
                }
                map.setView([
                    latitude,
                    longitude
                ], 15);
            } else if (selectedIncident?.latitude && selectedIncident?.longitude) {
                map.setView([
                    selectedIncident.latitude,
                    selectedIncident.longitude
                ], 15);
            }
            // Other active incidents
            incidents.filter({
                "LeafletMap.useEffect": (inc)=>inc.id !== selectedIncident?.id && inc.latitude && inc.longitude && ![
                        'resolved',
                        'cancelled',
                        'closed'
                    ].includes(inc.status)
            }["LeafletMap.useEffect"]).forEach({
                "LeafletMap.useEffect": (inc)=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                        inc.latitude,
                        inc.longitude
                    ], {
                        icon: smallIncidentIcon
                    }).bindPopup(`<div class="text-sm">
              <p class="font-semibold">${inc.emergencyType}</p>
              <p class="text-gray-600">${inc.status}</p>
            </div>`).addTo(layers);
                }
            }["LeafletMap.useEffect"]);
            // Unit markers
            units.filter({
                "LeafletMap.useEffect": (unit)=>unit.currentLocation && unit.isOnDuty
            }["LeafletMap.useEffect"]).forEach({
                "LeafletMap.useEffect": (unit)=>{
                    const statusClass = unit.status === 'available' ? 'text-green-600' : 'text-orange-600';
                    __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$leaflet$2f$dist$2f$leaflet$2d$src$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].marker([
                        unit.currentLocation.latitude,
                        unit.currentLocation.longitude
                    ], {
                        icon: unitIcon
                    }).bindPopup(`<div class="text-sm">
              <p class="font-semibold">${unit.callSign}</p>
              <p class="text-gray-600">${unit.unitType}</p>
              <p class="${statusClass}">${unit.status}</p>
            </div>`).addTo(layers);
                }
            }["LeafletMap.useEffect"]);
        }
    }["LeafletMap.useEffect"], [
        selectedIncident,
        incidents,
        units
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: "h-full w-full",
        style: {
            background: '#0a0e14'
        }
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/LeafletMap.tsx",
        lineNumber: 202,
        columnNumber: 5
    }, this);
}
_s(LeafletMap, "3dECxMM5bci+5T3U37FibDb8y5U=");
_c = LeafletMap;
var _c;
__turbopack_context__.k.register(_c, "LeafletMap");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/components/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/components/LeafletMap.tsx [app-client] (ecmascript)"));
}),
]);

//# sourceMappingURL=SafePulse_apps_dispatcher-web_src_components_LeafletMap_tsx_d3c5b052._.js.map