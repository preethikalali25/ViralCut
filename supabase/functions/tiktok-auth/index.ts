import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/";
const TIKTOK_USER_INFO_URL = "https://open.tiktokapis.com/v2/user/info/";

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // ── ACTION: callback ──
    // TikTok redirects here after user authorizes
    if (action === "callback") {
      return await handleCallback(req, url);
    }

    // ── ACTION: get-auth-url ──
    // Frontend calls this to get the TikTok authorization URL
    if (req.method === "POST") {
      const body = await req.json();
      const actionType = body.action;

      if (actionType === "get-auth-url") {
        return handleGetAuthUrl(body);
      }

      if (actionType === "get-connection") {
        return await handleGetConnection(req);
      }

      if (actionType === "disconnect") {
        return await handleDisconnect(req);
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("TikTok auth error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

/**
 * Generate the TikTok authorization URL
 */
function handleGetAuthUrl(body: { redirect_uri?: string; state?: string }) {
  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY");
  if (!clientKey) {
    return new Response(
      JSON.stringify({ error: "TikTok client key not configured" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  // The callback URL is this edge function's callback endpoint
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const callbackUrl = `${supabaseUrl}/functions/v1/tiktok-auth?action=callback`;

  // Store the frontend redirect URL in state so we can redirect back after auth
  const frontendRedirect = body.redirect_uri || "";
  const stateData = JSON.stringify({
    csrf: body.state || crypto.randomUUID(),
    redirect: frontendRedirect,
  });
  const state = btoa(stateData);

  const scopes = "user.info.basic,user.info.profile,user.info.stats";

  const authUrl = new URL("https://www.tiktok.com/v2/auth/authorize/");
  authUrl.searchParams.set("client_key", clientKey);
  authUrl.searchParams.set("scope", scopes);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("redirect_uri", callbackUrl);
  authUrl.searchParams.set("state", state);

  console.log("Generated TikTok auth URL with callback:", callbackUrl);

  return new Response(
    JSON.stringify({ auth_url: authUrl.toString(), callback_url: callbackUrl }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * Handle the OAuth callback from TikTok
 */
async function handleCallback(_req: Request, url: URL) {
  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const error = url.searchParams.get("error");
  const errorDescription = url.searchParams.get("error_description");

  // Decode state to get frontend redirect
  let frontendRedirect = "";
  try {
    const stateData = JSON.parse(atob(stateParam || ""));
    frontendRedirect = stateData.redirect || "";
  } catch {
    console.error("Failed to decode state parameter");
  }

  // Fallback redirect
  if (!frontendRedirect) {
    frontendRedirect = Deno.env.get("SUPABASE_URL")?.replace(".backend.onspace.ai", ".onspace.app") || "";
  }

  // Handle error from TikTok
  if (error) {
    console.error("TikTok auth error:", error, errorDescription);
    const redirectUrl = new URL(frontendRedirect || "https://example.com");
    redirectUrl.pathname = "/connect/tiktok";
    redirectUrl.searchParams.set("error", errorDescription || error);
    return Response.redirect(redirectUrl.toString(), 302);
  }

  if (!code) {
    const redirectUrl = new URL(frontendRedirect || "https://example.com");
    redirectUrl.pathname = "/connect/tiktok";
    redirectUrl.searchParams.set("error", "No authorization code received");
    return Response.redirect(redirectUrl.toString(), 302);
  }

  const clientKey = Deno.env.get("TIKTOK_CLIENT_KEY") ?? "";
  const clientSecret = Deno.env.get("TIKTOK_CLIENT_SECRET") ?? "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const callbackUrl = `${supabaseUrl}/functions/v1/tiktok-auth?action=callback`;

  console.log("Exchanging code for token...");

  // Exchange authorization code for access token
  const tokenResponse = await fetch(TIKTOK_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", "Cache-Control": "no-cache" },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: callbackUrl,
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log("Token response status:", tokenResponse.status);

  if (tokenData.error) {
    console.error("TikTok token error:", tokenData.error, tokenData.error_description);
    const redirectUrl = new URL(frontendRedirect || "https://example.com");
    redirectUrl.pathname = "/connect/tiktok";
    redirectUrl.searchParams.set("error", tokenData.error_description || tokenData.error);
    return Response.redirect(redirectUrl.toString(), 302);
  }

  const { access_token, refresh_token, expires_in, open_id } = tokenData;

  console.log("Got access token for open_id:", open_id);

  // Fetch user profile info
  let displayName = "";
  let username = "";
  let avatarUrl = "";
  let followerCount = 0;

  try {
    const userInfoResponse = await fetch(
      `${TIKTOK_USER_INFO_URL}?fields=open_id,display_name,avatar_url,follower_count,username`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    const userInfoData = await userInfoResponse.json();
    console.log("User info response:", JSON.stringify(userInfoData));

    if (userInfoData.data?.user) {
      const user = userInfoData.data.user;
      displayName = user.display_name || "";
      username = user.username || "";
      avatarUrl = user.avatar_url || "";
      followerCount = user.follower_count || 0;
    }
  } catch (e) {
    console.error("Failed to fetch TikTok user info:", e);
  }

  // Store in database using service role client
  const supabaseAdmin = createClient(
    supabaseUrl,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  const expiresAt = new Date(Date.now() + (expires_in || 86400) * 1000).toISOString();

  const { error: dbError } = await supabaseAdmin
    .from("tiktok_connections")
    .upsert(
      {
        tiktok_open_id: open_id,
        access_token,
        refresh_token: refresh_token || null,
        token_expires_at: expiresAt,
        display_name: displayName,
        username,
        avatar_url: avatarUrl,
        follower_count: followerCount,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "tiktok_open_id" }
    );

  if (dbError) {
    console.error("Database error:", dbError);
    const redirectUrl = new URL(frontendRedirect || "https://example.com");
    redirectUrl.pathname = "/connect/tiktok";
    redirectUrl.searchParams.set("error", "Failed to store connection");
    return Response.redirect(redirectUrl.toString(), 302);
  }

  console.log("Successfully stored TikTok connection for:", username || open_id);

  // Redirect back to frontend with success
  const redirectUrl = new URL(frontendRedirect || "https://example.com");
  redirectUrl.pathname = "/connect/tiktok";
  redirectUrl.searchParams.set("success", "true");
  redirectUrl.searchParams.set("open_id", open_id);
  redirectUrl.searchParams.set("display_name", displayName);
  redirectUrl.searchParams.set("username", username);
  redirectUrl.searchParams.set("avatar_url", avatarUrl);
  redirectUrl.searchParams.set("follower_count", String(followerCount));

  return Response.redirect(redirectUrl.toString(), 302);
}

/**
 * Get the current TikTok connection (if any)
 */
async function handleGetConnection(req: Request) {
  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Get latest connection
  const { data, error } = await supabaseAdmin
    .from("tiktok_connections")
    .select("*")
    .order("connected_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Error fetching connection:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch connection" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }

  return new Response(
    JSON.stringify({ connection: data }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

/**
 * Disconnect TikTok account
 */
async function handleDisconnect(req: Request) {
  const body = await req.json().catch(() => ({}));
  const openId = body.open_id;

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  // Optionally revoke the token at TikTok
  if (openId) {
    const { data } = await supabaseAdmin
      .from("tiktok_connections")
      .select("access_token")
      .eq("tiktok_open_id", openId)
      .maybeSingle();

    if (data?.access_token) {
      try {
        await fetch("https://open.tiktokapis.com/v2/oauth/revoke/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            client_key: Deno.env.get("TIKTOK_CLIENT_KEY") ?? "",
            client_secret: Deno.env.get("TIKTOK_CLIENT_SECRET") ?? "",
            token: data.access_token,
          }),
        });
      } catch (e) {
        console.error("Failed to revoke TikTok token:", e);
      }
    }

    const { error } = await supabaseAdmin
      .from("tiktok_connections")
      .delete()
      .eq("tiktok_open_id", openId);

    if (error) {
      console.error("Error deleting connection:", error);
    }
  }

  return new Response(
    JSON.stringify({ success: true }),
    { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}
