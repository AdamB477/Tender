import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { insertTenderSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus } from "lucide-react";

const formSchema = insertTenderSchema.extend({
  budgetMin: z.coerce.number().positive("Budget minimum must be positive"),
  budgetMax: z.coerce.number().positive("Budget maximum must be positive"),
  requiredSkillsText: z.string().optional(),
  requiredComplianceText: z.string().optional(),
}).omit({
  budget: true,
  requiredSkills: true,
  requiredCompliance: true,
});

type FormData = z.infer<typeof formSchema>;

interface CreateTenderDialogProps {
  organizationId: string;
  trigger?: React.ReactNode;
}

export function CreateTenderDialog({ organizationId, trigger }: CreateTenderDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      organizationId,
      title: "",
      description: "",
      address: "",
      latitude: 51.5074,
      longitude: -0.1278,
      budgetMin: 0,
      budgetMax: 0,
      requiredSkillsText: "",
      requiredComplianceText: "",
      startDate: undefined,
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      duration: 30,
      status: "draft",
    },
  });

  const createTenderMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { budgetMin, budgetMax, requiredSkillsText, requiredComplianceText, ...rest } = data;
      
      const tenderData = {
        ...rest,
        budget: { min: budgetMin, max: budgetMax },
        requiredSkills: requiredSkillsText
          ? requiredSkillsText.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        requiredCompliance: requiredComplianceText
          ? requiredComplianceText.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      };

      const response = await apiRequest("POST", "/api/tenders", tenderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tenders"] });
      toast({
        title: "Success",
        description: "Tender created successfully",
      });
      setOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create tender",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    createTenderMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid="button-create-tender">
            <Plus className="h-4 w-4 mr-2" />
            Create Tender
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Tender</DialogTitle>
          <DialogDescription>
            Post a new construction tender for contractors to bid on
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Office Building Renovation"
                      {...field}
                      data-testid="input-tender-title"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the tender requirements..."
                      rows={4}
                      {...field}
                      data-testid="input-tender-description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Project location address"
                      {...field}
                      data-testid="input-tender-address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="budgetMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Budget (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="50000"
                        {...field}
                        data-testid="input-tender-budget-min"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="budgetMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Budget (£)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="100000"
                        {...field}
                        data-testid="input-tender-budget-max"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="requiredSkillsText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Skills (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Electrical, Plumbing, Carpentry"
                      {...field}
                      data-testid="input-tender-skills"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requiredComplianceText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Compliance (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., ISO 9001, Health & Safety Cert"
                      {...field}
                      data-testid="input-tender-compliance"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Date (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(e.target.value ? new Date(e.target.value) : undefined)}
                        data-testid="input-tender-start-date"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        onChange={(e) => field.onChange(new Date(e.target.value))}
                        data-testid="input-tender-deadline"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (days)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="30"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      data-testid="input-tender-duration"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-tender-status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="open">Open</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-tender"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createTenderMutation.isPending}
                data-testid="button-submit-tender"
              >
                {createTenderMutation.isPending ? "Creating..." : "Create Tender"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
