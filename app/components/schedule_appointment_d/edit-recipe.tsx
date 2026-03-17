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
import { Appointment, Medicament } from "@/app/lib/schedule_appointment/types";
import { Label } from "../ui/label";
import { LoaderCircle, Pill, Plus, Trash2 } from "lucide-react";
import { formatDate } from "../../lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteMedicament,
  fetchRecipeById,
  updateAndCreateMedicaments,
} from "@/app/actions/appointment_history";
import { useEffect, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment: Appointment;
};

const EditRecipe = ({ open, onOpenChange, appointment }: Props) => {
  const [medications, setMedications] = useState<Medicament[]>([]);
  const [newMedications, setNewMedications] = useState<Medicament[]>([]);
  const [id_recipe, setIdRecipe] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["recipe", appointment.id_appointment],
    queryFn: () => fetchRecipeById(appointment.id_appointment),
    enabled: open && !!appointment.id_appointment,
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setMedications(
        data.data.map((med: any) => ({
          id_medicament: med.id_medicament,
          name: med.name_medicament,
          dose: med.dose,
          frequency: med.frequency,
          duration: med.duration,
          route: med.route,
        })),
      );
      // ✅ GUARDAR CORRECTAMENTE EL id_recipe
      if (data.id_recipe) {
        setIdRecipe(data.id_recipe);
      }
      setNewMedications([]);
    }
  }, [data]);

  // ✅ MUTATION CONSOLIDADA - Actualiza existentes y crea nuevos
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!id_recipe) {
        throw new Error("ID de receta no encontrado");
      }

      return updateAndCreateMedicaments({
        id_recipe,
        existingMedications: medications,
        newMedications: newMedications,
        patient_name: appointment.patient_name,
        doctor_name: appointment.doctor_name
      });
    },
    onMutate: () => {
      toast.loading("Guardando cambios...", { id: "save-recipe" });
    },
    onSuccess: (result) => {
      toast.dismiss("save-recipe");
      if (result.success) {
        toast.success(result.message);
        setNewMedications([]);
        onOpenChange(false);
        queryClient.invalidateQueries({ queryKey: ["recipe"] });
      } else {
        toast.error(result.message || "Error desconocido");
      }
    },
    onError: (error: any) => {
      toast.dismiss("save-recipe");
      console.error("Error en saveMutation:", error);
      toast.error(error?.message || "Error al guardar cambios");
    },
  });

  // ✅ MUTATION PARA ELIMINAR
  const deleteMutation = useMutation({
    mutationFn: (id_medicament: string) => deleteMedicament(id_medicament),
    onMutate: () => {
      toast.loading("Eliminando medicamento...", { id: "delete-medicament" });
    },
    onSuccess: (result, id_medicament) => {
      toast.dismiss("delete-medicament");
      if (result.success) {
        toast.success(result.message);

        // ✅ Actualiza la UI localmente
        const updatedMedications = medications.filter(
          (med) => med.id_medicament !== id_medicament,
        );
        setMedications(updatedMedications);

        // ✅ Si no hay más medicamentos, cerrar el diálogo
        if (updatedMedications.length === 0) {
          setTimeout(() => {
            handleDialogClose();
          }, 500); // Pequeño delay para que el toast sea visible
        }

        // ✅ Invalidar todas las queries relacionadas
        queryClient.invalidateQueries({ queryKey: ["recipe"] });
        queryClient.invalidateQueries({
          queryKey: ["appointments-doctor"],
        });
      } else {
        toast.error(result.message || "Error desconocido");
      }
    },
    onError: (error: any) => {
      toast.dismiss("delete-medicament");
      console.error("Error en deleteMutation:", error);
      toast.error(error?.message || "Error al eliminar medicamento");
    },
  });

  // ✅ FUNCIONES PARA MEDICAMENTOS EXISTENTES
  const updateMedication = (
    id_medicament: string,
    field: keyof Medicament,
    value: string,
  ) => {
    setMedications(
      medications.map((med) =>
        med.id_medicament === id_medicament ? { ...med, [field]: value } : med,
      ),
    );
  };

  // ✅ FUNCIONES PARA MEDICAMENTOS NUEVOS
  const addNewMedication = () => {
    setNewMedications([
      ...newMedications,
      {
        id_medicament: "",
        name: "",
        dose: "",
        frequency: "",
        duration: "",
        route: "Oral",
      },
    ]);
  };

  const removeNewMedication = (index: number) => {
    setNewMedications(newMedications.filter((_, i) => i !== index));
  };

  const updateNewMedication = (
    index: number,
    field: keyof Medicament,
    value: string,
  ) => {
    const updated = [...newMedications];
    updated[index] = { ...updated[index], [field]: value };
    setNewMedications(updated);
  };

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handleDialogClose = () => {
    setNewMedications([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-175 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Receta Medica</DialogTitle>
          <DialogDescription>
            Cita {appointment.id_appointment}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <LoaderCircle className="h-6 w-6 animate-spin mr-2" />
            <span className="text-gray-500">Cargando receta...</span>
          </div>
        ) : data?.success ? (
          <>
            {/* INFORMACIÓN DEL PACIENTE */}
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
                <span className="font-medium">
                  {appointment.name_specialtie}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Fecha: </span>
                <span className="font-medium">
                  {formatDate(appointment.date)}
                </span>
              </div>
            </section>

            {/* MEDICAMENTOS EXISTENTES */}
            <section className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2 text-xs">
                  <Pill className="size-3.5" />
                  Medicamentos Existentes
                </Label>
              </div>
            </section>

            {medications.length === 0 ? (
              <div className="flex items-center justify-center p-8 bg-muted/30 rounded-lg">
                <span className="text-gray-500 text-sm">
                  No se encontraron medicamentos.
                </span>
              </div>
            ) : (
              medications.map((med) => (
                <Card key={med.id_medicament}>
                  <CardContent className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">
                        {med.name || "Sin nombre"}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteMutation.mutate(med.id_medicament)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="col-span-2 space-y-0.5">
                        <Label className="text-xs">
                          Nombre del medicamento
                        </Label>
                        <Input
                          placeholder="Ej: Amoxicilina"
                          value={med.name}
                          onChange={(e) =>
                            updateMedication(
                              med.id_medicament,
                              "name",
                              e.target.value,
                            )
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
                            updateMedication(
                              med.id_medicament,
                              "dose",
                              e.target.value,
                            )
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                      <div className="space-y-0.5">
                        <Label className="text-xs">Vía de administración</Label>
                        <Select
                          value={med.route}
                          onValueChange={(value) =>
                            updateMedication(med.id_medicament, "route", value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Oral">Oral</SelectItem>
                            <SelectItem value="Intravenosa">
                              Intravenosa
                            </SelectItem>
                            <SelectItem value="Intramuscular">
                              Intramuscular
                            </SelectItem>
                            <SelectItem value="Topica">Tópica</SelectItem>
                            <SelectItem value="Subcutanea">
                              Subcutánea
                            </SelectItem>
                            <SelectItem value="Inhalatoria">
                              Inhalatoria
                            </SelectItem>
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
                            updateMedication(
                              med.id_medicament,
                              "frequency",
                              e.target.value,
                            )
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
                            updateMedication(
                              med.id_medicament,
                              "duration",
                              e.target.value,
                            )
                          }
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}

            {/* NUEVOS MEDICAMENTOS */}
            {newMedications.length > 0 && (
              <section className="space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <Label className="flex items-center gap-2 text-xs">
                    <Pill className="size-3.5" />
                    Nuevos Medicamentos
                  </Label>
                </div>

                {newMedications.map((med, index) => (
                  <Card key={index}>
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium">
                          Medicamento {index + 1}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => removeNewMedication(index)}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 space-y-0.5">
                          <Label className="text-xs">
                            Nombre del medicamento
                          </Label>
                          <Input
                            placeholder="Ej: Amoxicilina"
                            value={med.name}
                            onChange={(e) =>
                              updateNewMedication(index, "name", e.target.value)
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
                              updateNewMedication(index, "dose", e.target.value)
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <Label className="text-xs">
                            Vía de administración
                          </Label>
                          <Select
                            value={med.route}
                            onValueChange={(value) =>
                              updateNewMedication(index, "route", value)
                            }
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Oral">Oral</SelectItem>
                              <SelectItem value="Intravenosa">
                                Intravenosa
                              </SelectItem>
                              <SelectItem value="Intramuscular">
                                Intramuscular
                              </SelectItem>
                              <SelectItem value="Topica">Tópica</SelectItem>
                              <SelectItem value="Subcutanea">
                                Subcutánea
                              </SelectItem>
                              <SelectItem value="Inhalatoria">
                                Inhalatoria
                              </SelectItem>
                              <SelectItem value="Oftalmica">
                                Oftálmica
                              </SelectItem>
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
                              updateNewMedication(
                                index,
                                "frequency",
                                e.target.value,
                              )
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
                              updateNewMedication(
                                index,
                                "duration",
                                e.target.value,
                              )
                            }
                            className="h-8 text-sm"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addNewMedication}
                  className="w-full"
                >
                  <Plus className="size-4 mr-1" />
                  Agregar otro medicamento
                </Button>
              </section>
            )}

            {/* BOTÓN AGREGAR MEDICAMENTO - Se muestra si no hay nuevos */}
            {newMedications.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={addNewMedication}
                className="w-full"
              >
                <Plus className="size-4 mr-1" />
                Agregar medicamento
              </Button>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center p-8">
            <span className="text-gray-500">
              No se encontraron datos de la receta.
            </span>
          </div>
        )}

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending || deleteMutation.isPending}
          >
            {saveMutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditRecipe;
