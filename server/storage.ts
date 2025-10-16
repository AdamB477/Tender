import { db } from "./db";
import { 
  organizations, 
  tenders, 
  bids, 
  crewMembers, 
  complianceDocs,
  messages,
  reviews,
  type Organization,
  type Tender,
  type Bid,
  type CrewMember,
  type ComplianceDoc,
  type InsertTender,
  type InsertBid,
  type InsertCrewMember,
  type InsertComplianceDoc,
  type InsertMessage,
  type InsertReview,
} from "@shared/schema";
import { eq, and, or, desc, sql, asc, inArray } from "drizzle-orm";

export interface IStorage {
  getOrganization(id: string): Promise<Organization | undefined>;
  getOrganizations(type?: string): Promise<Organization[]>;
  updateOrganizationAvailability(id: string, available: boolean): Promise<void>;
  
  getTender(id: string): Promise<any>;
  getTenders(filters?: { status?: string; organizationId?: string }): Promise<any[]>;
  createTender(data: InsertTender): Promise<Tender>;
  updateTenderStatus(id: string, status: string): Promise<void>;
  
  getBid(id: string): Promise<any>;
  getBids(filters?: { tenderId?: string; contractorId?: string; status?: string }): Promise<any[]>;
  createBid(data: InsertBid): Promise<Bid>;
  updateBidStatus(id: string, status: string): Promise<void>;
  
  getCrewMember(id: string): Promise<CrewMember | undefined>;
  getCrewMembers(organizationId: string): Promise<CrewMember[]>;
  createCrewMember(data: InsertCrewMember): Promise<CrewMember>;
  
  getComplianceDocs(filters: { entityType: string; entityId: string }): Promise<ComplianceDoc[]>;
  createComplianceDoc(data: InsertComplianceDoc): Promise<ComplianceDoc>;
  
  getMatchedContractors(tenderId: string, limit?: number): Promise<any[]>;
  getMatchedTenders(contractorId: string, limit?: number): Promise<any[]>;
  
  getMessages(filters: { senderId?: string; receiverId?: string; tenderId?: string }): Promise<any[]>;
  createMessage(data: InsertMessage): Promise<any>;
  
  createReview(data: InsertReview): Promise<any>;
  
  getTendererStats(organizationId: string): Promise<any>;
  getContractorStats(organizationId: string): Promise<any>;
}

