(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/SafePulse/apps/unit-portal-web/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getAccessToken",
    ()=>getAccessToken,
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/@supabase/supabase-js/dist/index.mjs [app-client] (ecmascript) <locals>");
;
const supabaseUrl = ("TURBOPACK compile-time value", "https://grwrvmoqhrqjqlfkczju.supabase.co");
const supabaseAnonKey = ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdyd3J2bW9xaHJxanFsZmtjemp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA1NDUzODIsImV4cCI6MjA4NjEyMTM4Mn0.zrUrV6nQ-QhgFkgl9L1JVIgMonQwclgcxPeX4MORf_w");
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
const getAccessToken = async ()=>{
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/unit-portal-web/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/lib/supabase.ts [app-client] (ecmascript)");
;
const API_URL = ("TURBOPACK compile-time value", "http://localhost:4000/api/v1") || 'http://localhost:4000/api/v1';
class ApiClient {
    baseUrl;
    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    async request(endpoint, options = {}) {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...token && {
                    Authorization: `Bearer ${token}`
                },
                ...options.headers
            }
        });
        if (!response.ok) {
            const error = await response.json().catch(()=>({}));
            throw new Error(error.message || `API Error: ${response.status}`);
        }
        return response.json();
    }
    get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    }
    post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined
        });
    }
}
const api = new ApiClient(API_URL);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/unit-portal-web/src/lib/socket.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectSocket",
    ()=>connectSocket,
    "subscribeToEvent",
    ()=>subscribeToEvent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/lib/supabase.ts [app-client] (ecmascript)");
