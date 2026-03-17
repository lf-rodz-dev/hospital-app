import { unassistedAppointment } from "@/app/actions/appointment_history";
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
import { XCircle} from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const UnassistedAppointment = ({ open, onOpenChange, id }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => unassistedAppointment(id),
    onMutate: () => {
      toast.loading("Cita sin asistencia...", { id: "unassisted-appointment" });
    },
    onSuccess: (result) => {
      toast.dismiss("unassisted-appointment");
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["appointments-doctor"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.dismiss("unassisted-appointment");
      toast.error(error.message);
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cambiar a cita no asistida?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no puede deshacerse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Atrás</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate()}
            disabled={isPending}
            className="bg-gray-600 hover:bg-gray-700"
          >
            <XCircle />
            {isPending ? "No asistida..." : "Cita no asistida"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UnassistedAppointment;
