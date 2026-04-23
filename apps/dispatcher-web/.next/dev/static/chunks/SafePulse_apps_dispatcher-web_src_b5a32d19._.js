(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/SafePulse/apps/dispatcher-web/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccessToken",
    ()=>getAccessToken,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://grwrvmoqhrqjqlfkczju.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyd3J2bW9xaHJxanFsZmtjemp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDUzODIsImV4cCI6MjA4NjEyMTM4Mn0.zrUrV6nQ-QhgFkgl9L1JVIgMonQwclgcxPeX4MORf_w");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const getAccessToken = async ()=>{
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
        return null;
    }
    // Proactively refresh if token expires within 60s
    const expiresAt = session.expires_at ?? 0;
    if (expiresAt * 1000 - Date.now() < 60_000) {
        const { data: { session: refreshed }, error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError || !refreshed) {
            // Refresh token is dead — force sign out so user gets redirected to login
            await supabase.auth.signOut();
            return null;
        }
        return refreshed.access_token;
    }
    return session.access_token;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/store/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/supabase.ts [app-client] (ecmascript)");
;
;
;
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set)=>({
        session: null,
        loading: true,
        setSession: (session)=>set({
                session,
                loading: false
            }),
        initialize: async ()=>{
            try {
                const { data: { session }, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (error || !session) {
                    set({
                        session: null,
                        loading: false
                    });
                    return;
                }
                // Verify the session is still usable by attempting a refresh
                const { data: { session: refreshed }, error: refreshError } = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.refreshSession();
                if (refreshError || !refreshed) {
                    // Refresh token is invalid — clear everything
                    await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
                    set({
                        session: null,
                        loading: false
                    });
                    return;
                }
                set({
                    session: refreshed,
                    loading: false
                });
            } catch  {
                set({
                    session: null,
                    loading: false
                });
            }
            __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange((event, session)=>{
                if (event === 'SIGNED_OUT') {
                    set({
                        session: null
                    });
                } else if (session) {
                    set({
                        session
                    });
                }
            });
        },
        signOut: async ()=>{
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
            set({
                session: null
            });
        }
    }), {
    name: 'safepulse-auth',
    partialize: (state)=>({
            session: state.session
        })
}));
// Initialize on import
if ("TURBOPACK compile-time truthy", 1) {
    useAuthStore.getState().initialize();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "dispatcherApi",
    ()=>dispatcherApi
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/supabase.ts [app-client] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:4000/api/v1") || 'http://localhost:4000/api/v1';
class ApiClient {
    baseUrl;
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
        const { params, ...fetchOptions } = options;
        let url = `${this.baseUrl}${endpoint}`;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value])=>{
                if (value !== undefined) {
                    if (Array.isArray(value)) {
                        value.forEach((v)=>searchParams.append(key, v));
                    } else {
                        searchParams.append(key, value);
                    }
                }
            });
            const queryString = searchParams.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
        }
        const response = await fetch(url, {
            ...fetchOptions,
            headers: {
                'Content-Type': 'application/json',
                ...token && {
                    Authorization: `Bearer ${token}`
                },
                ...fetchOptions.headers
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({}));
            throw new Error(error.message || `API Error: ${response.status}`);
        }
        return response.json();
    }
    get(endpoint, options) {
        return this.request(endpoint, {
            ...options,
            method: 'GET'
        });
    }
    post(endpoint, data, options) {
        return this.request(endpoint, {
            ...options,
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
    }
    put(endpoint, data, options) {
        return this.request(endpoint, {
            ...options,
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined
        });
    }
    delete(endpoint, options) {
        return this.request(endpoint, {
            ...options,
            method: 'DELETE'
        });
    }
}
const api = new ApiClient(API_URL);
const dispatcherApi = {
    getIncidents: (filters)=>api.get('/dispatcher/incidents', {
            params: filters
        }),
    getIncident: (id)=>api.get(`/dispatcher/incidents/${id}`),
    acknowledgeIncident: (id, data)=>api.post(`/dispatcher/incidents/${id}/acknowledge`, data),
    updateIncidentStatus: (id, data)=>api.post(`/dispatcher/incidents/${id}/status`, data),
    addNotes: (id, notes)=>api.post(`/dispatcher/incidents/${id}/notes`, {
            notes
        }),
    assignUnit: (id, unitId, isPrimary)=>api.post(`/dispatcher/incidents/${id}/assign`, {
            unitId,
            isPrimary
        }),
    sendMessage: (id, data)=>api.post(`/dispatcher/incidents/${id}/message`, data),
    getTimeline: (id)=>api.get(`/dispatcher/incidents/${id}/timeline`),
    getLocations: (id)=>api.get(`/dispatcher/incidents/${id}/locations`),
    getDeliveries: (id)=>api.get(`/dispatcher/incidents/${id}/deliveries`),
    getUnits: (status)=>api.get('/dispatcher/units', {
            params: status ? {
                status
            } : undefined
        }),
    updateUnitStatus: (unitId, status)=>api.post(`/dispatcher/units/${unitId}/status`, {
            status
        }),
    getStats: ()=>api.get('/dispatcher/stats')
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/store/incidents.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useIncidentsStore",
    ()=>useIncidentsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/api.ts [app-client] (ecmascript)");
;
;
const useIncidentsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set, get)=>({
        incidents: [],
        selectedIncidentId: null,
        selectedIncident: null,
        filters: {
            status: [],
            type: [],
            priority: []
        },
        loading: false,
        error: null,
        total: 0,
        fetchIncidents: async ()=>{
            set({
                loading: true,
                error: null
            });
            try {
                const { filters } = get();
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getIncidents({
                    status: filters.status.length > 0 ? filters.status : undefined,
                    type: filters.type.length > 0 ? filters.type : undefined,
                    priority: filters.priority.length > 0 ? filters.priority : undefined,
                    limit: 100
                });
                set({
                    incidents: response.data,
                    total: response.meta.total,
                    loading: false
                });
            } catch (error) {
                set({
                    error: error.message,
                    loading: false
                });
            }
        },
        selectIncident: async (id)=>{
            if (!id) {
                set({
                    selectedIncidentId: null,
                    selectedIncident: null
                });
                return;
            }
            set({
                selectedIncidentId: id
            });
            try {
                const incident = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getIncident(id);
                set({
                    selectedIncident: incident
                });
            } catch (error) {
                console.error('Failed to fetch incident details:', error);
            }
        },
        updateFilters: (newFilters)=>{
            set((state)=>({
                    filters: {
                        ...state.filters,
                        ...newFilters
                    }
                }));
            get().fetchIncidents();
        },
        updateIncidentInList: (id, changes)=>{
            set((state)=>({
                    incidents: state.incidents.map((inc)=>inc.id === id ? {
                            ...inc,
                            ...changes
                        } : inc),
                    selectedIncident: state.selectedIncidentId === id ? {
                        ...state.selectedIncident,
                        ...changes
                    } : state.selectedIncident
                }));
        },
        addIncident: (incident)=>{
            set((state)=>({
                    incidents: [
                        incident,
                        ...state.incidents
                    ],
                    total: state.total + 1
                }));
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/store/units.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUnitsStore",
    ()=>useUnitsStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/zustand/esm/index.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/api.ts [app-client] (ecmascript)");
;
;
const useUnitsStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$zustand$2f$esm$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["create"])((set)=>({
        units: [],
        loading: false,
        error: null,
        fetchUnits: async (status)=>{
            set({
                loading: true,
                error: null
            });
            try {
                const units = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getUnits(status);
                set({
                    units,
                    loading: false
                });
            } catch (error) {
                set({
                    error: error.message,
                    loading: false
                });
            }
        },
        updateUnit: (id, changes)=>{
            set((state)=>({
                    units: state.units.map((unit)=>unit.id === id ? {
                            ...unit,
                            ...changes
                        } : unit)
                }));
        }
    }));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/lib/socket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectSocket",
    ()=>connectSocket,
    "disconnectSocket",
    ()=>disconnectSocket,
    "getSocket",
    ()=>getSocket,
    "joinRoom",
    ()=>joinRoom,
    "leaveRoom",
    ()=>leaveRoom,
    "subscribeToEvent",
    ()=>subscribeToEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/supabase.ts [app-client] (ecmascript)");
;
;
const SOCKET_URL = ("TURBOPACK compile-time value", "http://localhost:4000") || 'http://localhost:4000';
let socket = null;
const connectSocket = async ()=>{
    if (socket?.connected) {
        return socket;
    }
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
    socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(`${SOCKET_URL}/ws`, {
        auth: {
            token
        },
        transports: [
            'websocket',
            'polling'
        ],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    });
    return new Promise((resolve, reject)=>{
        socket.on('connect', ()=>{
            console.log('Socket connected');
            resolve(socket);
        });
        socket.on('connect_error', (error)=>{
            console.error('Socket connection error:', error);
            reject(error);
        });
        socket.on('connected', (data)=>{
            console.log('Socket authenticated:', data);
        });
    });
};
const disconnectSocket = ()=>{
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
const getSocket = ()=>socket;
const joinRoom = (room)=>{
    socket?.emit('join_room', {
        room
    });
};
const leaveRoom = (room)=>{
    socket?.emit('leave_room', {
        room
    });
};
const subscribeToEvent = (event, callback)=>{
    socket?.on(event, callback);
    return ()=>{
        socket?.off(event, callback);
    };
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "QueuePanel",
    ()=>QueuePanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/incidents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/date-fns/formatDistanceToNow.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
const EMERGENCY_COLORS = {
    medical: 'bg-emergency-medical',
    fire: 'bg-emergency-fire',
    safety: 'bg-emergency-safety',
    security: 'bg-emergency-security'
};
const PRIORITY_COLORS = {
    low: 'bg-priority-low',
    normal: 'bg-priority-normal',
    high: 'bg-priority-high',
    critical: 'bg-priority-critical'
};
const STATUS_COLORS = {
    pending: 'text-status-pending',
    acknowledged: 'text-status-acknowledged',
    dispatched: 'text-status-dispatched',
    en_route: 'text-status-enroute',
    on_scene: 'text-status-onscene',
    resolved: 'text-status-resolved',
    cancelled: 'text-status-cancelled'
};
const CONFIDENCE_COLORS = {
    high: 'text-confidence-high',
    medium: 'text-confidence-medium',
    low: 'text-confidence-low',
    unknown: 'text-confidence-unknown'
};
function QueuePanel() {
    _s();
    const { incidents, selectedIncidentId, selectIncident, filters, updateFilters, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 border-b border-ops-border bg-ops-surface",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold text-gray-300",
                                children: "Incident Queue"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 53,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-500",
                                children: [
                                    incidents.length,
                                    " incidents"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 54,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 52,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterChip, {
                                label: "Pending",
                                active: filters.status.includes('pending'),
                                onClick: ()=>updateFilters({
                                        status: filters.status.includes('pending') ? filters.status.filter((s)=>s !== 'pending') : [
                                            ...filters.status,
                                            'pending'
                                        ]
                                    }),
                                color: "bg-status-pending"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 58,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterChip, {
                                label: "Active",
                                active: filters.status.some((s)=>[
                                        'acknowledged',
                                        'dispatched',
                                        'en_route',
                                        'on_scene'
                                    ].includes(s)),
                                onClick: ()=>updateFilters({
                                        status: filters.status.some((s)=>[
                                                'acknowledged',
                                                'dispatched',
                                                'en_route',
                                                'on_scene'
                                            ].includes(s)) ? [] : [
                                            'acknowledged',
                                            'dispatched',
                                            'en_route',
                                            'on_scene'
                                        ]
                                    }),
                                color: "bg-blue-500"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 70,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FilterChip, {
                                label: "High Priority",
                                active: filters.priority.includes('high') || filters.priority.includes('critical'),
                                onClick: ()=>updateFilters({
                                        priority: filters.priority.includes('high') || filters.priority.includes('critical') ? [] : [
                                            'high',
                                            'critical'
                                        ]
                                    }),
                                color: "bg-priority-high"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 57,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                lineNumber: 51,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto",
                children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-32",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 106,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                    lineNumber: 105,
                    columnNumber: 11
                }, this) : incidents.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center h-32 text-gray-500",
                    children: "No incidents found"
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                    lineNumber: 109,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "divide-y divide-ops-border",
                    children: incidents.map((incident)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(IncidentCard, {
                            incident: incident,
                            selected: selectedIncidentId === incident.id,
                            onClick: ()=>selectIncident(incident.id)
                        }, incident.id, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                            lineNumber: 115,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                    lineNumber: 113,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, this);
}
_s(QueuePanel, "x+xrW2Z8FyG0ShQmHFnChnQdx1g=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"]
    ];
});
_c = QueuePanel;
function FilterChip({ label, active, onClick, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-1 text-xs rounded-md transition-colors', active ? `${color} text-white` : 'bg-ops-surface-raised text-gray-400 hover:text-white'),
        children: label
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_c1 = FilterChip;
function IncidentCard({ incident, selected, onClick }) {
    const timeAgo = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$date$2d$fns$2f$formatDistanceToNow$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["formatDistanceToNow"])(new Date(incident.createdAt), {
        addSuffix: false
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('incident-card p-3 cursor-pointer border-l-4', selected ? 'bg-blue-900/30 border-l-blue-500' : 'bg-ops-surface hover:bg-ops-surface-raised border-l-transparent', EMERGENCY_COLORS[incident.emergencyType]?.replace('bg-', 'border-l-') || 'border-l-gray-500'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-start justify-between mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-0.5 text-xs font-medium rounded uppercase', EMERGENCY_COLORS[incident.emergencyType]),
                                children: incident.emergencyType
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 181,
                                columnNumber: 11
                            }, this),
                            incident.priority !== 'normal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-1.5 py-0.5 text-xs font-medium rounded', PRIORITY_COLORS[incident.priority]),
                                children: incident.priority.toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 192,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "timer text-xs text-gray-400",
                        children: timeAgo
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 204,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                lineNumber: 178,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm text-white font-medium",
                        children: incident.callerName || incident.callerPhone
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 208,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('text-xs font-medium', STATUS_COLORS[incident.status]),
                        children: incident.status.replace('_', ' ')
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 211,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3 text-xs text-gray-400",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('flex items-center gap-1', CONFIDENCE_COLORS[incident.locationConfidence]),
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-3 h-3",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                    lineNumber: 222,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 221,
                                columnNumber: 11
                            }, this),
                            incident.locationConfidence
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-gray-500",
                        children: incident.intakeSource.toUpperCase()
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 232,
                        columnNumber: 9
                    }, this),
                    incident.callerVerified && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-green-500 flex items-center gap-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-3 h-3",
                                fill: "currentColor",
                                viewBox: "0 0 20 20",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    fillRule: "evenodd",
                                    d: "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z",
                                    clipRule: "evenodd"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                    lineNumber: 238,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                                lineNumber: 237,
                                columnNumber: 13
                            }, this),
                            "KYC"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 236,
                        columnNumber: 11
                    }, this),
                    incident.unitCallSign && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-blue-400",
                        children: incident.unitCallSign
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            incident.landmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-gray-500 mt-1 truncate",
                children: incident.landmark
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
                lineNumber: 256,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx",
        lineNumber: 167,
        columnNumber: 5
    }, this);
}
_c2 = IncidentCard;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "QueuePanel");
__turbopack_context__.k.register(_c1, "FilterChip");
__turbopack_context__.k.register(_c2, "IncidentCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "IncidentPanel",
    ()=>IncidentPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/incidents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/date-fns/format.mjs [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
function IncidentPanel() {
    _s();
    const { selectedIncident, selectedIncidentId, updateIncidentInList } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"])();
    const { units, fetchUnits } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnitsStore"])();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('details');
    const [timeline, setTimeline] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [deliveries, setDeliveries] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [showAssignModal, setShowAssignModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [actionLoading, setActionLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "IncidentPanel.useEffect": ()=>{
            if (selectedIncidentId) {
                __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getTimeline(selectedIncidentId).then(setTimeline).catch(console.error);
                __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getDeliveries(selectedIncidentId).then(setDeliveries).catch(console.error);
            }
        }
    }["IncidentPanel.useEffect"], [
        selectedIncidentId
    ]);
    if (!selectedIncident) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full flex items-center justify-center bg-ops-surface",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-gray-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                        className: "w-16 h-16 mx-auto mb-4 opacity-50",
                        fill: "none",
                        stroke: "currentColor",
                        viewBox: "0 0 24 24",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: 1.5,
                            d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 37,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 31,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "Select an incident to view details"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 44,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 30,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
            lineNumber: 29,
            columnNumber: 7
        }, this);
    }
    const handleAcknowledge = async ()=>{
        setActionLoading('acknowledge');
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].acknowledgeIncident(selectedIncident.id, {
                autoDispatch: true
            });
            updateIncidentInList(selectedIncident.id, {
                status: 'acknowledged'
            });
        } catch (error) {
            console.error('Failed to acknowledge:', error);
        }
        setActionLoading(null);
    };
    const handleAddNotes = async ()=>{
        if (!notes.trim()) return;
        setActionLoading('notes');
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].addNotes(selectedIncident.id, notes);
            setNotes('');
            // Refresh timeline
            const newTimeline = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getTimeline(selectedIncident.id);
            setTimeline(newTimeline);
        } catch (error) {
            console.error('Failed to add notes:', error);
        }
        setActionLoading(null);
    };
    const handleAssignUnit = async (unitId)=>{
        setActionLoading('assign');
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].assignUnit(selectedIncident.id, unitId, true);
            setShowAssignModal(false);
            updateIncidentInList(selectedIncident.id, {
                status: 'dispatched'
            });
        } catch (error) {
            console.error('Failed to assign unit:', error);
        }
        setActionLoading(null);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col bg-ops-surface",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-ops-border",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-1 text-sm font-medium rounded uppercase', `bg-emergency-${selectedIncident.emergencyType}`),
                                        children: selectedIncident.emergencyType
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 94,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-1 text-sm font-medium rounded', `text-status-${selectedIncident.status}`, 'bg-ops-surface-raised'),
                                        children: selectedIncident.status.replace('_', ' ')
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 102,
                                        columnNumber: 13
                                    }, this),
                                    selectedIncident.priority !== 'normal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-1 text-sm font-medium rounded', `bg-priority-${selectedIncident.priority}`),
                                        children: selectedIncident.priority.toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 112,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 93,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-gray-400",
                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(selectedIncident.createdAt), 'HH:mm:ss')
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 122,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2",
                        children: [
                            selectedIncident.status === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: handleAcknowledge,
                                loading: actionLoading === 'acknowledge',
                                color: "bg-blue-600 hover:bg-blue-700",
                                children: "Acknowledge"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 130,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>{
                                    fetchUnits();
                                    setShowAssignModal(true);
                                },
                                color: "bg-purple-600 hover:bg-purple-700",
                                children: "Assign Unit"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 139,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>window.open(`tel:${selectedIncident.callerPhone}`),
                                color: "bg-green-600 hover:bg-green-700",
                                children: "Call Caller"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 149,
                                columnNumber: 11
                            }, this),
                            selectedIncident.emergencyContacts?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionButton, {
                                onClick: ()=>window.open(`tel:${selectedIncident.emergencyContacts[0].phoneNumber}`),
                                color: "bg-teal-600 hover:bg-teal-700",
                                children: "Call Guardian"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 157,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 128,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 91,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex border-b border-ops-border",
                children: [
                    'details',
                    'timeline',
                    'deliveries'
                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: ()=>setActiveTab(tab),
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('flex-1 py-2 text-sm font-medium transition-colors', activeTab === tab ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-white'),
                        children: [
                            tab.charAt(0).toUpperCase() + tab.slice(1),
                            tab === 'timeline' && timeline.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 text-xs text-gray-500",
                                children: [
                                    "(",
                                    timeline.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 184,
                                columnNumber: 15
                            }, this),
                            tab === 'deliveries' && deliveries.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "ml-1 text-xs text-gray-500",
                                children: [
                                    "(",
                                    deliveries.length,
                                    ")"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 187,
                                columnNumber: 15
                            }, this)
                        ]
                    }, tab, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 172,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 170,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto p-4",
                children: [
                    activeTab === 'details' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DetailsTab, {
                        incident: selectedIncident
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 196,
                        columnNumber: 11
                    }, this),
                    activeTab === 'timeline' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TimelineTab, {
                        timeline: timeline
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 199,
                        columnNumber: 11
                    }, this),
                    activeTab === 'deliveries' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeliveriesTab, {
                        deliveries: deliveries
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 202,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 border-t border-ops-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex gap-2",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            value: notes,
                            onChange: (e)=>setNotes(e.target.value),
                            placeholder: "Add dispatcher notes...",
                            className: "flex-1 px-3 py-2 bg-ops-surface-raised border border-ops-border rounded text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500",
                            onKeyDown: (e)=>e.key === 'Enter' && handleAddNotes()
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 209,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleAddNotes,
                            disabled: !notes.trim() || actionLoading === 'notes',
                            className: "px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white text-sm rounded",
                            children: actionLoading === 'notes' ? '...' : 'Add'
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 217,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 207,
                columnNumber: 7
            }, this),
            showAssignModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AssignModal, {
                units: units,
                onAssign: handleAssignUnit,
                onClose: ()=>setShowAssignModal(false),
                loading: actionLoading === 'assign'
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 229,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
        lineNumber: 89,
        columnNumber: 5
    }, this);
}
_s(IncidentPanel, "oGX9R3dUxvpd7GOT/UtEhXdkytk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnitsStore"]
    ];
});
_c = IncidentPanel;
function ActionButton({ onClick, loading, color, children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: loading,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-3 py-1.5 text-sm font-medium rounded text-white transition-colors', color, loading && 'opacity-50 cursor-not-allowed'),
        children: loading ? '...' : children
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
        lineNumber: 252,
        columnNumber: 5
    }, this);
}
_c1 = ActionButton;
function DetailsTab({ incident }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold text-gray-400 uppercase mb-2",
                        children: "Caller"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-ops-surface-raised rounded p-3 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Name"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 274,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white",
                                        children: incident.callerName || 'Unknown'
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 275,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Phone"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 278,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-white font-mono",
                                        children: incident.callerPhone
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 277,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "KYC Status"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 282,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(incident.callerVerified ? 'text-green-400' : 'text-yellow-400'),
                                        children: incident.callerKyc || 'Unknown'
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 283,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 281,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold text-gray-400 uppercase mb-2",
                        children: "Location"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-ops-surface-raised rounded p-3 space-y-2",
                        children: [
                            incident.latestLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-400",
                                                children: "Coordinates"
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 301,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white font-mono text-sm",
                                                children: [
                                                    incident.latestLocation.latitude.toFixed(6),
                                                    ",",
                                                    ' ',
                                                    incident.latestLocation.longitude.toFixed(6)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 302,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 300,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-400",
                                                children: "Accuracy"
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 308,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-white",
                                                children: incident.latestLocation.accuracy ? `${incident.latestLocation.accuracy.toFixed(0)}m` : 'Unknown'
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 309,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 307,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-gray-400",
                                                children: "Confidence"
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 316,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(`text-confidence-${incident.latestLocation.confidence}`),
                                                children: incident.latestLocation.confidence
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 317,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true),
                            incident.landmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-gray-400",
                                        children: "Landmark"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-white mt-1",
                                        children: incident.landmark
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 330,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            incident.emergencyContacts?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold text-gray-400 uppercase mb-2",
                        children: "Emergency Contacts"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 339,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-ops-surface-raised rounded divide-y divide-ops-border",
                        children: incident.emergencyContacts.map((contact)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white",
                                                children: [
                                                    contact.name,
                                                    contact.isPrimary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "ml-2 text-xs text-blue-400",
                                                        children: "Primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                        lineNumber: 352,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 349,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400",
                                                children: contact.relationship
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 355,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 348,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: `tel:${contact.phoneNumber}`,
                                        className: "text-green-400 hover:text-green-300",
                                        children: contact.phoneNumber
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 357,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, contact.id, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 344,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 342,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 338,
                columnNumber: 9
            }, this),
            incident.assignments?.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold text-gray-400 uppercase mb-2",
                        children: "Assigned Units"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 372,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-ops-surface-raised rounded divide-y divide-ops-border",
                        children: incident.assignments.map((assignment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "p-3 flex items-center justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-white font-medium",
                                                children: assignment.callSign
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 382,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-gray-400",
                                                children: assignment.unitType
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 383,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 381,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('text-sm', assignment.status === 'accepted' ? 'text-green-400' : assignment.status === 'declined' ? 'text-red-400' : 'text-yellow-400'),
                                        children: assignment.status
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 385,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, assignment.id, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 377,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 371,
                columnNumber: 9
            }, this),
            incident.notes && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold text-gray-400 uppercase mb-2",
                        children: "Dispatcher Notes"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 406,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-ops-surface-raised rounded p-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-300 whitespace-pre-wrap text-sm",
                            children: incident.notes
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 410,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 409,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 405,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
        lineNumber: 268,
        columnNumber: 5
    }, this);
}
_c2 = DetailsTab;
function TimelineTab({ timeline }) {
    if (timeline.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center text-gray-500 py-8",
            children: "No events recorded"
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
            lineNumber: 423,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute left-3 top-0 bottom-0 w-0.5 bg-ops-border"
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 429,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-4",
                children: timeline.map((event)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative pl-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute left-1.5 w-3 h-3 rounded-full bg-blue-500 ring-4 ring-ops-surface"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 434,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-ops-surface-raised rounded p-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mb-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium text-white",
                                                children: event.eventType.replace('_', ' ')
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 437,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-gray-500",
                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$date$2d$fns$2f$format$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["format"])(new Date(event.createdAt), 'HH:mm:ss')
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 436,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-400",
                                        children: event.actorName || 'System'
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 444,
                                        columnNumber: 15
                                    }, this),
                                    event.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-gray-300 mt-1",
                                        children: event.description
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 448,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 435,
                                columnNumber: 13
                            }, this)
                        ]
                    }, event.id, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 433,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 431,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
        lineNumber: 428,
        columnNumber: 5
    }, this);
}
_c3 = TimelineTab;
function DeliveriesTab({ deliveries }) {
    if (deliveries.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center text-gray-500 py-8",
            children: "No delivery logs"
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
            lineNumber: 461,
            columnNumber: 7
        }, this);
    }
    const statusColors = {
        delivered: 'text-green-400',
        sent: 'text-blue-400',
        pending: 'text-yellow-400',
        failed: 'text-red-400',
        retrying: 'text-orange-400'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: deliveries.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "bg-ops-surface-raised rounded p-3 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-medium px-1.5 py-0.5 rounded bg-ops-border text-gray-300",
                                        children: log.channel.toUpperCase()
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 482,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-sm text-white",
                                        children: log.recipientPhone
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                        lineNumber: 485,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 481,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-400 mt-1",
                                children: log.messageType
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 487,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 480,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-right",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('text-sm font-medium', statusColors[log.status]),
                                children: log.status
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 490,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-gray-500",
                                children: [
                                    "Attempts: ",
                                    log.attemptCount
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 493,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                        lineNumber: 489,
                        columnNumber: 11
                    }, this)
                ]
            }, log.id, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                lineNumber: 476,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
        lineNumber: 474,
        columnNumber: 5
    }, this);
}
_c4 = DeliveriesTab;
function AssignModal({ units, onAssign, onClose, loading }) {
    const availableUnits = units.filter((u)=>u.status === 'available' && u.isOnDuty);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-center justify-center z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-ops-surface border border-ops-border rounded-lg w-full max-w-md p-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between mb-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold text-white",
                            children: "Assign Unit"
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 520,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "text-gray-400 hover:text-white",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M6 18L18 6M6 6l12 12"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                    lineNumber: 523,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                lineNumber: 522,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 521,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                    lineNumber: 519,
                    columnNumber: 9
                }, this),
                availableUnits.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400 text-center py-8",
                    children: "No available units"
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                    lineNumber: 529,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2 max-h-64 overflow-y-auto",
                    children: availableUnits.map((unit)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onAssign(unit.id),
                            disabled: loading,
                            className: "w-full p-3 bg-ops-surface-raised hover:bg-ops-border rounded flex items-center justify-between transition-colors disabled:opacity-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white font-medium",
                                            children: unit.callSign
                                        }, void 0, false, {
                                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                            lineNumber: 540,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-400",
                                            children: unit.unitType
                                        }, void 0, false, {
                                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                            lineNumber: 541,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                    lineNumber: 539,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-green-400 text-sm",
                                    children: "Available"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                                    lineNumber: 543,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, unit.id, true, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                            lineNumber: 533,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
                    lineNumber: 531,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
            lineNumber: 518,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx",
        lineNumber: 517,
        columnNumber: 5
    }, this);
}
_c5 = AssignModal;
var _c, _c1, _c2, _c3, _c4, _c5;
__turbopack_context__.k.register(_c, "IncidentPanel");
__turbopack_context__.k.register(_c1, "ActionButton");
__turbopack_context__.k.register(_c2, "DetailsTab");
__turbopack_context__.k.register(_c3, "TimelineTab");
__turbopack_context__.k.register(_c4, "DeliveriesTab");
__turbopack_context__.k.register(_c5, "AssignModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MapPanel",
    ()=>MapPanel
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/incidents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
// Single dynamic import — prevents "Map container already initialized" by
// ensuring Leaflet is only loaded once and SSR is fully avoided.
const LeafletMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/SafePulse/apps/dispatcher-web/src/components/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/SafePulse/apps/dispatcher-web/src/components/LeafletMap.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "h-full flex items-center justify-center bg-ops-bg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
            lineNumber: 12,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
_c = LeafletMap;
const DEFAULT_CENTER = [
    5.6037,
    -0.1870
];
const DEFAULT_ZOOM = 12;
function MapPanel() {
    _s();
    const { selectedIncident, incidents } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"])();
    const { units } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnitsStore"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-full flex flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-ops-surface border-b border-ops-border flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-gray-300",
                        children: "Map View"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 text-xs text-gray-400",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 bg-red-500 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                                        lineNumber: 32,
                                        columnNumber: 13
                                    }, this),
                                    "Incidents"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                                lineNumber: 31,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "flex items-center gap-1",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-3 h-3 bg-blue-500 rounded-full"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                                        lineNumber: 36,
                                        columnNumber: 13
                                    }, this),
                                    "Units"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                                lineNumber: 35,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LeafletMap, {
                    selectedIncident: selectedIncident,
                    incidents: incidents,
                    units: units,
                    defaultCenter: DEFAULT_CENTER,
                    defaultZoom: DEFAULT_ZOOM
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                    lineNumber: 44,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            selectedIncident?.latestLocation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 bg-ops-surface border-t border-ops-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between text-xs",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-gray-400",
                            children: [
                                selectedIncident.latestLocation.latitude.toFixed(6),
                                ",",
                                ' ',
                                selectedIncident.latestLocation.longitude.toFixed(6)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                            lineNumber: 57,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>{
                                const lat = selectedIncident.latestLocation.latitude;
                                const lng = selectedIncident.latestLocation.longitude;
                                window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                            },
                            className: "text-blue-400 hover:text-blue-300",
                            children: "Open in Maps"
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                            lineNumber: 61,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                    lineNumber: 56,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
                lineNumber: 55,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(MapPanel, "Xo8K/NZE0Vky1sOtt8GsWt1uoNk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnitsStore"]
    ];
});
_c1 = MapPanel;
var _c, _c1;
__turbopack_context__.k.register(_c, "LeafletMap");
__turbopack_context__.k.register(_c1, "MapPanel");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Header",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/incidents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function Header({ socketConnected }) {
    _s();
    const { signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { total, incidents } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"])();
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getStats().then(setStats).catch(console.error);
            // Refresh stats every 30 seconds
            const interval = setInterval({
                "Header.useEffect.interval": ()=>{
                    __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["dispatcherApi"].getStats().then(setStats).catch(console.error);
                }
            }["Header.useEffect.interval"], 30000);
            return ({
                "Header.useEffect": ()=>clearInterval(interval)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    const pendingCount = incidents.filter((i)=>i.status === 'pending').length;
    const activeCount = incidents.filter((i)=>[
            'acknowledged',
            'dispatched',
            'en_route',
            'on_scene'
        ].includes(i.status)).length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-14 bg-ops-surface border-b border-ops-border flex items-center justify-between px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-white font-bold text-sm",
                                    children: "SP"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                    lineNumber: 38,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 37,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-white font-semibold",
                                children: "SafePulse"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 40,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                        lineNumber: 36,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-6 w-px bg-ops-border"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBadge, {
                                label: "Pending",
                                value: stats?.incidents?.pending || pendingCount,
                                color: "text-status-pending",
                                pulse: pendingCount > 0
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 46,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBadge, {
                                label: "Active",
                                value: stats?.incidents?.active || activeCount,
                                color: "text-blue-400"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 52,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatBadge, {
                                label: "Units Available",
                                value: stats?.units?.available || 0,
                                color: "text-green-400"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 57,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                lineNumber: 35,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-2 h-2 rounded-full ${socketConnected ? 'bg-green-500' : 'bg-red-500'}`
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 68,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-gray-400",
                                children: socketConnected ? 'Connected' : 'Disconnected'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: signOut,
                        className: "text-gray-400 hover:text-white text-sm",
                        children: "Sign Out"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                lineNumber: 65,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
_s(Header, "rq+shLsR4vXaxSLb+plGkPT5T4Y=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"]
    ];
});
_c = Header;
function StatBadge({ label, value, color, pulse }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs text-gray-500",
                children: label
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                lineNumber: 102,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `font-mono font-bold ${color} ${pulse ? 'animate-pulse' : ''}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx",
        lineNumber: 101,
        columnNumber: 5
    }, this);
}
_c1 = StatBadge;
var _c, _c1;
__turbopack_context__.k.register(_c, "Header");
__turbopack_context__.k.register(_c1, "StatBadge");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DispatcherPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/incidents.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/units.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/lib/socket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$QueuePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/components/QueuePanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$IncidentPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/components/IncidentPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$MapPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/components/MapPanel.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/components/Header.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
function DispatcherPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { session, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    const { fetchIncidents, addIncident, updateIncidentInList, selectedIncidentId } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"])();
    const { fetchUnits, updateUnit } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnitsStore"])();
    const [socketConnected, setSocketConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DispatcherPage.useEffect": ()=>{
            if (!authLoading && !session) {
                router.replace('/login');
            }
        }
    }["DispatcherPage.useEffect"], [
        session,
        authLoading,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DispatcherPage.useEffect": ()=>{
            if (session) {
                // Fetch initial data
                fetchIncidents();
                fetchUnits();
                // Connect to WebSocket
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectSocket"])().then({
                    "DispatcherPage.useEffect": (socket)=>{
                        setSocketConnected(true);
                        // Join agency room (would need actual agencyId from user profile)
                        // joinRoom('agency:...');
                        // Subscribe to events
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('incident:created', {
                            "DispatcherPage.useEffect": (data)=>{
                                addIncident(data.incident);
                            }
                        }["DispatcherPage.useEffect"]);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('incident:updated', {
                            "DispatcherPage.useEffect": (data)=>{
                                updateIncidentInList(data.incidentId, data.changes);
                            }
                        }["DispatcherPage.useEffect"]);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('incident:acknowledged', {
                            "DispatcherPage.useEffect": (data)=>{
                                updateIncidentInList(data.incidentId, {
                                    status: 'acknowledged'
                                });
                            }
                        }["DispatcherPage.useEffect"]);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('unit:status_changed', {
                            "DispatcherPage.useEffect": (data)=>{
                                updateUnit(data.unitId, {
                                    status: data.status
                                });
                            }
                        }["DispatcherPage.useEffect"]);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('assignment:accepted', {
                            "DispatcherPage.useEffect": (data)=>{
                                updateIncidentInList(data.incidentId, {
                                    status: 'dispatched'
                                });
                            }
                        }["DispatcherPage.useEffect"]);
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('escalation:alert', {
                            "DispatcherPage.useEffect": (data)=>{
                                // Show notification for escalation
                                console.log('Escalation alert:', data);
                            }
                        }["DispatcherPage.useEffect"]);
                    }
                }["DispatcherPage.useEffect"]).catch({
                    "DispatcherPage.useEffect": (err)=>{
                        console.error('Socket connection failed:', err);
                    }
                }["DispatcherPage.useEffect"]);
            }
        }
    }["DispatcherPage.useEffect"], [
        session
    ]);
    if (authLoading || !session) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-ops-bg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "h-screen flex flex-col bg-ops-bg overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$Header$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Header"], {
                socketConnected: socketConnected
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-96 flex-shrink-0 border-r border-ops-border overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$QueuePanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueuePanel"], {}, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                            lineNumber: 88,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                        lineNumber: 87,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 min-w-0 border-r border-ops-border overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$IncidentPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["IncidentPanel"], {}, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                            lineNumber: 93,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                        lineNumber: 92,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-[500px] flex-shrink-0 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$components$2f$MapPanel$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["MapPanel"], {}, void 0, false, {
                            fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                            lineNumber: 98,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                        lineNumber: 97,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
                lineNumber: 85,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/dispatcher/page.tsx",
        lineNumber: 82,
        columnNumber: 5
    }, this);
}
_s(DispatcherPage, "NQ3SgnV4B4mycQvazJj8E3ER0dw=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$incidents$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useIncidentsStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$units$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUnitsStore"]
    ];
});
_c = DispatcherPage;
var _c;
__turbopack_context__.k.register(_c, "DispatcherPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=SafePulse_apps_dispatcher-web_src_b5a32d19._.js.map