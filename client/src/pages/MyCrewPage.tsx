import { useQuery } from "@tanstack/react-query";
import { Users, Plus, Shield, Phone, Mail } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

const DEMO_CONTRACTOR_ID = "org-contractor-1";

export default function MyCrewPage() {
  const { data: crewMembers = [], isLoading } = useQuery({
    queryKey: ['/api/crew', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/crew?organizationId=${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading crew members...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">My Crew</h1>
          <p className="text-muted-foreground">Manage your team members and their compliance</p>
        </div>
        <Button size="lg" data-testid="button-add-crew">
          <Plus className="h-4 w-4 mr-2" />
          Add Crew Member
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {crewMembers.map((member: any) => (
          <Card key={member.id} data-testid={`card-crew-${member.id}`}>
            <CardHeader className="flex flex-row items-start gap-4 space-y-0 pb-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={member.photoUrl} alt={member.name} />
                <AvatarFallback>{member.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
              {member.available && (
                <Badge variant="default" className="bg-green-500">Available</Badge>
              )}
            </CardHeader>
            
            <CardContent className="space-y-4">
              {member.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.email}</span>
                </div>
              )}
              
              {member.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{member.phone}</span>
                </div>
              )}
              
              {member.skills && member.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill: string, idx: number) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span>Compliance Score</span>
                  </div>
                  <span className="font-semibold">{member.complianceScore || 0}%</span>
                </div>
                <Progress value={member.complianceScore || 0} className="h-2" />
              </div>
            </CardContent>
            
            <CardFooter className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" data-testid={`button-view-${member.id}`}>
                View Details
              </Button>
              <Button variant="outline" size="sm" data-testid={`button-compliance-${member.id}`}>
                Compliance Docs
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {crewMembers.length === 0 && (
          <div className="col-span-2">
            <Card className="p-12">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <Users className="h-16 w-16 text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">No crew members yet</h3>
                  <p className="text-sm text-muted-foreground mb-4">Add your first crew member to start building your team</p>
                  <Button data-testid="button-add-first-crew">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Crew Member
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
