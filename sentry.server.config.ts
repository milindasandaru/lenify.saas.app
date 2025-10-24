// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

Sentry.init({
  // DSN is not a secret. We read from env to avoid hardcoding and ease environment changes.
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,

  // Lower sampling in production to control cost; use higher rate in dev.
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1,

  // Enable verbose logs outside production
  enableLogs: process.env.NODE_ENV !== "production",

  // Enable sending user PII (Personally Identifiable Information)
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#sendDefaultPii
  sendDefaultPii: true,
});
