import { Router } from "express";
import { z } from "zod";
import { prisma } from "../prisma.js";
import { auth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

/**
 * Schemas
 */
const updateStatusSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]),
});

const createTicketSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(1).optional(),
  category: z.string().trim().min(1),
  priority: z.enum(["low", "medium", "high"]),
  location: z.string().min(1).optional(),
});

const updateTicketSchema = z
  .object({
    title: z.string().min(3).optional(),
    description: z.string().min(1).optional(),
  })
  .refine((data) => data.title || data.description, {
    message: "Nothing to update",
  });

const listTicketsQuerySchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "closed"]).optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  category: z.string().trim().min(1).optional(),

  // ✅ FIX: q boleh kosong (""), supaya tidak 400 saat user sedang mengetik/menghapus
  q: z.string().trim().optional(),

  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

/**
 * POST /api/tickets
 */
router.post("/", auth, async (req, res, next) => {
  try {
    const data = createTicketSchema.parse(req.body);

    const ticket = await prisma.ticket.create({
      data: {
        userId: req.user.id,
        title: data.title,
        description: data.description ?? null,
        category: data.category,
        priority: data.priority,
        location: data.location ?? null,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        category: true,
        location: true, // ✅ FIX: select harus boolean, bukan isi value
        createdAt: true,
      },
    });

    return res.status(201).json(ticket);
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", issues: err.issues });
    }
    return next(err);
  }
});

/**
 * GET /api/tickets/all
 */
router.get("/all", auth, requireRole("staff"), async (req, res, next) => {
  try {
    const tickets = await prisma.ticket.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        userId: true,
        createdAt: true,
      },
    });

    return res.json(tickets);
  } catch (err) {
    return next(err);
  }
});

router.get("/dashboard", auth, requireRole("staff"), async (req, res, next) => {
  try {
    const [total, open, inProgress, resolved, closed, latest, categories] =
      await prisma.$transaction([
        prisma.ticket.count(),
        prisma.ticket.count({ where: { status: "open" } }),
        prisma.ticket.count({ where: { status: "in_progress" } }),
        prisma.ticket.count({ where: { status: "resolved" } }),
        prisma.ticket.count({ where: { status: "closed" } }),

        prisma.ticket.findMany({
          orderBy: { createdAt: "desc" },
          take: 10,
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            category: true,
            createdAt: true,
          },
        }),

        prisma.ticket.findMany({
          select: { category: true },
        }),
      ]);

    // hitung top categories di JS (lebih aman daripada groupBy)
    const map = new Map();
    for (const row of categories) {
      const key = row.category || "uncategorized";
      map.set(key, (map.get(key) || 0) + 1);
    }

    const topCategories = Array.from(map.entries())
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    return res.json({
      data: {
        total,
        byStatus: {
          open,
          in_progress: inProgress,
          resolved,
          closed,
        },
        topCategories,
        latest,
      },
    });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET /api/tickets
 * ✅ FIX SEARCH + FILTER + ROLE (tidak overwrite where)
 */
router.get("/", auth, async (req, res, next) => {
  try {
    const query = listTicketsQuerySchema.parse(req.query);

    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const take = limit;

    /** =========================
     * Build WHERE safely
     * ========================= */
    const where = {
      ...(req.user.role === "user" ? { userId: req.user.id } : {}),
      ...(query.status ? { status: query.status } : {}),
      ...(query.priority ? { priority: query.priority } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.q
        ? {
            OR: [
              { title: { contains: query.q } },
              { description: { contains: query.q } },
            ],
          }
        : {}),
    };

    const [total, rows] = await prisma.$transaction([
      prisma.ticket.count({ where }),
      prisma.ticket.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        select: {
          id: true,
          title: true,
          status: true,
          priority: true,
          createdAt: true,
        },
      }),
    ]);

    return res.json({
      data: rows,
      meta: { page, limit, total },
    });
  } catch (err) {
    console.error("LIST TICKETS ERROR:", err);
    if (err?.name === "ZodError") {
      return res.status(400).json({
        message: "Validation error",
        issues: err.issues,
      });
    }
    return next(err);
  }
});
/* ========================================================= */
/* === GET /api/tickets/:id (DETAIL) ======================= */
/* ========================================================= */

// GET /api/tickets/:id  (DETAIL)
router.get("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }

    // Debug sementara (boleh hapus setelah fix)
    // console.log("[TICKET DETAIL] user:", req.user, "id:", id);

    // Defensive: pastikan req.user ada
    if (!req.user?.id || !req.user?.role) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const isStaff = req.user.role === "staff";

    const where = isStaff
      ? { id }
      : { id, userId: req.user.id };

    const ticket = await prisma.ticket.findFirst({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        category: true,
        location: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    return res.json(ticket);
  } catch (err) {
    console.error("DETAIL TICKET ERROR:", err);
    return next(err);
  }
});

/**
 * PATCH /api/tickets/:id/status
 */
router.patch("/:id/status", auth, requireRole("staff"), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const data = updateStatusSchema.parse(req.body);

    const updated = await prisma.ticket.update({
      where: { id },
      data: { status: data.status },
      select: {
        id: true,
        title: true,
        status: true,
        userId: true,
        updatedAt: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", issues: err.issues });
    }
    if (err?.code === "P2025") {
      return res.status(404).json({ message: "Ticket not found" });
    }
    return next(err);
  }
});

/**
 * PATCH /api/tickets/:id
 */
router.patch("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    const data = updateTicketSchema.parse(req.body);

    const where = req.user.role === "staff" ? { id } : { id, userId: req.user.id };

    const ticket = await prisma.ticket.findFirst({
      where,
      select: { id: true, status: true },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (req.user.role === "user" && ticket.status !== "open") {
      return res.status(400).json({
        message: "Ticket cannot be edited unless status is open",
      });
    }

    const updated = await prisma.ticket.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        updatedAt: true,
      },
    });

    return res.json(updated);
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", issues: err.issues });
    }
    return next(err);
  }
});

/**
 * DELETE /api/tickets/:id
 * - staff: boleh hapus ticket siapa pun, status apa pun
 * - user: hanya ticket miliknya & hanya jika status=open
 */
router.delete("/:id", auth, async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Invalid ticket id" });
    }

    // STAFF: bebas hapus
    if (req.user.role === "staff") {
      // cek exist biar 404 rapi
      const exists = await prisma.ticket.findUnique({
        where: { id },
        select: { id: true },
      });

      if (!exists) {
        return res.status(404).json({ message: "Ticket not found" });
      }

      await prisma.ticket.delete({ where: { id } });
      return res.status(204).send();
    }

    // USER: hanya miliknya dan hanya kalau status=open
    const ticket = await prisma.ticket.findFirst({
      where: { id, userId: req.user.id },
      select: { id: true, status: true },
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    if (ticket.status !== "open") {
      return res.status(400).json({ message: "Only open tickets can be deleted" });
    }

    await prisma.ticket.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
});

export default router;
