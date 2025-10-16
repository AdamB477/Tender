import { ComplianceDocCard } from "../ComplianceDocCard";

export default function ComplianceDocCardExample() {
  return (
    <div className="p-6 space-y-3 max-w-2xl">
      <ComplianceDocCard
        type="Public Liability Insurance"
        issuedDate="Jan 2024"
        expiryDate="Jan 2026"
        status="valid"
        fileName="insurance_liability_2024.pdf"
        onView={() => console.log("View document")}
        onDownload={() => console.log("Download document")}
      />
      <ComplianceDocCard
        type="White Card"
        issuedDate="Mar 2023"
        expiryDate="Feb 2025"
        status="expiring"
        fileName="white_card.pdf"
        onView={() => console.log("View document")}
        onDownload={() => console.log("Download document")}
      />
      <ComplianceDocCard
        type="WorkCover Certificate"
        issuedDate="Aug 2023"
        expiryDate="Oct 2024"
        status="expired"
        fileName="workcover_2023.pdf"
        onView={() => console.log("View document")}
        onDownload={() => console.log("Download document")}
      />
    </div>
  );
}
