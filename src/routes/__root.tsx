/// <reference types="vite/client" />
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRoute,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import * as React from 'react'
import { DefaultCatchBoundary } from '~/components/DefaultCatchBoundary'
import { NotFound } from '~/components/NotFound'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'
import MainPage from "~/components/function/layout/mainPage";
import TopMenu from "~/components/function/layout/topMenu";
import { UserMenu } from "~/components/function/layout/userMenu";
import { ThemeProvider, useTheme } from "~/components/function/theme/theme-provider";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import MainMenu from '~/components/function/layout/mainMenu'
import { getServerSession } from '~/lib/auth/auth-client'
import { NuqsAdapterWrapper } from "~/components/function/data-table/components/src/providers/nuqs-adapter";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  session?: any;
}>()({
  beforeLoad: async ({ location }) => {
    // Use the proper server function for session detection during SSR
    const session = await getServerSession();
    return { session };
  },
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title:
          'v.gallery | A platform for enthusiasts',
        description: `Share your garage, organize meets, and more `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
    scripts: [
      {
        src: '/customScript.js',
        type: 'text/javascript',
      },
    ],
  }),
  errorComponent: (props) => {
    const { queryClient } = props.context;
    return (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider theme="dark">
            <RootDocument>
              <DefaultCatchBoundary {...props} />
            </RootDocument>
          </ThemeProvider>
        </QueryClientProvider>
    );
  },
  component: RootComponent,
  notFoundComponent: () => <NotFound />,
})

function RootComponent() {
  const theme = "dark";
  const { queryClient } = Route.useRouteContext();

  return (
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <NuqsAdapterWrapper>
            <RootDocument>
              <Outlet />
            </RootDocument>
          </NuqsAdapterWrapper>
        </ThemeProvider>
      </QueryClientProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const { session } = Route.useRouteContext();
  
  // No more hacky useEffect needed! Session is properly detected during SSR
  
  const metaTags = seo({
    title: "v.gallery",
    description: "Display your collection online",
  });
  
  return (
    <html className={theme} suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {metaTags.map((tag, index) => (
          <meta key={index} {...tag} />
        ))}
        <link rel="stylesheet" href={appCss} />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" color="#fffff" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="overscroll-none">
        <div className="flex flex-col h-full bg-background">
          <div className="sticky top-0 z-50 pb-[1px] bg-gradient-to-r from-header via-foreground-dull to-header">
            <header className="bg-header flex items-center h-header-height w-full z-50">
              <div className="flex items-center justify-between h-full w-full p-2">
                <div className="flex items-center gap-4">
                  <MainMenu />
                  <Link
                    to="/"
                    activeProps={{
                      className: "font-bold",
                    }}
                    activeOptions={{ exact: true }}
                  >
                    Home
                  </Link>
                </div>
                <div className="flex-grow flex px-2 min-w-0 max-w-full">
                  <div className="w-full content-center">
                    <TopMenu />
                  </div>
                </div>

                <div>
                  {session && 'user' in session && session.user ? (
                    <UserMenu />
                  ) : (
                    <Link to="/login">
                      <button className="px-4 py-2 text-primary-foreground">Sign In</button>
                    </Link>
                  )}
                </div>
              </div>
            </header>
          </div>
          <MainPage>{children}</MainPage>
        </div>
        <TanStackRouterDevtools position="bottom-right" />
        <Scripts />
      </body>
    </html>
  );
}
