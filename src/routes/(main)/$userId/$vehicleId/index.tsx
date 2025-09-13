import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute('/(main)/$userId/$vehicleId/')({
  component: Page,
})

function Page() {
  return (
    <div>
      <h1>Vehicle</h1>
    </div>
  );
}
