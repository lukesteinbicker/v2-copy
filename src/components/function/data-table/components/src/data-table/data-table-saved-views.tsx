"use client";

import { Button } from "~/components/function/input/button";
import { Input } from "~/components/function/input/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/function/menu/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "~/components/function/menu/command";
import { useDataTable } from "./data-table-provider";
import { BookmarkIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export function DataTableSavedViews() {
  const { savedViews, saveView, loadView, deleteView } = useDataTable();
  const [newViewName, setNewViewName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSaveView = () => {
    if (newViewName.trim()) {
      saveView(newViewName.trim());
      setNewViewName("");
      setOpen(false);
    }
  };

  const handleLoadView = (viewName: string) => {
    loadView(viewName);
    setOpen(false);
  };

  const handleDeleteView = (viewName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteView(viewName);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <BookmarkIcon className="mr-2 h-4 w-4" />
          Views
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No saved views.</CommandEmpty>
            <CommandGroup>
              {Object.keys(savedViews).map((viewName) => (
                <CommandItem
                  key={viewName}
                  onSelect={() => handleLoadView(viewName)}
                  className="flex items-center justify-between"
                >
                  <span>{viewName}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDeleteView(viewName, e)}
                    className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <TrashIcon className="h-3 w-3" />
                  </Button>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="border-t p-2">
          <div className="flex gap-2">
            <Input
              placeholder="View name..."
              value={newViewName}
              onChange={(e) => setNewViewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveView();
                }
              }}
              className="h-8"
            />
            <Button
              onClick={handleSaveView}
              size="sm"
              className="h-8 px-2"
              disabled={!newViewName.trim()}
            >
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
} 