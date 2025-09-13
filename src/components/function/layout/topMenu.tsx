import { Link } from "@tanstack/react-router";

import { cn } from "~/utils/tailwind-merge";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationTopMenuTriggerStyle,
} from "~/components/function/menu/navigation-menu";
import React from "react";
import {
  ScrollArea,
  ScrollBar,
} from "~/components/function/utility/scroll-area";



export default function TopMenu() {
  
    return (
      <NavigationMenu>
        <ScrollArea className="max-md:fade-both-horizontal">
          <NavigationMenuList className="px-6">
            <div className="flex w-full justify-between items-center">
              <NavigationMenuItem className="flex-1 max-w-[200px]">
                <Link to="/login" className="w-full flex justify-center">
                  <button className="w-[115px] bg-background no-underline group cursor-pointer relative shadow-2x rounded-full p-px text-xs font-semibold leading-6  text-foreground inline-block">
                    <span className="absolute inset-0 overflow-hidden rounded-full">
                      <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-100 transition-opacity duration-500"></span>
                    </span>
                    <div className="relative flex space-x-2 items-center z-10 rounded-full bg-background py-0.5 px-4 ring-1 ring-white/10 ">
                      <span>{`Start now`}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.5"
                          d="M10.75 8.75L14.25 12L10.75 15.25"
                        ></path>
                      </svg>
                    </div>
                    <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-header/0 via-slate-500/90 to-header/0 transition-opacity duration-500 group-hover:opacity-40"></span>
                  </button>
                </Link>
              </NavigationMenuItem>
            </div>
          </NavigationMenuList>
          <ScrollBar orientation="horizontal" transparent={true} />
        </ScrollArea>
      </NavigationMenu>
    );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-2 leading-none no-underline outline-none transition-colors",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
