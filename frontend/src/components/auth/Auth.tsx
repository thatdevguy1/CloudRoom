// App.jsq
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { signUpRedirect } from "@/utils/auth";

function Auth() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSignout = async () => {
    await auth.signoutRedirect();
    navigate("/");
  };

  if (auth.isLoading) {
    return <Skeleton className="w-[86.55px] h-[35px] rounded-xl " />;
  }

  if (auth.error) {
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
      <Button onClick={() => signUpRedirect()}>Sign up</Button>
    </div>
  );
}

export default Auth;
