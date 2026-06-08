import { LogoutButton } from "@/features/auth/components/LogoutButton";

export function Home() {
  return (
    <div>
      <h1 className="text-xl font-bold">Pantalla Home</h1>
      <p>Panel principal de InsuliDog.</p>
      <LogoutButton variant="outline" className="w-full" />
    </div>
  );
}