export class DbStorage implements IStorage {
  async getOrganization(id: string) {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async getOrganizations(type?: string) {
    if (type) {
      return db.select().from(organizations).where(eq(organizations.type, type as any));
    }
    return db.select().from(organizations);
  }

  async updateOrganizationAvailability(id: string, available: boolean) {
    await db.update(organizations).set({ available }).where(eq(organizations.id, id));
  }

  async getTender(id: string) {
    const [tender] = await db
      .select({
        tender: tenders,
        organization: organizations,
      })
      .from(tenders)
      .leftJoin(organizations, eq(tenders.organizationId, organizations.id))
      .where(eq(tenders.id, id));
    return tender;
  }

  async getTenders(filters?: { status?: string; organizationId?: string }) {
    const conditions = [];
    
    if (filters?.status) {
      conditions.push(eq(tenders.status, filters.status as any));
    }
    if (filters?.organizationId) {
      conditions.push(eq(tenders.organizationId, filters.organizationId));
    }

    let query = db
      .select({
        tender: tenders,
        organization: organizations,
      })
      .from(tenders)
      .leftJoin(organizations, eq(tenders.organizationId, organizations.id))
      .orderBy(desc(tenders.createdAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query;
  }

  async createTender(data: InsertTender) {
    const [tender] = await db.insert(tenders).values(data).returning();
    return tender;
  }

  async updateTenderStatus(id: string, status: string) {
    await db.update(tenders).set({ status: status as any }).where(eq(tenders.id, id));
  }

  async getBid(id: string) {
    const [bid] = await db
      .select({
        bid: bids,
        contractor: organizations,
        tender: tenders,
      })
      .from(bids)
      .leftJoin(organizations, eq(bids.contractorId, organizations.id))
      .leftJoin(tenders, eq(bids.tenderId, tenders.id))
      .where(eq(bids.id, id));
    return bid;
  }

  async getBids(filters?: { tenderId?: string; contractorId?: string; status?: string }) {
    const conditions = [];
    
    if (filters?.tenderId) {
      conditions.push(eq(bids.tenderId, filters.tenderId));
    }
    if (filters?.contractorId) {
      conditions.push(eq(bids.contractorId, filters.contractorId));
    }
    if (filters?.status) {
      conditions.push(eq(bids.status, filters.status as any));
    }

    let query = db
      .select({
        bid: bids,
        contractor: organizations,
        tender: tenders,
      })
      .from(bids)
      .leftJoin(organizations, eq(bids.contractorId, organizations.id))
      .leftJoin(tenders, eq(bids.tenderId, tenders.id))
      .orderBy(desc(bids.submittedAt));

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    return query;
  }

  async createBid(data: InsertBid) {
    const [bid] = await db.insert(bids).values(data).returning();
    return bid;
  }

  async updateBidStatus(id: string, status: string) {
    await db.update(bids).set({ status: status as any }).where(eq(bids.id, id));
  }

  async getCrewMember(id: string) {
    const [member] = await db.select().from(crewMembers).where(eq(crewMembers.id, id));
    return member;
  }

  async getCrewMembers(organizationId: string) {
    return db.select().from(crewMembers).where(eq(crewMembers.organizationId, organizationId));
  }

  async createCrewMember(data: InsertCrewMember) {
    const [member] = await db.insert(crewMembers).values(data).returning();
    return member;
  }

  async getComplianceDocs(filters: { entityType: string; entityId: string }) {
    return db
      .select()
      .from(complianceDocs)
      .where(
        and(
          eq(complianceDocs.entityType, filters.entityType),
          eq(complianceDocs.entityId, filters.entityId)
        )
      );
  }

  async createComplianceDoc(data: InsertComplianceDoc) {
    const [doc] = await db.insert(complianceDocs).values(data).returning();
    return doc;
  }

  async getMatchedContractors(tenderId: string, limit = 10) {
    const [tender] = await db.select().from(tenders).where(eq(tenders.id, tenderId));
    if (!tender) return [];

    const contractors = await db
      .select()
      .from(organizations)
      .where(and(eq(organizations.type, "contractor"), eq(organizations.available, true)))
      .limit(limit);

    return contractors.map(contractor => {
      const skillsMatch = this.calculateSkillsMatch(tender.requiredSkills || [], contractor.capabilities || []);
      const distance = this.calculateDistance(
        tender.latitude, 
        tender.longitude, 
        contractor.latitude, 
        contractor.longitude
      );
      
      const reliabilityScore = contractor.reliabilityScore || 50;
      const availabilityBonus = contractor.available ? 10 : 0;
      
      const matchScore = Math.round(
        skillsMatch * 0.5 + 
        Math.min(100, (1 - distance / 50) * 100) * 0.3 + 
        (reliabilityScore / 100) * 100 * 0.15 +
        availabilityBonus * 0.05
      );

      return {
        ...contractor,
        matchScore,
        distance: `${Math.round(distance)}km`,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  async getMatchedTenders(contractorId: string, limit = 10) {
    const [contractor] = await db.select().from(organizations).where(eq(organizations.id, contractorId));
    if (!contractor) return [];

    const openTenders = await db
      .select()
      .from(tenders)
      .where(eq(tenders.status, "open"))
      .limit(limit);

    return openTenders.map(tender => {
      const skillsMatch = this.calculateSkillsMatch(tender.requiredSkills || [], contractor.capabilities || []);
      const distance = this.calculateDistance(
        tender.latitude,
        tender.longitude,
        contractor.latitude,
        contractor.longitude
      );
      
      const availabilityBonus = contractor.available ? 10 : 0;
      
      const matchScore = Math.round(
        skillsMatch * 0.6 + 
        Math.min(100, (1 - distance / 50) * 100) * 0.3 +
        availabilityBonus * 0.1
      );

      return {
        ...tender,
        matchScore,
        distance: `${Math.round(distance)}km`,
      };
    }).sort((a, b) => b.matchScore - a.matchScore);
  }

  private calculateSkillsMatch(required: string[], available: string[]): number {
    if (required.length === 0) return 100;
    const matches = required.filter(skill => 
      available.some(avail => avail.toLowerCase().includes(skill.toLowerCase()) || 
                             skill.toLowerCase().includes(avail.toLowerCase()))
    );
    return (matches.length / required.length) * 100;
  }

  private calculateDistance(lat1: number | null, lng1: number | null, lat2: number | null, lng2: number | null): number {
    if (!lat1 || !lng1 || !lat2 || !lng2) return 50;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  async getMessages(filters: { senderId?: string; receiverId?: string; tenderId?: string }) {
    const conditions = [];
    if (filters.senderId) conditions.push(eq(messages.senderId, filters.senderId));
    if (filters.receiverId) conditions.push(eq(messages.receiverId, filters.receiverId));
    if (filters.tenderId) conditions.push(eq(messages.tenderId, filters.tenderId));

    if (conditions.length === 0) return [];

    return db
      .select()
      .from(messages)
      .where(and(...conditions))
      .orderBy(desc(messages.createdAt));
  }

  async createMessage(data: InsertMessage) {
    const [message] = await db.insert(messages).values(data).returning();
    return message;
  }

  async createReview(data: InsertReview) {
    const [review] = await db.insert(reviews).values(data).returning();
    
    const allReviews = await db
      .select()
      .from(reviews)
      .where(eq(reviews.revieweeId, data.revieweeId));
    
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;
    await db
      .update(organizations)
      .set({ 
        rating: avgRating.toFixed(2),
        reviewCount: allReviews.length 
      })
      .where(eq(organizations.id, data.revieweeId));

    return review;
  }

  async getTendererStats(organizationId: string) {
    const userTenders = await db.select().from(tenders).where(eq(tenders.organizationId, organizationId));
    const activeTenders = userTenders.filter(t => t.status === 'open' || t.status === 'draft').length;
    
    const tenderIds = userTenders.map(t => t.id);
    const allBids = tenderIds.length > 0 
      ? await db.select().from(bids).where(inArray(bids.tenderId, tenderIds))
      : [];
    
    const avgBidValue = allBids.length > 0
      ? allBids.reduce((sum, b) => sum + Number(b.price), 0) / allBids.length
      : 0;
    
    const shortlistedCount = allBids.filter(b => b.status === 'shortlisted').length;

    return {
      activeTenders,
      bidsReceived: allBids.length,
      avgBidValue: Math.round(avgBidValue),
      contractorsShortlisted: shortlistedCount,
    };
  }

  async getContractorStats(organizationId: string) {
    const allBids = await db.select().from(bids).where(eq(bids.contractorId, organizationId));
    const activeBids = allBids.filter(b => b.status === 'pending' || b.status === 'shortlisted').length;
    const wonBids = allBids.filter(b => b.status === 'awarded').length;
    const winRate = allBids.length > 0 ? (wonBids / allBids.length) * 100 : 0;
    const avgBidValue = allBids.length > 0
      ? allBids.reduce((sum, b) => sum + Number(b.price), 0) / allBids.length
      : 0;

    return {
      activeBids,
      winRate: Math.round(winRate),
      avgBidValue: Math.round(avgBidValue),
      jobsWonThisMonth: wonBids,
    };
  }
}

export const storage = new DbStorage();
