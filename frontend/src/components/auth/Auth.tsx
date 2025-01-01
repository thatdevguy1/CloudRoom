// App.jsq
import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Auth() {
  const auth = useAuth();

  useEffect(() => {
    if (auth.isAuthenticated) {
      localStorage.setItem("id_token", auth.user?.id_token || "");
      localStorage.setItem("access_token", auth.user?.access_token || "");
      localStorage.setItem("refresh_token", auth.user?.refresh_token || "");
    }
  }, [auth.isAuthenticated]);

  const signOutRedirect = () => {
    const clientId = "2qc9uch823amu97rhd8r1tcvpa";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  const signUpRedirect = () => {
    const clientId = "2qc9uch823amu97rhd8r1tcvpa";
    const signUpUri = "http://localhost:5173/callback";
    const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN;
    window.location.href = `${cognitoDomain}/signup?client_id=${clientId}&code_challenge=OQSY9NXNOZrGZUUPsfnuvLMiY5M4Bx0yQ-DMqHbycvE&code_challenge_method=S256&redirect_uri=${encodeURIComponent(
      signUpUri
    )}&response_type=code&scope=openid+email&state=88fe80bb2b234a9698318ec254f37f93`;
  };

  if (auth.isLoading) {
    return <Skeleton className="w-[86.55px] h-[35px] rounded-xl " />;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <Button onClick={() => auth.removeUser()}>Sign out</Button>
      </div>
    );
  }

  return (
    <div>
      <Button
        className="mr-3"
        variant="outline"
        onClick={() => auth.signinRedirect()}
      >
        Sign in
      </Button>
      <Button onClick={() => signUpRedirect()}>Sign up</Button>
    </div>
  );
}

export default Auth;
