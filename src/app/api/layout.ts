// Route segment config for all API routes.
// This replaces the `functions` key that was previously in vercel.json.
// Vercel scans every route for a source file when `functions` is present in
// vercel.json, and warns about auto-generated metadata routes like
// /manifest.webmanifest (sourced from manifest.ts, not a route.ts).
// Setting maxDuration here via route segment config avoids that warning while
// keeping the 30-second timeout on every API route handler.
export const maxDuration = 30;

// Layouts require a default export, but for route handlers (route.ts) Next.js
// returns the Response directly and never renders this component — it only
// reads the route segment config above. A simple passthrough is enough.
export default function ApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
