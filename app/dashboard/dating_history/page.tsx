import AppointmentsP from "@/app/components/schedule_appointment_p/appointments_p";
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
                        <CardDescription>Visualiza, cancela o reagenda tus citas de acuerdo con tus necesidades.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AppointmentsP/>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}