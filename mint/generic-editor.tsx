import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export interface Field {
  name: string;
  label: string;
  type: "text" | "number" | "date";
}

interface GenericEditorProps<T> {
  data: T | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: T) => void;
  schema: z.ZodType<T>;
  fields: Field[];
  title: string;
}

export function GenericEditor<T>({
  data,
  isOpen,
  onClose,
  onSave,
  schema,
  fields,
  title,
}: GenericEditorProps<T>) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: data || {},
  });

  useEffect(() => {
    if (data) {
      reset(data);
    } else {
      reset({} as T);
    }
  }, [data, reset]);

  const onSubmit = (formData: T) => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {data ? `Edit ${title}` : `Add New ${title}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>{field.label}</Label>
                <Input
                  id={field.name}
                  type={field.type}
                  {...register(field.name as any)}
                  className={
                    errors[field.name as keyof typeof errors]
                      ? "border-red-500"
                      : ""
                  }
                />
                {errors[field.name as keyof typeof errors] && (
                  <p className="text-red-500 text-sm">
                    {
                      errors[field.name as keyof typeof errors]
                        ?.message as string
                    }
                  </p>
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}