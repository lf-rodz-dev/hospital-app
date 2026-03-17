import { completedAppointment } from "@/app/actions/appointment_history";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2} from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CompletedAppointment = ({ open, onOpenChange, id }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => completedAppointment(id),
    onMutate: () => {
      toast.loading("Completando cita...", { id: "completed-appointment" });
    },
    onSuccess: (result) => {
      toast.dismiss("completed-appointment");
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["appointments-doctor"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.dismiss("completed-appointment");
      toast.error(error.message);
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Completar Cita?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no puede deshacerse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Atrás</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate()}
            disabled={isPending}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 />
            {isPending ? "Completando..." : "Completar Cita"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CompletedAppointment;
