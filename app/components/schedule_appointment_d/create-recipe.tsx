import { ClipboardPlus, Pill, Plus, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createRecipe } from "@/app/actions/appointment_history";
import { toast } from "sonner";
import { Appointment, emptyMedication, Medication } from "@/app/lib/schedule_appointment/types";
import { formatDate } from "@/app/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment | null;
};

const CreateRecipe = ({ open, onOpenChange, appointment }: Props) => {
  const [medications, setMedications] = useState<Medication[]>([
    { ...emptyMedication },
  ]);

  const queryClient = useQueryClient();

  if (!appointment) return null;

  const addMedication = () => {
    setMedications([...medications, { ...emptyMedication }]);
  };

  const removeMedication = (index: number) => {
    if (medications.length > 1) {
      setMedications(medications.filter((_, i) => i !== index));
    }
  };

  const updateMedication = (
    index: number,
    field: keyof Medication,
    value: string,
  ) => {
    const updated = [...medications];
    updated[index] = { ...updated[index], [field]: value };
    setMedications(updated);
  };

  // ✅ FUNCIÓN PARA RESETEAR EL ESTADO
  const resetForm = () => {
    setMedications([{ ...emptyMedication }]);
  };

  const mutation = useMutation({
    mutationFn: async () => {
      if (!appointment) throw new Error("No appointment selected");

      // Validar que al menos un medicamento tenga nombre
      const hasValidMedicamento = medications.some((med) => med.name.trim());
      if (!hasValidMedicamento) {
        throw new Error("Debes agregar al menos un medicamento");
      }

      return createRecipe({
        id_appointment: appointment.id_appointment,
        medicaments: medications.filter((med) => med.name.trim()),
        patient_name: appointment.patient_name,
        doctor_name: appointment.doctor_name
      });
    },
    onMutate: () => {
      toast.loading("Creando receta...", { id: "create-recipe" });
    },
    onSuccess: (result) => {
      toast.dismiss("create-recipe");
      if (result.success) {
        toast.success(result.message);
        resetForm();
        queryClient.invalidateQueries({ queryKey: ["recipe"] });
        queryClient.invalidateQueries({ queryKey: ["appointments-doctor"] });
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    },
    onError: (error: any) => {
      toast.dismiss("create-recipe");
      toast.error(error.message);
    },
  });

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex gap-2 items-center">
            <ClipboardPlus /> Receta Medica
          </DialogTitle>
          <DialogDescription>
            Cita {appointment.id_appointment}
          </DialogDescription>
        </DialogHeader>

        <section className="grid grid-cols-2 gap-2 p-2.5 bg-muted/50 rounded-lg text-xs">
          <div>
            <span className="text-muted-foreground">Paciente: </span>
            <span className="font-medium">{appointment.patient_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Doctor: </span>
            <span className="font-medium">{appointment.doctor_name}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Especialidad: </span>
            <span className="font-medium">{appointment.name_specialtie}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Fecha: </span>
            <span className="font-medium">{formatDate(appointment.date)}</span>
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-xs">
              <Pill className="size-3.5" />
              Medicamentos
            </Label>
            <Button variant="outline" size="sm" onClick={addMedication}>
              <Plus className="size-4 mr-1" />
              Agregar
            </Button>
          </div>

          {medications.map((med, index) => (
            <Card key={index}>
              <CardContent className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">
                    Medicamento {index + 1}
                  </span>
                  {medications.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeMedication(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 space-y-0.5">
                    <Label className="text-xs">Nombre del medicamento</Label>
                    <Input
                      placeholder="Ej: Amoxicilina"
                      value={med.name}
                      onChange={(e) =>
                        updateMedication(index, "name", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-xs">Dosis</Label>
                    <Input
                      placeholder="Ej: 500mg"
                      value={med.dose}
                      onChange={(e) =>
                        updateMedication(index, "dose", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-xs">Vía de administración</Label>
                    <Select
                      value={med.route}
                      onValueChange={(value) =>
                        updateMedication(index, "route", value)
                      }
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oral">Oral</SelectItem>
                        <SelectItem value="Intravenosa">Intravenosa</SelectItem>
                        <SelectItem value="Intramuscular">
                          Intramuscular
                        </SelectItem>
                        <SelectItem value="Topica">Tópica</SelectItem>
                        <SelectItem value="Subcutanea">Subcutánea</SelectItem>
                        <SelectItem value="Inhalatoria">Inhalatoria</SelectItem>
                        <SelectItem value="Oftalmica">Oftálmica</SelectItem>
                        <SelectItem value="Rectal">Rectal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-xs">Frecuencia</Label>
                    <Input
                      placeholder="Ej: Cada 8 horas"
                      value={med.frequency}
                      onChange={(e) =>
                        updateMedication(index, "frequency", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <Label className="text-xs">Duración</Label>
                    <Input
                      placeholder="Ej: 7 días"
                      value={med.duration}
                      onChange={(e) =>
                        updateMedication(index, "duration", e.target.value)
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button 
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateRecipe;