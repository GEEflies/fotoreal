import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Meno musí mať aspoň 2 znaky"),
  phone: z.string().min(9, "Zadajte platné telefónne číslo"),
  gdpr: z.boolean().refine((val) => val === true, "Musíte súhlasiť so spracovaním údajov"),
});

type FormValues = z.infer<typeof formSchema>;

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LeadFormModal({ isOpen, onClose }: LeadFormModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      gdpr: false,
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Store in localStorage as fallback
      const leads = JSON.parse(localStorage.getItem("leads") || "[]");
      leads.push({ ...data, timestamp: new Date().toISOString() });
      localStorage.setItem("leads", JSON.stringify(leads));
      
      setIsSuccess(true);
      toast({
        title: "Ďakujeme!",
        description: "Odhad a PDF návod vám pošleme do SMS.",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Niečo sa pokazilo. Skúste to znova.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {isSuccess ? (
          <div className="text-center py-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success mx-auto mb-4">
              <CheckCircle className="h-8 w-8" />
            </div>
            <DialogTitle className="text-2xl font-bold mb-2">Ďakujeme!</DialogTitle>
            <p className="text-muted-foreground mb-6">
              Odhad hodnoty a PDF návod vám pošleme do SMS v priebehu niekoľkých minút.
            </p>
            <Button onClick={handleClose} className="w-full">
              Zavrieť
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Získajte odhad hodnoty + PDF návod
              </DialogTitle>
              <p className="text-muted-foreground">
                100% zdarma. Bez záväzkov. Posielame do SMS.
              </p>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meno a priezvisko</FormLabel>
                      <FormControl>
                        <Input placeholder="Ján Novák" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefónne číslo</FormLabel>
                      <FormControl>
                        <Input placeholder="0911 123 456" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gdpr"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-sm font-normal text-muted-foreground">
                          Súhlasím so spracovaním osobných údajov za účelom poskytnutia služby
                        </FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full font-bold"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Odosielam...
                    </>
                  ) : (
                    <>
                      Odoslať
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
