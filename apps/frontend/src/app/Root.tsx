import { AuthProvider } from "@/contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Outlet } from "@tanstack/react-router";
import { CookiesProvider } from "react-cookie";

export default function Root() {
  return (
    <AuthProvider>
      <GoogleOAuthProvider
        clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
      >
        <CookiesProvider>
          <Outlet />
        </CookiesProvider>
      </GoogleOAuthProvider>
    </AuthProvider>
  );
}
