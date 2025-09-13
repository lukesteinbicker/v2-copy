import { Link } from "@tanstack/react-router";
import { signOut } from "~/lib/auth/auth-client";
import { useRouter } from "@tanstack/react-router";

export function UserMenu() {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      await router.invalidate();
      router.navigate({ to: "/login" });
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Link to="/">
        <button className="px-4 py-2 text-primary-foreground">
          Profile
        </button>
      </Link>
      <button
        onClick={handleSignOut}
        className="px-4 py-2 text-primary-foreground"
      >
        Sign Out
      </button>
    </div>
  );
} 