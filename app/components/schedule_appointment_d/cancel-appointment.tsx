import { cancelAppointment } from "@/app/actions/appointment_history";
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
import { XCircle } from "lucide-react";
import { toast } from "sonner";

type Props = {
  id: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const CancelAppointment = ({ open, onOpenChange, id }: Props) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => cancelAppointment(id),
    onMutate: () => {
      toast.loading("Cancelando cita...", { id: "cancel-appointment" });
    },
    onSuccess: (result) => {
      toast.dismiss("cancel-appointment");
      if (result.success) {
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["appointments-doctor"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.dismiss("cancel-appointment");
      toast.error(error.message);
    },
  });
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Cancelar Cita?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta accion no puede deshacerse.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Atras</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => mutate()}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            <XCircle />
            {isPending ? "Cancelando..." : "Cancelar Cita"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelAppointment;
