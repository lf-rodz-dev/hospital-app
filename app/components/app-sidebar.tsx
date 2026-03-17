// app/components/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Stethoscope,
  GraduationCap,
  ChevronDown,
  Hospital,
  ClipboardPlus,
  CalendarCog,
  CalendarPlus,
  CalendarRange,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/app/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";

// 🔧 Configuración de navegación por rol
const navAdmin = [
  {
    title: "Panel de Control",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    href: "/dashboard/user",
    icon: Users,
  },
  {
    title: "Doctores",
    href: "/dashboard/doctor",
    icon: Stethoscope,
  },
  {
    title: "Especialidades",
    href: "/dashboard/specialties",
    icon: GraduationCap,
  },
];

const navDoctor = [
  {
    title: "Historial Médico",
    href: "/dashboard/patient_history",
    icon: ClipboardPlus,
  },
  {
    title: "Agendar Cita",
    href: "/dashboard/schedule_appointment_d",
    icon: CalendarPlus,
  },
  {
    title: "Administrar Citas",
    href: "/dashboard/patient_appointments",
    icon: CalendarCog,
  },
];

const navPatient = [
  {
    title: "Historial de Citas",
    href: "/dashboard/dating_history",
    icon: CalendarRange,
  },
  {
    title: "Agendar Cita",
    href: "/dashboard/schedule_appointment_p",
    icon: CalendarPlus,
  },
];

// 🎨 Configuración de etiquetas por rol
const roleLabels = {
  admin: "Administrador",
  doctor: "Doctor",
  patient: "Paciente",
};

export function AppSidebar() {
  const pathname = usePathname();
  // 📦 Obtener sesión del usuario autenticado
  const { data: session, status } = useSession();

  // ⏳ Mostrar loading mientras se carga la sesión
  if (status === "loading") {
    return null;
  }

  // 🚫 Si no hay sesión, no mostrar sidebar
  if (!session?.user) {
    return null;
  }

  const { user } = session;
  const userRole = user.role;

  // 🎯 Determinar qué navegación mostrar según el rol
  const showAdminNav = userRole === "admin";
  const showDoctorNav =  userRole === "doctor";
  const showPatientNav = userRole === "patient";

  // 🔤 Obtener iniciales del nombre
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // 🚪 Función para cerrar sesión
  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Hospital className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Hospital Admin</span>
                  <span className="truncate text-xs">Panel de Control</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* 👨‍💼 Navegación de Administrador */}
        {showAdminNav && (
          <SidebarGroup>
            <SidebarGroupLabel>Administrador</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navAdmin.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* 👨‍⚕️ Navegación de Doctor */}
        {showDoctorNav && (
          <SidebarGroup>
            <SidebarGroupLabel>Doctor</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navDoctor.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* 🧑‍🦱 Navegación de Paciente */}
        {showPatientNav && (
          <SidebarGroup>
            <SidebarGroupLabel>Paciente</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navPatient.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.href}
                      tooltip={item.title}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <Avatar className="size-8 rounded-lg">
                    <AvatarImage src="" alt={user.name} />
                    <AvatarFallback className="rounded-lg">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{user.name}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback className="rounded-lg">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {user.name}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {roleLabels[userRole]}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-red-600"
                >
                  <LogOut className="mr-2 size-4" />
                  Cerrar Sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
