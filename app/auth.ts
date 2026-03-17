// auth.ts (raíz del proyecto)
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginFormSchema } from "./lib/login/schema";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        userEmail: { label: "Email", type: "email" },
        userPass: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // Validar con Zod
          const { userEmail, userPass } =
            await LoginFormSchema.parseAsync(credentials);

          // Llamar a tu API Lambda
          const baseUrl =
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/dev";
          const response = await fetch(`${baseUrl}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail, userPass }),
          });

          const result = await response.json();

          // Si el login falla, retornar null
          if (!result.success || !result.user) {
            return null;
          }

          const roleMap = {
            administrador: "admin",
            doctor: "doctor",
            paciente: "patient",
          };

          return {
            id: result.user.id_user,
            name: result.user.name,
            email: result.user.email,
            phone: result.user.phone,
            role: roleMap[result.user.rol.toLowerCase().trim()],
            token: result.token,
          };
          
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // 🎫 Agregar datos personalizados al JWT
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.apiToken = user.token;
      }
      return token;
    },
    // 📦 Agregar datos personalizados a la sesión
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
    signIn: "/login", // 🔐 Página personalizada de login
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // ⏱️ 24 horas
  },
});
