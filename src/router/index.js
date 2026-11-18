import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "@/views/Dashboard.vue";
import Login from "@/views/Login.vue";
import UnifiedApproverHub from "../views/UnifiedApproverHub.vue";

const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { fullpage: true }
  },
  {
    path: "/v2-approver",
    name: "ApproverV2",
    component: UnifiedApproverHub,
    meta: { requiresAuth: true, roles: ['ADMIN', 'USER', 'APPROVER', 'REVIEWER'] }
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("@/views/ForgotPassword.vue"),
    meta: { fullpage: true }
  },

  {
    path: "/activate-account",
    name: "ActivateAccount",
    component: () => import("@/views/ActivateAccount.vue"),
    meta: { fullpage: true }
  },

  {
    path: "/reset-password",
    name: "ResetPassword",
    component: () => import("@/views/ResetPassword.vue"),
    meta: { fullpage: true }
  },

  {
    path: "/privacy-policy",
    name: "PrivacyPolicy",
    component: () => import("@/views/PrivacyPolicy.vue"),
    meta: { fullpage: true }
  },

  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/add-document",
    name: "AddDocument",
    component: () => import("@/views/AddDocument.vue"),
    meta: {
      requiresAuth: true,
      roles: ["USER"],
      requiresPureUser: true
    },
  },
  {
    path: '/view-document',
    name: 'ViewDocument',
    component: () => import('@/views/ViewDocument.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/view-document/:id',
    name: 'ViewDocumentDetail',
    component: () => import('@/views/ViewDocument.vue'),
    meta: { requiresAuth: true },
    props: true
  },
  {
    path: "/drafts",
    name: "Draft",
    component: () => import("@/views/DraftDocuments.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/approver",
    name: "Approver",
    component: () => import("@/views/Approver.vue"),
    meta: { requiresAuth: true, roles: ['ADMIN', 'USER', 'APPROVER', 'REVIEWER'] }
  },
  {
    path: "/arsip",
    name: "Arsip",
    component: () => import("@/views/admin/Arsip.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/admin/dashboard",
    name: "AdminDashboard",
    component: () => import("@/views/admin/AdminDashboard.vue"),
    meta: { requiresAuth: true, roles: ["ADMIN"] } // ✅ UBAH: roles jadi array
  },
  {
    path: "/admin/approvals",
    name: "AdminApprovals",
    component: () => import("@/views/admin/ApprovalManagement.vue"),
    meta: { requiresAuth: true, roles: ["ADMIN"] }
  },
  {
    path: "/admin/analytics",
    name: "PlatformAnalytics",
    component: () => import("@/views/admin/PlatformAnalytics.vue"),
    meta: { requiresAuth: true, roles: ["ADMIN"] }
  },
  {
    path: "/admin/security",
    name: "AdminSecurity",
    component: () => import("@/views/admin/SecuritySettings.vue"),
    meta: { requiresAuth: true, roles: ["ADMIN"] }
  },
  {
    path: "/admin/logs",
    name: "AdminLogs",
    component: () => import("@/views/admin/AdminLogs.vue"),
    meta: { requiresAuth: true, roles: ["ADMIN"] }
  },

  {
    path: '/user-guide',
    name: 'UserGuide',
    component: () => import('@/views/UserGuide.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: "/my-account",
    name: "MyAccount",
    component: () => import("@/views/MyAccount.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/pengaturan",
    name: "Pengaturan",
    component: () => import("@/views/Pengaturan.vue"),
    meta: { requiresAuth: true },
  },

  {
    path: "/pengaturan-user",
    name: "PengaturanUser",
    component: () => import("@/views/PengaturanUser.vue"),
    meta: { requiresAuth: true, roles: ["USER"] } // ✅ UBAH
  },

  {
    path: "/admin/users",
    name: "Users",
    component: () => import("@/views/Users.vue"),
    meta: { requiresAuth: true, roles: ["ADMIN"] }, // ✅ TAMBAH
  },

  {
    path: "/approval-detail",
    name: "ApprovalDetail",
    component: () => import("@/views/ApproverDetail.vue"),
    meta: { requiresAuth: true, roles: ['ADMIN', 'USER', 'APPROVER', 'REVIEWER'] }
  },

  // 404 — semua URL yang tidak dikenal tampilkan halaman Not Found
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("@/views/NotFound.vue"),
    meta: { fullpage: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// 🔒 NAVIGATION GUARD - DIPERBAIKI
router.beforeEach((to, from, next) => {

  const userString = localStorage.getItem("user");
  const needsAuth = to.matched.some(r => r.meta.requiresAuth);

  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (error) {
      console.error("Error parsing user:", error);
      localStorage.removeItem("user");
    }
  }

  // 🚫 Halaman butuh auth tapi tidak ada user
  if (needsAuth && !user) {
    return next({ name: "Login" });
  }

  // ✅ Sudah login, jangan ke halaman login lagi
  if (user && to.name === "Login") {
    const userRoles = Array.isArray(user.roles) ? user.roles : [];
    return next(
      userRoles.includes("ADMIN") ? { name: "AdminDashboard" } : { name: "Dashboard" }
    );
  }



  // 🔐 ✅ PERBAIKAN: CEK ROLES ARRAY
  if (to.meta.roles) {
    const userRoles = Array.isArray(user?.roles) ? user.roles : [];
    const hasAccess = to.meta.roles.some(role => userRoles.includes(role));

    if (!hasAccess) {
      return next(
        userRoles.includes("ADMIN") ? { name: "AdminDashboard" } : { name: "Dashboard" }
      );
    }
  }

  next();
});

export default router;