import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Plus, X, Loader2 } from "lucide-react";

const ALL_ROLES = ["admin", "provider", "pharmacy", "labs", "patient"] as const;

type UserRow = {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
  roles: string[];
};

export function UserRolesTab() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<UserRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);

  async function fetchUsers(p = 0) {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("manage-roles", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        body: undefined,
      });

      // Since functions.invoke doesn't support query params well for GET, use fetch directly
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-roles?action=list&search=${encodeURIComponent(search)}&page=${p}`;
      const session = (await supabase.auth.getSession()).data.session;
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch users");
      setUsers(json.users);
      setTotal(json.total);
      setPage(p);
      setSearched(true);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function assignRole(userId: string, role: string) {
    setBusy(`${userId}-${role}`);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-roles?action=assign`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(`Role "${role}" assigned`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roles: [...u.roles, role] } : u))
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  }

  async function removeRole(userId: string, role: string) {
    setBusy(`${userId}-${role}`);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-roles?action=remove`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user_id: userId, role }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      toast.success(`Role "${role}" removed`);
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, roles: u.roles.filter((r) => r !== role) } : u))
      );
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(null);
    }
  }

  const roleBadgeColor: Record<string, string> = {
    admin: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    provider: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    pharmacy: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
    labs: "bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300",
    patient: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  };

  return (
    <Card className="rounded-3xl">
      <CardContent className="p-6 space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">User role management</h2>
          <p className="text-sm text-muted-foreground">Search users and assign or remove roles.</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchUsers(0);
          }}
          className="flex gap-2"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by email or name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 rounded-xl"
            />
          </div>
          <Button type="submit" disabled={loading} className="rounded-xl">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
          </Button>
        </form>

        {searched && (
          <>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="rounded-2xl border border-border p-4 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                      <div>
                        <p className="font-medium text-foreground">{user.display_name || "—"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                      <p className="text-[10px] text-muted-foreground">
                        Joined {new Date(user.created_at).toLocaleDateString("en-IN")}
                      </p>
                    </div>

                    {/* Current roles */}
                    <div className="flex flex-wrap gap-1.5">
                      {user.roles.length === 0 && (
                        <span className="text-xs text-muted-foreground italic">No roles assigned</span>
                      )}
                      {user.roles.map((role) => (
                        <Badge
                          key={role}
                          variant="secondary"
                          className={`rounded-full text-xs gap-1 pr-1 ${roleBadgeColor[role] || ""}`}
                        >
                          {role}
                          <button
                            onClick={() => removeRole(user.id, role)}
                            disabled={busy === `${user.id}-${role}`}
                            className="ml-0.5 rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            title={`Remove ${role} role`}
                          >
                            {busy === `${user.id}-${role}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <X className="w-3 h-3" />
                            )}
                          </button>
                        </Badge>
                      ))}
                    </div>

                    {/* Add role buttons */}
                    {ALL_ROLES.filter((r) => !user.roles.includes(r)).length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground self-center mr-1">
                          Add:
                        </span>
                        {ALL_ROLES.filter((r) => !user.roles.includes(r)).map((role) => (
                          <Button
                            key={role}
                            size="sm"
                            variant="outline"
                            className="rounded-full text-xs h-7 gap-1"
                            disabled={busy === `${user.id}-${role}`}
                            onClick={() => assignRole(user.id, role)}
                          >
                            {busy === `${user.id}-${role}` ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Plus className="w-3 h-3" />
                            )}
                            {role}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={page === 0 || loading}
                  onClick={() => fetchUsers(page - 1)}
                >
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground self-center">
                  Page {page + 1}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-full"
                  disabled={(page + 1) * 20 >= total || loading}
                  onClick={() => fetchUsers(page + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
