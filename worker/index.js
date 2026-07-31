/**
 * Cloudflare Worker entry for the Sites-hosted static town.
 * The local Node BFF remains the production path for live data; this hosted
 * showcase safely falls back to the built-in demonstration snapshot.
 */
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== "GET") return response;

    const accept = request.headers.get("accept") || "";
    if (!accept.includes("text/html")) return response;

    const url = new URL(request.url);
    url.pathname = "/index.html";
    url.search = "";
    return env.ASSETS.fetch(new Request(url, request));
  },
};
