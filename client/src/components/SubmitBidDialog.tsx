import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { insertBidSchema } from "@shared/schema";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";

const formSchema = insertBidSchema.extend({
  price: z.coerce.number().positive("Price must be positive"),
  duration: z.coerce.number().positive("Duration must be positive"),
  crewCount: z.coerce.number().positive("Crew count must be positive").optional(),
});

type FormData = z.infer<typeof formSchema>;

interface SubmitBidDialogProps {
  tenderId: string;
  contractorId: string;
  trigger?: React.ReactNode;
}

export function SubmitBidDialog({ tenderId, contractorId, trigger }: SubmitBidDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedCrew, setSelectedCrew] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: crewMembers = [] } = useQuery({
    queryKey: ['/api/crew', contractorId],
    queryFn: () => fetch(`/api/crew?organizationId=${contractorId}`).then(res => res.json()),
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tenderId,
      contractorId,
      price: 0,
      duration: 30,
      methodStatement: "",
      crewCount: 0,
      proposedCrew: [],
      status: "pending",
    },
  });

  const submitBidMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const bidData = {
        ...data,
        proposedCrew: selectedCrew,
        crewCount: selectedCrew.length || data.crewCount,
      };

      const response = await apiRequest("POST", "/api/bids", bidData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bids"] });
      toast({
        title: "Success",
        description: "Bid submitted successfully",
      });
      setOpen(false);
      form.reset();
      setSelectedCrew([]);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit bid",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    submitBidMutation.mutate(data);
  };

  const toggleCrewMember = (memberId: string) => {
    setSelectedCrew(prev => 
      prev.includes(memberId) 
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-testid={`button-submit-bid-${tenderId}`}>
            Submit Bid
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit Bid</DialogTitle>
          <DialogDescription>
            Submit your bid for this tender
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bid Price ($)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      {...field}
                      data-testid="input-bid-price"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (weeks)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="12"
                      {...field}
                      value={field.value || ''}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      data-testid="input-bid-duration"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="methodStatement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method Statement</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your approach and methodology..."
                      rows={5}
                      {...field}
                      value={field.value || ''}
                      data-testid="input-bid-method-statement"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {crewMembers.length > 0 && (
              <div>
                <FormLabel>Proposed Crew Members</FormLabel>
                <div className="mt-2 space-y-2 max-h-48 overflow-y-auto border rounded-md p-3">
                  {crewMembers.map((member: any) => (
                    <div key={member.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={member.id}
                        checked={selectedCrew.includes(member.id)}
                        onCheckedChange={() => toggleCrewMember(member.id)}
                        data-testid={`checkbox-crew-${member.id}`}
                      />
                      <label
                        htmlFor={member.id}
                        className="flex-1 flex items-center justify-between cursor-pointer"
                      >
                        <div>
                          <div className="text-sm font-medium">{member.name}</div>
                          <div className="text-xs text-muted-foreground">{member.role}</div>
                        </div>
                        {member.skills && member.skills.length > 0 && (
                          <div className="flex gap-1">
                            {member.skills.slice(0, 2).map((skill: string, idx: number) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </label>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedCrew.length} crew member(s) selected
                </p>
              </div>
            )}

            <FormField
              control={form.control}
              name="crewCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Crew Count (if not selecting above)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="5"
                      {...field}
                      value={selectedCrew.length || field.value || ''}
                      disabled={selectedCrew.length > 0}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : null)}
                      data-testid="input-bid-crew-count"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                data-testid="button-cancel-bid"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitBidMutation.isPending}
                data-testid="button-submit-bid"
              >
                {submitBidMutation.isPending ? "Submitting..." : "Submit Bid"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
