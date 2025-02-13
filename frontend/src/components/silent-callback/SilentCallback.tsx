import { useEffect } from "react";
import { Skeleton } from "../ui/skeleton";
import { useAuth } from "react-oidc-context";

function SilentCallback() {
  const auth = useAuth();
  useEffect(() => {
    if (auth.error) {
      auth.signinRedirect();
    }
  }, []);
  return (
    <>
      <div className="flex flex-row justify-around">
        <Skeleton className="w-[13vw] h-[90vh] rounded-lg " />
        <Skeleton className="w-[85vw] h-[90vh] rounded-lg " />
      </div>
    </>
  );
}

export default SilentCallback;
