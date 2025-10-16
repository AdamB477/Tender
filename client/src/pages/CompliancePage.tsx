import { useQuery } from "@tanstack/react-query";
import { Shield, Plus, AlertCircle, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const DEMO_CONTRACTOR_ID = "org-contractor-1";

export default function CompliancePage() {
  const { data: complianceDocs = [], isLoading } = useQuery({
    queryKey: ['/api/compliance', 'organization', DEMO_CONTRACTOR_ID],
    queryFn: () => fetch(`/api/compliance?entityType=organization&entityId=${DEMO_CONTRACTOR_ID}`).then(res => res.json()),
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'valid': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'expiring': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'expired': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <FileText className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid': return 'default';
      case 'expiring': return 'secondary';
      case 'expired': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-muted-foreground">Loading compliance documents...</div>
      </div>
    );
  }

  const validDocs = complianceDocs.filter((d: any) => d.status === 'valid');
  const expiringDocs = complianceDocs.filter((d: any) => d.status === 'expiring');
  const expiredDocs = complianceDocs.filter((d: any) => d.status === 'expired');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Compliance Documents</h1>
          <p className="text-muted-foreground">Manage your organization's compliance and certifications</p>
        </div>
        <Button size="lg" data-testid="button-upload-doc">
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-green-500/10 mb-3">
                <CheckCircle className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl font-semibold mb-1">{validDocs.length}</div>
              <div className="text-sm text-muted-foreground">Valid Documents</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-yellow-500/10 mb-3">
                <Clock className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-semibold mb-1">{expiringDocs.length}</div>
              <div className="text-sm text-muted-foreground">Expiring Soon</div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-500/10 mb-3">
                <AlertCircle className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-2xl font-semibold mb-1">{expiredDocs.length}</div>
              <div className="text-sm text-muted-foreground">Expired</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {complianceDocs.map((doc: any) => (
          <Card key={doc.id} data-testid={`card-doc-${doc.id}`}>
            <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
              <div className="flex items-start gap-3 flex-1">
                {getStatusIcon(doc.status)}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold mb-1">{doc.type}</h3>
                  {doc.fileName && (
                    <p className="text-sm text-muted-foreground">{doc.fileName}</p>
                  )}
                </div>
              </div>
              <Badge variant={getStatusColor(doc.status)} data-testid={`badge-status-${doc.id}`}>
                {doc.status}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                {doc.issuedDate && (
                  <div>
                    <span className="text-muted-foreground">Issued:</span>
                    <span className="ml-2 font-medium">
                      {new Date(doc.issuedDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                
                {doc.expiryDate && (
                  <div>
                    <span className="text-muted-foreground">Expires:</span>
                    <span className="ml-2 font-medium">
                      {new Date(doc.expiryDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
              
              {doc.status === 'expiring' && (
                <div className="flex items-center gap-2 text-sm text-yellow-600 dark:text-yellow-500 bg-yellow-500/10 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span>This document will expire soon. Please renew it.</span>
                </div>
              )}
              
              {doc.status === 'expired' && (
                <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-500 bg-red-500/10 p-2 rounded">
                  <AlertCircle className="h-4 w-4" />
                  <span>This document has expired. Upload a new version immediately.</span>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="flex gap-2 pt-4">
              <Button variant="outline" size="sm" data-testid={`button-view-${doc.id}`}>
                View Document
              </Button>
              {doc.status === 'expiring' || doc.status === 'expired' ? (
                <Button size="sm" className="ml-auto" data-testid={`button-renew-${doc.id}`}>
                  Renew Document
                </Button>
              ) : null}
            </CardFooter>
          </Card>
        ))}
        
        {complianceDocs.length === 0 && (
          <Card className="p-12">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <Shield className="h-16 w-16 text-muted-foreground/50" />
              <div>
                <h3 className="text-lg font-semibold mb-2">No compliance documents</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload your first compliance document to get started</p>
                <Button data-testid="button-upload-first-doc">
                  <Plus className="h-4 w-4 mr-2" />
                  Upload First Document
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
