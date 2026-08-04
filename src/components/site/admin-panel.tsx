"use client";

/**
 * Legacy AdminPanel — previously a slide-in overlay triggered by
 * Ctrl+Shift+A or the footer "Admin Access" link.
 *
 * As of Task 15 the admin dashboard is a dedicated full-page view at
 * /?view=admin. This file is kept as a thin re-export so any deep import
 * of <AdminPanel /> continues to render the new full-page dashboard.
 *
 * New code should import { AdminDashboard } from "@/components/site/admin-dashboard"
 * directly and mount it under the /?view=admin route (already wired in
 * src/app/page.tsx).
 */

export { AdminDashboard as AdminPanel } from "@/components/site/admin-dashboard";
