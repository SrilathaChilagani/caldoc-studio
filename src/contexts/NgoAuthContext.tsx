import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type NgoAuthContext = {
  user: User | null;
  session: Session | null;
  ngoId: string | null;
  ngoName: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, ngoName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
};

const NgoAuthContext = createContext<NgoAuthContext | null>(null);

export function useNgoAuth() {
  const ctx = useContext(NgoAuthContext);
  if (!ctx) throw new Error("useNgoAuth must be used within NgoAuthProvider");
  return ctx;
}

export function NgoAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [ngoId, setNgoId] = useState<string | null>(null);
  const [ngoName, setNgoName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadNgoInfo(userId: string) {
    const { data: membership } = await supabase
      .from("ngo_members")
      .select("ngo_id")
      .eq("user_id", userId)
      .maybeSingle();

    if (membership?.ngo_id) {
      setNgoId(membership.ngo_id);
      const { data: ngo } = await supabase
        .from("ngos")
        .select("name")
        .eq("id", membership.ngo_id)
        .maybeSingle();
      setNgoName(ngo?.name || null);
    } else {
      setNgoId(null);
      setNgoName(null);
    }
  }

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        await loadNgoInfo(session.user.id);
      } else {
        setNgoId(null);
        setNgoName(null);
      }
      setLoading(false);
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        await loadNgoInfo(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message || null };
  }

  async function signUp(email: string, password: string, ngoNameInput: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    });
    if (error) return { error: error.message };

    // Create NGO and membership for new user
    if (data.user) {
      const slug = ngoNameInput.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
      const { data: ngo, error: ngoErr } = await supabase
        .from("ngos")
        .insert({ name: ngoNameInput, slug: `${slug}-${Date.now()}` })
        .select("id")
        .single();

      if (ngoErr) return { error: ngoErr.message };

      const { error: memberErr } = await supabase
        .from("ngo_members")
        .insert({ user_id: data.user.id, ngo_id: ngo.id, role: "admin" });

      if (memberErr) return { error: memberErr.message };

      setNgoId(ngo.id);
      setNgoName(ngoNameInput);
    }

    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setNgoId(null);
    setNgoName(null);
  }

  return (
    <NgoAuthContext.Provider value={{ user, session, ngoId, ngoName, loading, signIn, signUp, signOut }}>
      {children}
    </NgoAuthContext.Provider>
  );
}