;
;
const SOCKET_URL = ("TURBOPACK compile-time value", "http://localhost:4000") || 'http://localhost:4000';
let socket = null;
const connectSocket = async ()=>{
    if (socket?.connected) return socket;
    const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getAccessToken"])();
    socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])(`${SOCKET_URL}/ws`, {
        auth: {
            token
        },
        transports: [
            'websocket',
            'polling'
        ]
    });
    return new Promise((resolve, reject)=>{
        socket.on('connect', ()=>resolve(socket));
        socket.on('connect_error', reject);
    });
};
const subscribeToEvent = (event, callback)=>{
    socket?.on(event, callback);
    return ()=>socket?.off(event, callback);
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssignmentCard",
    ()=>AssignmentCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const EMERGENCY_COLORS = {
    medical: 'bg-red-500',
    fire: 'bg-orange-500',
    safety: 'bg-purple-500',
    security: 'bg-blue-500'
};
function AssignmentCard({ assignment, onAccept, onDecline, onSelect }) {
    _s();
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [showDeclineModal, setShowDeclineModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AssignmentCard.useEffect": ()=>{
            if (assignment.status !== 'offered') return;
            const calculateTimeLeft = {
                "AssignmentCard.useEffect.calculateTimeLeft": ()=>{
                    const expires = new Date(assignment.expiresAt).getTime();
                    const now = Date.now();
                    return Math.max(0, Math.floor((expires - now) / 1000));
                }
            }["AssignmentCard.useEffect.calculateTimeLeft"];
            setTimeLeft(calculateTimeLeft());
            const interval = setInterval({
                "AssignmentCard.useEffect.interval": ()=>{
                    const remaining = calculateTimeLeft();
                    setTimeLeft(remaining);
                    if (remaining <= 0) clearInterval(interval);
                }
            }["AssignmentCard.useEffect.interval"], 1000);
            return ({
                "AssignmentCard.useEffect": ()=>clearInterval(interval)
            })["AssignmentCard.useEffect"];
        }
    }["AssignmentCard.useEffect"], [
        assignment.expiresAt,
        assignment.status
    ]);
    const handleAccept = async ()=>{
        setLoading('accept');
        await onAccept();
        setLoading(null);
    };
    const handleDecline = async (reason)=>{
        setLoading('decline');
        await onDecline(reason);
        setShowDeclineModal(false);
        setLoading(null);
    };
    const isOffer = assignment.status === 'offered';
    const isUrgent = timeLeft <= 30 && timeLeft > 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                onClick: !isOffer ? onSelect : undefined,
                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('bg-ops-surface rounded-xl p-4 border', isOffer ? isUrgent ? 'border-red-500 animate-pulse' : 'border-yellow-500' : 'border-ops-border cursor-pointer'),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-start justify-between mb-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-1 text-xs font-bold rounded uppercase text-white', EMERGENCY_COLORS[assignment.incident.emergencyType]),
                                        children: assignment.incident.emergencyType
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                        lineNumber: 93,
                                        columnNumber: 13
                                    }, this),
                                    assignment.incident.priority !== 'normal' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 text-xs font-bold rounded bg-red-600 text-white uppercase",
                                        children: assignment.incident.priority
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                        lineNumber: 102,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this),
                            isOffer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('text-lg font-mono font-bold', isUrgent ? 'text-red-500' : 'text-yellow-500'),
                                children: [
                                    Math.floor(timeLeft / 60),
                                    ":",
                                    (timeLeft % 60).toString().padStart(2, '0')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                lineNumber: 109,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                        lineNumber: 91,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-white font-medium mb-1",
                        children: assignment.incident.callerName || 'Unknown Caller'
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                        lineNumber: 120,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-gray-400 mb-3",
                        children: assignment.incident.landmark || assignment.incident.callerPhone
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                        lineNumber: 123,
                        columnNumber: 9
                    }, this),
                    isOffer ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleAccept,
                                disabled: loading === 'accept',
                                className: "flex-1 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-800 text-white font-bold rounded-lg",
                                children: loading === 'accept' ? '...' : 'ACCEPT'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowDeclineModal(true),
                                disabled: loading === 'decline',
                                className: "px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg",
                                children: loading === 'decline' ? '...' : 'DECLINE'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                lineNumber: 136,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('text-sm font-medium', assignment.status === 'accepted' ? 'text-green-400' : 'text-gray-400'),
                                children: assignment.status.toUpperCase()
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-5 h-5 text-gray-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 2,
                                    d: "M9 5l7 7-7 7"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                    lineNumber: 160,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                                lineNumber: 154,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                        lineNumber: 145,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            showDeclineModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DeclineModal, {
                onDecline: handleDecline,
                onClose: ()=>setShowDeclineModal(false),
                loading: loading === 'decline'
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                lineNumber: 168,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(AssignmentCard, "cVygL9zuJPPtA4Ns3b5E73m6tRE=");
_c = AssignmentCard;
function DeclineModal({ onDecline, onClose, loading }) {
    const reasons = [
        'Too far away',
        'Already on another call',
        'Vehicle issue',
        'End of shift',
        'Other'
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 bg-black/50 flex items-end z-50",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-ops-surface w-full rounded-t-2xl p-4 safe-bottom",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-lg font-bold text-white mb-4",
                    children: "Decline Reason"
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                    lineNumber: 198,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "space-y-2",
                    children: reasons.map((reason)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>onDecline(reason),
                            disabled: loading,
                            className: "w-full py-3 bg-ops-surface-raised hover:bg-ops-border text-white rounded-lg text-left px-4 disabled:opacity-50",
                            children: reason
                        }, reason, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                            lineNumber: 201,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "w-full py-3 mt-4 text-gray-400",
                    children: "Cancel"
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
            lineNumber: 197,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx",
        lineNumber: 196,
        columnNumber: 5
    }, this);
}
_c1 = DeclineModal;
var _c, _c1;
__turbopack_context__.k.register(_c, "AssignmentCard");
__turbopack_context__.k.register(_c1, "DeclineModal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StatusToggle",
    ()=>StatusToggle
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function StatusToggle({ status, isOnDuty, onChange }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const handleToggle = async ()=>{
        setLoading(true);
        const newIsOnDuty = !isOnDuty;
        const newStatus = newIsOnDuty ? 'available' : 'offline';
        await onChange(newStatus, newIsOnDuty);
        setLoading(false);
    };
    const handleStatusChange = async (newStatus)=>{
        if (!isOnDuty || newStatus === status) return;
        setLoading(true);
        await onChange(newStatus, true);
        setLoading(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-4 bg-ops-surface border-b border-ops-border",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between mb-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-sm font-medium text-gray-300",
                        children: "On Duty"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                        lineNumber: 33,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleToggle,
                        disabled: loading,
                        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('relative w-14 h-8 rounded-full transition-colors', isOnDuty ? 'bg-green-600' : 'bg-gray-600', loading && 'opacity-50'),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('absolute w-6 h-6 bg-white rounded-full top-1 transition-transform', isOnDuty ? 'translate-x-7' : 'translate-x-1')
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                            lineNumber: 43,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                        lineNumber: 34,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this),
            isOnDuty && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusButton, {
                        label: "Available",
                        active: status === 'available',
                        color: "bg-status-available",
                        onClick: ()=>handleStatusChange('available'),
                        disabled: loading
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                        lineNumber: 54,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusButton, {
                        label: "Busy",
                        active: status === 'busy',
                        color: "bg-status-busy",
                        onClick: ()=>handleStatusChange('busy'),
                        disabled: loading
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                        lineNumber: 61,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusButton, {
                        label: "On Break",
                        active: status === 'on_break',
                        color: "bg-gray-500",
                        onClick: ()=>handleStatusChange('on_break'),
                        disabled: loading
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                        lineNumber: 68,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
                lineNumber: 53,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
        lineNumber: 31,
        columnNumber: 5
    }, this);
}
_s(StatusToggle, "/Rjh5rPqCCqf0XYnTUk9ZNavw3Q=");
_c = StatusToggle;
function StatusButton({ label, active, color, onClick, disabled }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: disabled,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('flex-1 py-2 text-sm font-medium rounded-lg transition-colors', active ? `${color} text-white` : 'bg-ops-surface-raised text-gray-400', disabled && 'opacity-50'),
        children: label
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_c1 = StatusButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "StatusToggle");
__turbopack_context__.k.register(_c1, "StatusButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AssignmentDetail",
    ()=>AssignmentDetail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function AssignmentDetail({ assignment, onBack, onStatusUpdate }) {
    _s();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const updateStatus = async (status)=>{
        setLoading(status);
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/unit/incidents/${assignment.incidentId}/status`, {
                status
            });
            onStatusUpdate(status);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
        setLoading(null);
    };
    const requestBackup = async ()=>{
        setLoading('backup');
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/unit/incidents/${assignment.incidentId}/need-backup`);
            alert('Backup requested');
        } catch (error) {
            console.error('Failed to request backup:', error);
        }
        setLoading(null);
    };
    const resolveIncident = async ()=>{
        setLoading('resolve');
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/unit/incidents/${assignment.incidentId}/resolve`);
            onStatusUpdate('resolved');
            onBack();
        } catch (error) {
            console.error('Failed to resolve:', error);
        }
        setLoading(null);
    };
    const openMaps = ()=>{
        if (assignment.incident.latitude && assignment.incident.longitude) {
            window.open(`https://www.google.com/maps/dir/?api=1&destination=${assignment.incident.latitude},${assignment.incident.longitude}`, '_blank');
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-ops-bg safe-top safe-bottom",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-ops-surface border-b border-ops-border p-4 flex items-center gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onBack,
                        className: "text-gray-400",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "w-6 h-6",
                            fill: "none",
                            stroke: "currentColor",
                            viewBox: "0 0 24 24",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                strokeWidth: 2,
                                d: "M15 19l-7-7 7-7"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 69,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                            lineNumber: 68,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                        lineNumber: 67,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-lg font-bold text-white",
                                children: [
                                    assignment.incident.emergencyType.toUpperCase(),
                                    " Emergency"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 73,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400",
                                children: [
                                    "Status: ",
                                    assignment.incident.status.replace('_', ' ')
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 76,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4 space-y-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "bg-ops-surface rounded-xl p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-semibold text-gray-400 uppercase mb-3",
                                children: "Caller"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white font-medium mb-1",
                                children: assignment.incident.callerName || 'Unknown'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: `tel:${assignment.incident.callerPhone}`,
                                className: "text-blue-400 text-lg font-mono",
                                children: assignment.incident.callerPhone
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 89,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "bg-ops-surface rounded-xl p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-semibold text-gray-400 uppercase mb-3",
                                children: "Location"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 99,
                                columnNumber: 11
                            }, this),
                            assignment.incident.landmark && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-white mb-2",
                                children: assignment.incident.landmark
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 101,
                                columnNumber: 13
                            }, this),
                            assignment.incident.latitude && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-400 font-mono mb-3",
                                children: [
                                    assignment.incident.latitude.toFixed(6),
                                    ",",
                                    ' ',
                                    assignment.incident.longitude.toFixed(6)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 104,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: openMaps,
                                className: "w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center justify-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                        className: "w-5 h-5",
                                        fill: "none",
                                        stroke: "currentColor",
                                        viewBox: "0 0 24 24",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                                lineNumber: 114,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                strokeLinecap: "round",
                                                strokeLinejoin: "round",
                                                strokeWidth: 2,
                                                d: "M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                            }, void 0, false, {
                                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                                lineNumber: 115,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                        lineNumber: 113,
                                        columnNumber: 13
                                    }, this),
                                    "Open in Maps"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 109,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                        lineNumber: 98,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "bg-ops-surface rounded-xl p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-xs font-semibold text-gray-400 uppercase mb-3",
                                children: "Update Status"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 123,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusButton, {
                                        label: "En Route",
                                        onClick: ()=>updateStatus('en_route'),
                                        loading: loading === 'en_route',
                                        active: assignment.incident.status === 'en_route',
                                        color: "bg-cyan-600"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                        lineNumber: 127,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusButton, {
                                        label: "On Scene",
                                        onClick: ()=>updateStatus('on_scene'),
                                        loading: loading === 'on_scene',
                                        active: assignment.incident.status === 'on_scene',
                                        color: "bg-green-600"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                        lineNumber: 134,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 126,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: requestBackup,
                                disabled: loading === 'backup',
                                className: "w-full py-3 bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-medium rounded-xl",
                                children: loading === 'backup' ? 'Requesting...' : 'Request Backup'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 146,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: resolveIncident,
                                disabled: loading === 'resolve',
                                className: "w-full py-4 bg-green-700 hover:bg-green-800 disabled:opacity-50 text-white font-bold rounded-xl text-lg",
                                onTouchStart: (e)=>{
                                    const timer = setTimeout(()=>{
                                        resolveIncident();
                                    }, 1000);
                                    e.currentTarget.dataset.timer = String(timer);
                                },
                                onTouchEnd: (e)=>{
                                    const timer = e.currentTarget.dataset.timer;
                                    if (timer) clearTimeout(Number(timer));
                                },
                                children: loading === 'resolve' ? 'Resolving...' : 'RESOLVE (Hold)'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                                lineNumber: 154,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
                lineNumber: 82,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
        lineNumber: 64,
        columnNumber: 5
    }, this);
}
_s(AssignmentDetail, "GB86ilDv2e+FWPZKEI6FKzMMZ1c=");
_c = AssignmentDetail;
function StatusButton({ label, onClick, loading, active, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        disabled: loading || active,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('py-3 font-medium rounded-lg transition-colors', active ? `${color} text-white` : 'bg-ops-surface-raised text-gray-300 hover:text-white', loading && 'opacity-50'),
        children: loading ? '...' : label
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx",
        lineNumber: 191,
        columnNumber: 5
    }, this);
}
_c1 = StatusButton;
var _c, _c1;
__turbopack_context__.k.register(_c, "AssignmentDetail");
__turbopack_context__.k.register(_c1, "StatusButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>UnitPortal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/lib/api.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/lib/socket.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$components$2f$AssignmentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$components$2f$StatusToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/components/StatusToggle.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$components$2f$AssignmentDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/unit-portal-web/src/components/AssignmentDetail.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/node_modules/clsx/dist/clsx.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function UnitPortal() {
    _s();
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [unit, setUnit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [assignments, setAssignments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAssignment, setSelectedAssignment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [socketConnected, setSocketConnected] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UnitPortal.useEffect": ()=>{
            __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession().then({
                "UnitPortal.useEffect": ({ data: { session } })=>{
                    setSession(session);
                    setLoading(false);
                }
            }["UnitPortal.useEffect"]);
            __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "UnitPortal.useEffect": (_event, session)=>{
                    setSession(session);
                }
            }["UnitPortal.useEffect"]);
        }
    }["UnitPortal.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "UnitPortal.useEffect": ()=>{
            if (session) {
                fetchUnit();
                fetchAssignments();
                setupSocket();
            }
        }
    }["UnitPortal.useEffect"], [
        session
    ]);
    const fetchUnit = async ()=>{
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/unit/me');
            setUnit(data);
        } catch (error) {
            console.error('Failed to fetch unit:', error);
        }
    };
    const fetchAssignments = async ()=>{
        try {
            const data = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].get('/unit/me/assignments?active=true');
            setAssignments(data);
        } catch (error) {
            console.error('Failed to fetch assignments:', error);
        }
    };
    const setupSocket = async ()=>{
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["connectSocket"])();
            setSocketConnected(true);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('assignment:offered', (data)=>{
                const newAssignment = {
                    id: data.assignmentId,
                    incidentId: data.incident.id,
                    status: 'offered',
                    offeredAt: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 90000).toISOString(),
                    incident: data.incident
                };
                setAssignments((prev)=>[
                        newAssignment,
                        ...prev
                    ]);
                // Play sound or vibrate
                if ('vibrate' in navigator) {
                    navigator.vibrate([
                        200,
                        100,
                        200
                    ]);
                }
            });
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$socket$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["subscribeToEvent"])('assignment:cancelled', (data)=>{
                setAssignments((prev)=>prev.filter((a)=>a.id !== data.assignmentId));
            });
        } catch (error) {
            console.error('Socket connection failed:', error);
        }
    };
    const handleStatusChange = async (status, isOnDuty)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post('/unit/me/status', {
                status,
                isOnDuty
            });
            setUnit((prev)=>prev ? {
                    ...prev,
                    status,
                    isOnDuty
                } : null);
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };
    const handleAccept = async (assignmentId)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/unit/assignments/${assignmentId}/accept`);
            setAssignments((prev)=>prev.map((a)=>a.id === assignmentId ? {
                        ...a,
                        status: 'accepted'
                    } : a));
        } catch (error) {
            console.error('Failed to accept:', error);
        }
    };
    const handleDecline = async (assignmentId, reason)=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["api"].post(`/unit/assignments/${assignmentId}/decline`, {
                reason
            });
            setAssignments((prev)=>prev.filter((a)=>a.id !== assignmentId));
        } catch (error) {
            console.error('Failed to decline:', error);
        }
    };
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-ops-bg",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 151,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
            lineNumber: 150,
            columnNumber: 7
        }, this);
    }
    if (!session) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LoginScreen, {}, void 0, false, {
            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
            lineNumber: 157,
            columnNumber: 12
        }, this);
    }
    if (selectedAssignment) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$components$2f$AssignmentDetail$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssignmentDetail"], {
            assignment: selectedAssignment,
            onBack: ()=>setSelectedAssignment(null),
            onStatusUpdate: (status)=>{
                setAssignments((prev)=>prev.map((a)=>a.id === selectedAssignment.id ? {
                            ...a,
                            incident: {
                                ...a.incident,
                                status
                            }
                        } : a));
            }
        }, void 0, false, {
            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
            lineNumber: 162,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-ops-bg safe-top safe-bottom",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "bg-ops-surface border-b border-ops-border p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-lg font-bold text-white",
                                    children: unit?.callSign || 'Loading...'
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                    lineNumber: 184,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-400",
                                    children: unit?.agencyName
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                    lineNumber: 187,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 183,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('w-2 h-2 rounded-full', socketConnected ? 'bg-green-500' : 'bg-red-500')
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                    lineNumber: 190,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('px-2 py-1 text-xs font-medium rounded', unit?.status === 'available' ? 'bg-status-available text-white' : unit?.status === 'busy' ? 'bg-status-busy text-white' : 'bg-status-offline text-white'),
                                    children: unit?.status?.toUpperCase()
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 189,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                    lineNumber: 182,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 181,
                columnNumber: 7
            }, this),
            unit && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$components$2f$StatusToggle$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["StatusToggle"], {
                status: unit.status,
                isOnDuty: unit.isOnDuty,
                onChange: handleStatusChange
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 214,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-sm font-semibold text-gray-400 uppercase mb-3",
                        children: "Active Assignments"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    assignments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-12 text-gray-500",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-16 h-16 mx-auto mb-4 opacity-50",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 1.5,
                                    d: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                }, void 0, false, {
                                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                    lineNumber: 235,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 229,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "No active assignments"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm mt-1",
                                children: "You'll be notified of new calls"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 243,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 228,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: assignments.map((assignment)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$components$2f$AssignmentCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AssignmentCard"], {
                                assignment: assignment,
                                onAccept: ()=>handleAccept(assignment.id),
                                onDecline: (reason)=>handleDecline(assignment.id, reason),
                                onSelect: ()=>setSelectedAssignment(assignment)
                            }, assignment.id, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 248,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 246,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "fixed bottom-0 left-0 right-0 bg-ops-surface border-t border-ops-border safe-bottom",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavButton, {
                            active: true,
                            icon: "home",
                            label: "Home"
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 263,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavButton, {
                            icon: "history",
                            label: "History",
                            onClick: ()=>{}
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 264,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(NavButton, {
                            icon: "profile",
                            label: "Profile",
                            onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signOut()
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 265,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                    lineNumber: 262,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
_s(UnitPortal, "g9qInjqIB2bgJZlY7S3OCwozQWM=");
_c = UnitPortal;
function NavButton({ active, icon, label, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])('flex-1 py-3 flex flex-col items-center gap-1', active ? 'text-blue-400' : 'text-gray-400'),
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-6 h-6",
                fill: "none",
                stroke: "currentColor",
                viewBox: "0 0 24 24",
                children: [
                    icon === 'home' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 293,
                        columnNumber: 11
                    }, this),
                    icon === 'history' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 296,
                        columnNumber: 11
                    }, this),
                    icon === 'profile' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        strokeLinecap: "round",
                        strokeLinejoin: "round",
                        strokeWidth: 2,
                        d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    }, void 0, false, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 299,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs",
                children: label
            }, void 0, false, {
                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
        lineNumber: 284,
        columnNumber: 5
    }, this);
}
_c1 = NavButton;
function LoginScreen() {
    _s1();
    const [phone, setPhone] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [step, setStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('phone');
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const handleSendOtp = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithOtp({
                phone: phone.startsWith('+') ? phone : `+233${phone.replace(/^0/, '')}`
            });
            if (error) throw error;
            setStep('otp');
        } catch (err) {
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };
    const handleVerifyOtp = async (e)=>{
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.verifyOtp({
                phone: phone.startsWith('+') ? phone : `+233${phone.replace(/^0/, '')}`,
                token: otp,
                type: 'sms'
            });
            if (error) throw error;
        } catch (err) {
            setError(err.message);
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-ops-bg p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-sm",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xl font-bold text-white",
                                children: "SP"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 356,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 355,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-2xl font-bold text-white",
                            children: "Unit Portal"
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 358,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-400",
                            children: "Sign in to continue"
                        }, void 0, false, {
                            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                            lineNumber: 359,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                    lineNumber: 354,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-ops-surface rounded-xl p-6",
                    children: step === 'phone' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSendOtp,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-300 mb-2",
                                children: "Phone Number"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 365,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex gap-2 mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex items-center px-3 bg-ops-surface-raised rounded-l-lg text-gray-400",
                                        children: "+233"
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "tel",
                                        value: phone,
                                        onChange: (e)=>setPhone(e.target.value),
                                        placeholder: "24 123 4567",
                                        className: "flex-1 px-4 py-3 bg-ops-surface-raised rounded-r-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500",
                                        required: true
                                    }, void 0, false, {
                                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                        lineNumber: 372,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 368,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 text-sm mb-4",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 381,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loading,
                                className: "w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg",
                                children: loading ? 'Sending...' : 'Send OTP'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 382,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 364,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleVerifyOtp,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                className: "block text-sm font-medium text-gray-300 mb-2",
                                children: "Verification Code"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 392,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: otp,
                                onChange: (e)=>setOtp(e.target.value),
                                placeholder: "000000",
                                className: "w-full px-4 py-3 mb-4 bg-ops-surface-raised rounded-lg text-white text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500",
                                maxLength: 6,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 395,
                                columnNumber: 15
                            }, this),
                            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-red-400 text-sm mb-4",
                                children: error
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 404,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loading,
                                className: "w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg mb-3",
                                children: loading ? 'Verifying...' : 'Verify'
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 405,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$unit$2d$portal$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setStep('phone'),
                                className: "w-full py-2 text-gray-400 text-sm",
                                children: "Change number"
                            }, void 0, false, {
                                fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                                lineNumber: 412,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                        lineNumber: 391,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
                    lineNumber: 362,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
            lineNumber: 353,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/unit-portal-web/src/app/page.tsx",
        lineNumber: 352,
        columnNumber: 5
    }, this);
}
_s1(LoginScreen, "nghX6gg/uiwimYAL1J6YuoAvfEI=");
_c2 = LoginScreen;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "UnitPortal");
__turbopack_context__.k.register(_c1, "NavButton");
__turbopack_context__.k.register(_c2, "LoginScreen");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=SafePulse_apps_unit-portal-web_src_f8747eaa._.js.map