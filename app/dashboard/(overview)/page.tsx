import Summary from "@/app/components/dashboard/summary";
import { TopDoctors } from "../../components/dashboard/top-doctors";
import { TopSpecialties } from "../../components/dashboard/top-specialties";

export default function Page() {
  return (
    <main className="grid gap-4 min-h-dvh space-y-6 p-6 bg-slate-200">
        <Summary />
      <div className="grid grid-cols-2 gap-4">        <TopSpecialties />
        <TopDoctors />
      </div>
    </main>
  );
}
