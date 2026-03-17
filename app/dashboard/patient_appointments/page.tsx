import AppointmentsD from "@/app/components/schedule_appointment_d/appointments_d";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";

export default function Page(){
    return(
        <main className="h-full w-full bg-slate-200">
            <div className="grid gap-4 m-4 min-h-dvh">
                <Card>
                    <CardHeader>
                        <CardTitle>Gestor de Citas</CardTitle>
                        <CardDescription>Reagenda y cambia el estatus de las citas de acuerdo a tus necesidades.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AppointmentsD/>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}