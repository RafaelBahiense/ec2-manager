import { useAuthContext } from "@/hooks/useAuthContext";

export default function Home() {
  const { user } = useAuthContext();

  return (
    <div>
      <h1>Olá {user?.name}</h1>
      <img src={user?.picture} alt={user?.name} />
    </div>
  );
}
