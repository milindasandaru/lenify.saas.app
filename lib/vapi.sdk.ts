import Vapi from "@vapi-ai/web";

const token = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN || "";
if (!token) {
    // Surface a helpful message in the browser console if token is missing
    console.warn("Vapi: NEXT_PUBLIC_VAPI_WEB_TOKEN is empty. Calls will fail with 4xx.");
}

export const vapi = new Vapi(token);