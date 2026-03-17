import StepsFollow from "@/app/components/schedule_appointment_p/steps-follow";
import { Suspense } from "react";


function AppointmentContent(){
    return(
        <main className="flex flex-col gap-4 min-h-dvh  p-6 bg-slate-200">
                <StepsFollow/>
        </main>
    );
}

export default function Page() {
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
      <Suspense fallback={<div>Cargando...</div>}>
        <AppointmentContent />
      </Suspense>
    </main>
  );
}