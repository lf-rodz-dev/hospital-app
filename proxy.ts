
import { auth } from "@/app/auth";
import { NextResponse } from "next/server";

export default auth(async function middleware(req) {
  const { pathname } = req.nextUrl;

  // SIEMPRE permitir NextAuth
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Rutas públicas
  if (pathname === "/" || pathname === "/login") {
    return NextResponse.next();
  }

  const session = req.auth;

  // Sin sesión → login
  if (!session) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const userRole = session.user?.role;

  const roleRoutes = {
    admin: [
      "/dashboard",
      "/dashboard/user",
      "/dashboard/doctor",
      "/dashboard/specialties",
    ],
    doctor: [
      "/dashboard/patient_history",
      "/dashboard/schedule_appointment_d",
      "/dashboard/patient_appointments",
    ],
    patient: [
      "/dashboard/dating_history",
      "/dashboard/schedule_appointment_p",
    ],
  } as const;

  if (!userRole || !(userRole in roleRoutes)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  const allowedRoutes = roleRoutes[userRole];

  const isAllowed = allowedRoutes.some((allowedRoute) => {
    if (allowedRoute === "/dashboard") {
      return pathname === "/dashboard";
    }
    
    return pathname === allowedRoute || pathname.startsWith(allowedRoute + "/");
  });

  if (!isAllowed) {
    
    //Redirigir a la página de inicio según el rol
    const fallbackUrl = {
      admin: "/dashboard",
      doctor: "/dashboard/patient_history",
      patient: "/dashboard/dating_history",
    }[userRole] || "/login";

    return NextResponse.redirect(new URL(fallbackUrl, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};