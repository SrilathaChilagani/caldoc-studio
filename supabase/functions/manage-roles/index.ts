import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import { corsHeaders } from "https://esm.sh/@supabase/supabase-js@2.49.1/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Verify caller is authenticated admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify the caller
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } = await userClient.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const callerId = claimsData.claims.sub as string;

    // Check caller has admin role using service client
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const { data: callerRole } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", callerId)
      .eq("role", "admin")
      .maybeSingle();

    if (!callerRole) {
      return new Response(JSON.stringify({ error: "Forbidden: admin role required" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action");

    // LIST USERS with their roles
    if (req.method === "GET" && action === "list") {
      const search = url.searchParams.get("search") || "";
      const page = parseInt(url.searchParams.get("page") || "0");
      const limit = 20;

      // List users from auth
      const { data: usersData, error: usersError } = await adminClient.auth.admin.listUsers({
        page: page + 1,
        perPage: limit,
      });

      if (usersError) {
        return new Response(JSON.stringify({ error: usersError.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      let users = usersData.users || [];

      // Filter by search
      if (search) {
        const s = search.toLowerCase();
        users = users.filter(
          (u) =>
            u.email?.toLowerCase().includes(s) ||
            (u.user_metadata?.display_name || "").toLowerCase().includes(s)
        );
      }

      // Get roles for these users
      const userIds = users.map((u) => u.id);
      const { data: roles } = await adminClient
        .from("user_roles")
        .select("user_id, role")
        .in("user_id", userIds);

      const rolesMap: Record<string, string[]> = {};
      (roles || []).forEach((r) => {
        if (!rolesMap[r.user_id]) rolesMap[r.user_id] = [];
        rolesMap[r.user_id].push(r.role);
      });

      const result = users.map((u) => ({
        id: u.id,
        email: u.email,
        display_name: u.user_metadata?.display_name || null,
        created_at: u.created_at,
        roles: rolesMap[u.id] || [],
      }));

      return new Response(JSON.stringify({ users: result, total: usersData.total }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ASSIGN ROLE
    if (req.method === "POST" && action === "assign") {
      const { user_id, role } = await req.json();
      if (!user_id || !role) {
        return new Response(JSON.stringify({ error: "user_id and role required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      const validRoles = ["admin", "provider", "pharmacy", "labs", "patient"];
      if (!validRoles.includes(role)) {
        return new Response(JSON.stringify({ error: `Invalid role. Must be one of: ${validRoles.join(", ")}` }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { error } = await adminClient.from("user_roles").upsert(
        { user_id, role },
        { onConflict: "user_id,role" }
      );

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // REMOVE ROLE
    if (req.method === "POST" && action === "remove") {
      const { user_id, role } = await req.json();
      if (!user_id || !role) {
        return new Response(JSON.stringify({ error: "user_id and role required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { error } = await adminClient
        .from("user_roles")
        .delete()
        .eq("user_id", user_id)
        .eq("role", role);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid action" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
