"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, KeyRound, LogIn, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/app/components/ui/field";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { LoginFormData, LoginFormSchema } from "@/app/lib/login/schema";

const DEFAULT_ROUTES = {
  admin: "/dashboard",
  doctor: "/dashboard/patient_history",
  patient: "/dashboard/dating_history",
};

function LoginContent() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(LoginFormSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    toast.loading("Iniciando sesión...", { id: "login" });
    try {
      const result = await signIn("credentials", {
        userEmail: data.userEmail,
        userPass: data.userPass,
        redirect: false,
      });
      toast.dismiss("login");
      if (result?.error) {
        toast.error("Credenciales incorrectas");
        return;
      }
      if (result?.ok) {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        const defaultRoute = DEFAULT_ROUTES[session.user.role as keyof typeof DEFAULT_ROUTES] || "/dashboard";
        const redirectRoute = callbackUrl || defaultRoute;
        toast.success(`Bienvenido ${session.user.name}`);
        router.push(redirectRoute);
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.dismiss("login");
      toast.error("Error al iniciar sesión");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="grid place-items-center min-h-dvh p-6 bg-slate-200">
      <Card className="mx-auto w-full max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>Ingresa tu correo y contraseña para acceder al sistema.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FieldSet>
                <Field className="mt-6">
                  <FieldLabel>
                    Correo
                    {errors.userEmail && <span className="text-red-500">*</span>}
                  </FieldLabel>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      {...register("userEmail")}
                      className="pl-10 pr-10 h-12 bg-background border-input focus:border-primary focus:ring-primary"
                      placeholder="Ej: juan@algo.com"
                      disabled={isLoading}
                    />
                  </div>
                  {errors.userEmail && <span className="text-red-500 text-sm">{errors.userEmail.message}</span>}
                </Field>
                <Field>
                  <FieldLabel>
                    Contraseña
                    {errors.userPass && <span className="text-red-500">*</span>}
                  </FieldLabel>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      {...register("userPass")}
                      placeholder="••••••••"
                      className="pl-10 pr-10 h-12 bg-background border-input focus:border-primary focus:ring-primary"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {errors.userPass && <span className="text-red-500 text-sm">{errors.userPass.message}</span>}
                </Field>
              </FieldSet>
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" className="w-full mt-6" disabled={isLoading}>
              <LogIn />
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <LoginContent />
    </Suspense>
  );
}