import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/')({
  component: Index,
  beforeLoad: async ({ context }) => {
    const { session } = context;
    return { session };
  },
});

function Index() {
  const { session } = Route.useRouteContext();
  
  if (session && 'user' in session && session.user) {
    return (
      <div className="p-2">
        <h3 className="text-lg font-bold">Welcome, {session.user.name || 'User'}!</h3>
        <div className="mt-4">
          <p>You're now signed in to your account.</p>
          <p>Here you can manage your collections and gallery settings.</p>
          {/* Content for authenticated users */}
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-2">
      <h3 className="text-lg font-bold">Welcome Guest!</h3>
      <div className="mt-4">
        <p>Please sign in or create an account to get started.</p>
        {/* Content for guests */}
      </div>
    </div>
  );
}
