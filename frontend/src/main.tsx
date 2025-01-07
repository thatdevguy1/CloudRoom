import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { AuthProvider } from "react-oidc-context";
import { BrowserRouter } from "react-router";
import { WebStorageStateStore } from "oidc-client-ts";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const stripeOptions = {
  clientSecret: import.meta.env.VITE_STRIPE_SECRET_KEY,
};

console.log("VITE_REDIRECT_URI", import.meta.env.VITE_REDIRECT_URI);
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_883WzBpGQ",
  client_id: "2qc9uch823amu97rhd8r1tcvpa",
  redirect_uri: import.meta.env.VITE_REDIRECT_URI,
  response_type: "code",
  scope: "openid email",
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
  post_logout_redirect_uri: import.meta.env.VITE_LOGOUT_REDIRECT_URI,
};

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Elements stripe={stripePromise} options={stripeOptions}> */}
    <AuthProvider {...cognitoAuthConfig}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
    {/* </Elements> */}
  </StrictMode>
);
