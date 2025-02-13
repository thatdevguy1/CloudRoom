// App.jsq
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

function Auth() {
  const auth = useAuth();

  const handleSignout = async () => {
    auth.removeUser();
    window.location.href = `https://us-east-1883wzbpgq.auth.us-east-1.amazoncognito.com/logout?client_id=2qc9uch823amu97rhd8r1tcvpa&logout_uri=${
      import.meta.env.VITE_LOGOUT_REDIRECT_URI
    }`;
  };

  if (auth.isLoading) {
    return <Skeleton className="w-[86.55px] h-[35px] rounded-xl " />;
  }

  if (auth.error) {
    console.log(auth.error);
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    console.log(auth);
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
      <Button onClick={() => auth.signinRedirect()}>Sign up</Button>
    </div>
  );
}

export default Auth;
