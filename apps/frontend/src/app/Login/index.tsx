import { AuthContextType } from "@/contexts/AuthContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export default function Login() {
  return (
    <div className="h-screen flex justify-center items-center bg-gray-200">
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  const authContext = useAuthContext();

  const [loginError, setLoginError] = useState(false);

  return (
    <div className="bg-white p-8 rounded shadow-md w-96 flex flex-col items-center">
      <Title level={2} className="mb-4">
        EC2 Manager
      </Title>

      <GoogleLogin
        onSuccess={(data) => {
          googleLogin(data, authContext);
          setLoginError(false);
        }}
        onError={() => {
          setLoginError(true);
        }}
      />
      {loginError && (
        <p className="mt-4 text-red-500">Login failed. Please try again.</p>
      )}
    </div>
  );
}

async function googleLogin(
  googleData: CredentialResponse,
  authContext: AuthContextType
) {
  const response = await fetch(import.meta.env.VITE_API_URL + "auth/google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: googleData.credential,
    }),
  });
  const data = await response.json();
  authContext.login(data);
}
