import "dotenv/config";

// cPanel/Passenger entrypoint for the standalone NMS portal.
// cPanel supplies PORT; secrets must remain in the server-side environment or .env.
process.env.NODE_ENV ||= "production";
await import("./dist/cpanel-index.js");
