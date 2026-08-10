/**
 * HTML-escape user input before interpolating into email HTML bodies.
 *
 * The contact form sends an HTML email via Resend. Without escaping, a user
 * could submit `<script>alert(1)</script>` as their name, which would render
 * in the email client. While most email clients sanitize HTML, this is still
 * a bad practice and an HTML injection vector.
 */
export function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
