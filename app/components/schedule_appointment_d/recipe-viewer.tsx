import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ExternalLink, Loader, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { getRecipePdfUrl } from "@/app/actions/appointment_history";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointmentId: string;
};

const RecipeViewer = ({ open, onOpenChange, appointmentId }: Props) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open && appointmentId) {
      loadPdfUrl();
    }
  }, [open, appointmentId]);

  const loadPdfUrl = async () => {
    setIsLoading(true);
    setError(null);
    setPdfUrl(null);
    
    try {
      const result = await getRecipePdfUrl(appointmentId);
      
      if (result.success && result.pdf_url) {
        setPdfUrl(result.pdf_url);
      } else {
        const errorMsg = result.message || "No se pudo cargar el PDF";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Error al cargar el PDF";
      console.error('Error en loadPdfUrl:', error);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl h-[95vh] max-h-[95vh] flex flex-col p-0">
        <DialogHeader className="px-6 py-4 border-b shrink-0">
          <DialogTitle>Visor de Receta Médica</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center p-8 flex-1">
            <Loader className="h-6 w-6 animate-spin mr-2" />
            <span className="text-gray-500">Cargando PDF...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col gap-4 p-6 flex-1">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <Button 
              onClick={loadPdfUrl}
              variant="outline"
            >
              Reintentar
            </Button>
          </div>
        ) : pdfUrl ? (
          <>
            <div className="flex px-6 pb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleOpenInNewTab}
                className="gap-2"
              >
                <ExternalLink className="size-4" />
                Abrir en nueva pestaña
              </Button>
            </div>

            {/* Visor de PDF embebido */}
            <iframe
              src={pdfUrl}
              className="w-full flex-1 border-t"
              title="Receta Médica PDF"
              onError={() => {
                setError('No se pudo cargar el PDF en el visor. Intenta abrirlo en nueva pestaña.');
              }}
              onLoad={() => {
                console.log('PDF cargado correctamente en el iframe');
              }}
            />
          </>
        ) : (
          <div className="flex items-center justify-center p-8 flex-1">
            <span className="text-gray-500">No se pudo cargar el PDF</span>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RecipeViewer;