// // components/form-select-field.tsx
// "use client";

// import { useEffect, useState } from "react";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/app/components/ui/select";

// interface FormSelectFieldProps {
//   name: string;
//   defaultValue?: string;
//   placeholder?: string;
//   children: React.ReactNode;
//   onValueChange?: (value: string) => void;
// }

// export function FormSelectField({
//   name,
//   defaultValue = "",
//   placeholder = "Seleccionar",
//   children,
//   onValueChange,
// }: FormSelectFieldProps) {
//   const [value, setValue] = useState(defaultValue);

//   useEffect(() => {
//     // Crear un input oculto para enviar el valor en el formulario
//     const input = document.querySelector(
//       `input[name="${name}"]`
//     ) as HTMLInputElement;
//     if (input) {
//       input.value = value;
//     }
//   }, [value, name]);

//   const handleChange = (newValue: string) => {
//     setValue(newValue);
//     onValueChange?.(newValue);
//   };

//   return (
//     <>
//       <input type="hidden" name={name} value={value} />
//       <Select value={value} onValueChange={handleChange}>
//         <SelectTrigger className="w-full">
//           <SelectValue placeholder={placeholder} />
//         </SelectTrigger>
//         <SelectContent>{children}</SelectContent>
//       </Select>
//     </>
//   );
// }
