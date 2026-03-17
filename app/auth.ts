import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginFormSchema } from "@/app/lib/login/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        userEmail: { label: "Email", type: "email" },
        userPass: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          const { userEmail, userPass } =
            await LoginFormSchema.parseAsync(credentials);

          const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
          const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, userPass }),
          });

          const result = await response.json();

          if (!result.success || !result.user) {
            return null;
          }

          const roleMap = {
            administrador: "admin",
            doctor: "doctor",
            paciente: "patient",
          };

          return {
            id: String(result.user.id_user),
            name: result.user.name as string,
            email: result.user.email as string,
            phone: result.user.phone as string,
            role: roleMap[result.user.rol.toLowerCase().trim() as keyof typeof roleMap] as string,
            token: result.token as string,
          } as any;
          
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.apiToken = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "admin" | "doctor" | "patient";
        session.user.apiToken = token.apiToken as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
});