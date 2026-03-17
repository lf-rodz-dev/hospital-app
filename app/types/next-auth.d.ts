// types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "admin" | "doctor" | "patient"; // 🎯 Roles específicos de tu app
    token?: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      role: "admin" | "doctor" | "patient";
      apiToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "doctor" | "patient";
    phone: string;
    apiToken?: string;
  }
}