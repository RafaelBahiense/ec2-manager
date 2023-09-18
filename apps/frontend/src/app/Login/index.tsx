import { AuthContextType } from "@/contexts/AuthContext";
import { useAuthContext } from "@/hooks/useAuthContext";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { Card, Typography } from "antd";

const { Title } = Typography;

export default function Login() {
  return (
    <div>
      <LoginForm />
    </div>
  );
}

function LoginForm() {
  const authContext = useAuthContext();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
      }}
    >
      <Card style={{ width: 500 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <Title level={2}>EC2 Manager</Title>
          <GoogleLogin
            onSuccess={(data) => googleLogin(data, authContext)}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </div>
      </Card>
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
  authContext.setUser(data);
  console.log(data);
}
