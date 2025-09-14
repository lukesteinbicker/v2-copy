import React from "react";

interface PlausibleProviderWrapperProps {
  children: React.ReactNode;
  domain: string;
}

export function PlausibleProviderWrapper({
  children,
  domain,
}: PlausibleProviderWrapperProps) {
  // Simple Plausible integration for TanStack Start
  // You can implement your own analytics tracking here
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // Load Plausible script
      const script = document.createElement("script");
      script.defer = true;
      script.setAttribute("data-domain", domain);
      script.src = "https://plausible.io/js/script.js";
      document.head.appendChild(script);

      return () => {
        // Cleanup
        const existingScript = document.querySelector(`script[data-domain="${domain}"]`);
        if (existingScript) {
          existingScript.remove();
        }
      };
    }
  }, [domain]);

  return <>{children}</>;
} 