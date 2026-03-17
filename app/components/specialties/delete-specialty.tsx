'use client';

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
import {toast} from 'sonner'
import {deleteSpecialty} from '@/app/actions/specialtie'
import {useMutation, useQueryClient} from '@tanstack/react-query'
{/*useMutate: operaciones para cambiar los datos
    useQueryClient: acceso al cache global*/}

type Props={
    id: string;
    open:boolean;
    onOpenChange:(open: boolean) => void;
};

const DeleteSpecialty = ({id, open, onOpenChange}: Props) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        // invocar la funcion en el actions server
        mutationFn: () => deleteSpecialty(id),
        //ejecuta antes de enviar la peticion
        onMutate: () => {
            toast.loading("Eliminando especialidad...", {id: "delete-specialty"})
        },
        //se ejecuta si el backend responde correctamente
        onSuccess: (result) => {
            toast.dismiss("delete-specialty")

            if(result.success){
                toast.success(result.message)

                queryClient.invalidateQueries({queryKey: ["specialties"]});
                //cerrar el modal
                onOpenChange(false);
            }else{
                toast.error(result.message || "Error al eliminar Especialidad")
            }
        },
        //se ejecuta si hay un error inesperado
        onError: () => {
            toast.dismiss("delete-specialty")
            toast.error("Error inesperado")
        }
    });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Eliminar usuario?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={() => mutation.mutate()}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteSpecialty;
