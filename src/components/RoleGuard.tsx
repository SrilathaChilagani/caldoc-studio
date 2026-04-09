import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAppAuth } from "@/contexts/AppAuthContext";
import { Layout } from "@/components/Layout";

interface RoleGuardProps {
  requiredRole: string;
  portalKey: string;
  children: React.ReactNode;
}

export function RoleGuard({ requiredRole, portalKey, children }: RoleGuardProps) {
  const { user, loading, hasRole } = useAppAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate(`/login?portal=${portalKey}`);
    }
  }, [loading, user, navigate, portalKey]);

  if (loading) {
    return (
      <Layout>
        <div className="pt-24 text-center text-muted-foreground">Loading…</div>
      </Layout>
    );
  }

  if (!user) return null;

  if (!hasRole(requiredRole)) {
    return (
      <Layout>
        <div className="pt-24 pb-10 min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4 max-w-md px-4">
            <h1 className="text-2xl font-semibold text-foreground">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have the <span className="font-medium text-foreground">{requiredRole}</span> role required to access this portal.
              Please contact an administrator to request access.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-primary font-medium hover:underline"
            >
              Go to homepage
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return <>{children}</>;
}
