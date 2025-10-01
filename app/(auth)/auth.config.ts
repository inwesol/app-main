import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    // Set signIn to your custom login page
    signIn: "/login",
    newUser: "/",
    error: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnRegister = nextUrl.pathname.startsWith("/register");
      const isOnLogin = nextUrl.pathname.startsWith("/login");
      const isOnForgotPassword =
        nextUrl.pathname.startsWith("/forgot-password");
      const isOnResetPassword = nextUrl.pathname.startsWith("/reset-password");
      const isOnVerifyEmail = nextUrl.pathname.startsWith("/verify-email");
      const isOnAuth = nextUrl.pathname.startsWith("/api/auth");
      const isOnOccupations = nextUrl.pathname.startsWith("/api/occupations");

      // Allow auth routes and occupations API to pass through
      if (isOnAuth || isOnOccupations) {
        return true;
      }

      // Redirect logged-in users away from auth pages
      if (
        isLoggedIn &&
        (isOnLogin ||
          isOnRegister ||
          isOnForgotPassword ||
          isOnResetPassword ||
          isOnVerifyEmail)
      ) {
        return Response.redirect(new URL("/", nextUrl));
      }

      // Allow access to public auth pages for non-authenticated users
      if (
        isOnRegister ||
        isOnLogin ||
        isOnForgotPassword ||
        isOnResetPassword ||
        isOnVerifyEmail
      ) {
        return true;
      }

      // For all other routes, require authentication
      if (!isLoggedIn) {
        // Redirect to login but allow the OAuth flow to work
        return false;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
