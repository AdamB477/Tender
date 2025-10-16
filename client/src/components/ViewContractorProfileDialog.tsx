import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, CheckCircle2, Users, Award } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

interface ViewContractorProfileDialogProps {
  contractorId: string;
  trigger?: React.ReactNode;
}

export function ViewContractorProfileDialog({ contractorId, trigger }: ViewContractorProfileDialogProps) {
  const { data: contractor, isLoading: contractorLoading } = useQuery({
    queryKey: ['/api/organizations', contractorId],
    queryFn: () => fetch(`/api/organizations/${contractorId}`).then(res => res.json()),
  });

  const { data: crewMembers = [] } = useQuery({
    queryKey: ['/api/crew', contractorId],
    queryFn: () => fetch(`/api/crew?organizationId=${contractorId}`).then(res => res.json()),
  });

  const { data: complianceDocs = [] } = useQuery({
    queryKey: ['/api/compliance', 'organization', contractorId],
    queryFn: () => fetch(`/api/compliance?entityType=organization&entityId=${contractorId}`).then(res => res.json()),
  });

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'default';
      case 'expiring': return 'secondary';
      case 'expired': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" data-testid={`button-view-profile-${contractorId}`}>
            View Profile
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contractor Profile</DialogTitle>
          <DialogDescription>
            Detailed information about this contractor
          </DialogDescription>
        </DialogHeader>

        {contractorLoading ? (
          <div className="flex items-center justify-center h-48">
            <div className="text-muted-foreground">Loading contractor profile...</div>
          </div>
        ) : contractor ? (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={contractor.logoUrl} alt={contractor.name} />
                <AvatarFallback>{contractor.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-1">{contractor.name}</h2>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current text-yellow-500" />
                    <span>{parseFloat(contractor.rating || '0').toFixed(1)}</span>
                    <span>({contractor.reviewCount || 0} reviews)</span>
                  </div>
                  {contractor.address && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      <span>{contractor.address}</span>
                    </div>
                  )}
                </div>
                {contractor.description && (
                  <p className="text-sm text-muted-foreground mt-2">{contractor.description}</p>
                )}
              </div>
              {contractor.available ? (
                <Badge variant="default" className="bg-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Available
                </Badge>
              ) : (
                <Badge variant="secondary">Unavailable</Badge>
              )}
            </div>

            <Separator />

            {contractor.capabilities && contractor.capabilities.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {contractor.capabilities.map((capability: string, idx: number) => (
                    <Badge key={idx} variant="secondary">
                      {capability}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <Tabs defaultValue="crew" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="crew" data-testid="tab-crew">
                  <Users className="h-4 w-4 mr-2" />
                  Crew ({crewMembers.length})
                </TabsTrigger>
                <TabsTrigger value="compliance" data-testid="tab-compliance">
                  <Award className="h-4 w-4 mr-2" />
                  Compliance ({complianceDocs.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="crew" className="space-y-3">
                {crewMembers.length > 0 ? (
                  crewMembers.map((member: any) => (
                    <Card key={member.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarImage src={member.photoUrl} alt={member.name} />
                              <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-medium">{member.name}</h4>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                              {member.skills && member.skills.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {member.skills.map((skill: string, idx: number) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {skill}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          {member.available ? (
                            <Badge variant="default" className="bg-green-500 text-xs">
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">
                              Unavailable
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No crew members listed
                  </div>
                )}
              </TabsContent>

              <TabsContent value="compliance" className="space-y-3">
                {complianceDocs.length > 0 ? (
                  complianceDocs.map((doc: any) => (
                    <Card key={doc.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{doc.type}</h4>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              {doc.issuedDate && (
                                <span>Issued: {new Date(doc.issuedDate).toLocaleDateString()}</span>
                              )}
                              {doc.expiryDate && (
                                <span>Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                              )}
                            </div>
                          </div>
                          <Badge variant={getComplianceStatusColor(doc.status)}>
                            {doc.status}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    No compliance documents listed
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between pt-4">
              <div className="text-sm text-muted-foreground">
                Reliability Score: {contractor.reliabilityScore || 0}/100
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">Contractor not found</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
