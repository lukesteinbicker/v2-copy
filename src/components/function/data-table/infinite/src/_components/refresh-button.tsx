import { Button } from "~/components/function/input/button";
import { useDataTable } from "~/components/function/data-table/components/src/data-table/data-table-provider";
import { LoaderCircle, RefreshCcw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
}

export function RefreshButton({ onClick }: RefreshButtonProps) {
  const { isLoading } = useDataTable();

  return (
    <Button
      variant="outline"
      size="icon"
      disabled={isLoading}
      onClick={onClick}
      className="h-9 w-9"
    >
      {isLoading ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : (
        <RefreshCcw className="h-4 w-4" />
      )}
    </Button>
  );
}
