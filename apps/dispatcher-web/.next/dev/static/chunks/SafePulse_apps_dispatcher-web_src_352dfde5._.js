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
"[project]/SafePulse/apps/dispatcher-web/src/app/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Home
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/SafePulse/apps/dispatcher-web/src/store/auth.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Home() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { session, loading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Home.useEffect": ()=>{
            if (!loading) {
                if (session) {
                    router.replace('/dispatcher');
                } else {
                    router.replace('/login');
                }
            }
        }
    }["Home.useEffect"], [
        session,
        loading,
        router
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen flex items-center justify-center bg-ops-bg",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/page.tsx",
                    lineNumber: 24,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-gray-400",
                    children: "Loading SafePulse..."
                }, void 0, false, {
                    fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/page.tsx",
                    lineNumber: 25,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/page.tsx",
            lineNumber: 23,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/SafePulse/apps/dispatcher-web/src/app/page.tsx",
        lineNumber: 22,
        columnNumber: 5
    }, this);
}
_s(Home, "9pgwj9cd/ytIhgqxuwFhQOEmkOk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$SafePulse$2f$apps$2f$dispatcher$2d$web$2f$src$2f$store$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = Home;
var _c;
__turbopack_context__.k.register(_c, "Home");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=SafePulse_apps_dispatcher-web_src_352dfde5._.js.map