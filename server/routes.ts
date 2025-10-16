import type { Express } from "express";
import { storage } from "./storage";
import { insertTenderSchema, insertBidSchema, insertCrewMemberSchema, insertComplianceDocSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";

export function registerRoutes(app: Express) {
  // Organizations
  app.get("/api/organizations/:id", async (req, res) => {
    const org = await storage.getOrganization(req.params.id);
    if (!org) {
      return res.status(404).json({ error: "Organization not found" });
    }
    res.json(org);
  });

  app.get("/api/organizations", async (req, res) => {
    const { type } = req.query;
    const orgs = await storage.getOrganizations(type as string);
    res.json(orgs);
  });

  app.patch("/api/organizations/:id/availability", async (req, res) => {
    const { available } = req.body;
    await storage.updateOrganizationAvailability(req.params.id, available);
    res.json({ success: true });
  });

  // Tenders
  app.get("/api/tenders/:id", async (req, res) => {
    const tender = await storage.getTender(req.params.id);
    if (!tender) {
      return res.status(404).json({ error: "Tender not found" });
    }
    res.json(tender);
  });

  app.get("/api/tenders", async (req, res) => {
    const { status, organizationId } = req.query;
    const tenders = await storage.getTenders({
      status: status as string,
      organizationId: organizationId as string,
    });
    res.json(tenders);
  });

  app.post("/api/tenders", async (req, res) => {
    // Convert date strings to Date objects for Zod validation
    const body = {
      ...req.body,
      deadline: req.body.deadline ? new Date(req.body.deadline) : undefined,
      startDate: req.body.startDate ? new Date(req.body.startDate) : undefined,
    };
    const validated = insertTenderSchema.parse(body);
    const tender = await storage.createTender(validated);
    res.json(tender);
  });

  app.patch("/api/tenders/:id/status", async (req, res) => {
    const { status } = req.body;
    await storage.updateTenderStatus(req.params.id, status);
    res.json({ success: true });
  });

  // Bids
  app.get("/api/bids/:id", async (req, res) => {
    const bid = await storage.getBid(req.params.id);
    if (!bid) {
      return res.status(404).json({ error: "Bid not found" });
    }
    res.json(bid);
  });

  app.get("/api/bids", async (req, res) => {
    const { tenderId, contractorId, status } = req.query;
    const bids = await storage.getBids({
      tenderId: tenderId as string,
      contractorId: contractorId as string,
      status: status as string,
    });
    res.json(bids);
  });

  app.post("/api/bids", async (req, res) => {
    const validated = insertBidSchema.parse(req.body);
    const bid = await storage.createBid(validated);
    res.json(bid);
  });

  app.patch("/api/bids/:id/status", async (req, res) => {
    const { status } = req.body;
    await storage.updateBidStatus(req.params.id, status);
    res.json({ success: true });
  });

  // Crew Members
  app.get("/api/crew/:id", async (req, res) => {
    const member = await storage.getCrewMember(req.params.id);
    if (!member) {
      return res.status(404).json({ error: "Crew member not found" });
    }
    res.json(member);
  });

  app.get("/api/crew", async (req, res) => {
    const { organizationId } = req.query;
    if (!organizationId) {
      return res.status(400).json({ error: "organizationId is required" });
    }
    const crew = await storage.getCrewMembers(organizationId as string);
    res.json(crew);
  });

  app.post("/api/crew", async (req, res) => {
    const validated = insertCrewMemberSchema.parse(req.body);
    const member = await storage.createCrewMember(validated);
    res.json(member);
  });

  // Compliance
  app.get("/api/compliance", async (req, res) => {
    const { entityType, entityId } = req.query;
    if (!entityType || !entityId) {
      return res.status(400).json({ error: "entityType and entityId are required" });
    }
    const docs = await storage.getComplianceDocs({
      entityType: entityType as string,
      entityId: entityId as string,
    });
    res.json(docs);
  });

  app.post("/api/compliance", async (req, res) => {
    const validated = insertComplianceDocSchema.parse(req.body);
    const doc = await storage.createComplianceDoc(validated);
    res.json(doc);
  });

  // Matching
  app.get("/api/match/contractors/:tenderId", async (req, res) => {
    const { limit } = req.query;
    const contractors = await storage.getMatchedContractors(
      req.params.tenderId,
      limit ? parseInt(limit as string) : undefined
    );
    res.json(contractors);
  });

  app.get("/api/match/tenders/:contractorId", async (req, res) => {
    const { limit } = req.query;
    const tenders = await storage.getMatchedTenders(
      req.params.contractorId,
      limit ? parseInt(limit as string) : undefined
    );
    res.json(tenders);
  });

  // Messages
  app.get("/api/messages", async (req, res) => {
    const { senderId, receiverId, tenderId } = req.query;
    const msgs = await storage.getMessages({
      senderId: senderId as string,
      receiverId: receiverId as string,
      tenderId: tenderId as string,
    });
    res.json(msgs);
  });

  app.post("/api/messages", async (req, res) => {
    const validated = insertMessageSchema.parse(req.body);
    const message = await storage.createMessage(validated);
    res.json(message);
  });

  // Reviews
  app.post("/api/reviews", async (req, res) => {
    const validated = insertReviewSchema.parse(req.body);
    const review = await storage.createReview(validated);
    res.json(review);
  });

  // Analytics
  app.get("/api/stats/tenderer/:organizationId", async (req, res) => {
    const stats = await storage.getTendererStats(req.params.organizationId);
    res.json(stats);
  });

  app.get("/api/stats/contractor/:organizationId", async (req, res) => {
    const stats = await storage.getContractorStats(req.params.organizationId);
    res.json(stats);
  });
}
