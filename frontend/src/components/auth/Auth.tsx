// App.jsq
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface AuthProps {
  setLoggedIn: (isLoggedIn: boolean) => void;
  loggedIn: boolean;
}

function Auth({ setLoggedIn, loggedIn }: AuthProps) {
  const auth = useAuth();

  const handleSignout = () => {
    auth.removeUser();
    setLoggedIn(false);
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

  if (loggedIn) {
    return (
      <div>
        <Button onClick={handleSignout}>Sign out</Button>
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
