import cors from "cors";

const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:1234",
  "https://movies.com",
  "https://midu.dev",
  "http://localhost:5173",
];

const normalizeOrigin = (value) => value?.replace(/\/$/, "");

export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    origin: (origin, callback) => {
      const normalizedOrigin = normalizeOrigin(origin);
      const normalizedAcceptedOrigins = acceptedOrigins.map(normalizeOrigin);

      if (normalizedAcceptedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  });
