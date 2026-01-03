import { Router } from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { z } from "zod"
import { prisma } from "../prisma.js"
import { auth } from "../middleware/auth.middleware.js"

const router = Router()

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

router.post("/register", async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body)

    const existing = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (existing) return res.status(409).json({ message: "Email already used" })

    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
      data: { name: data.name, email: data.email, passwordHash, role: "user" },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })

    res.status(201).json(user)
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", issues: err.issues })
    }
    next(err)
  }
})

router.post("/login", async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })
    if (!user) return res.status(401).json({ message: "Invalid credentials" })

    const ok = await bcrypt.compare(data.password, user.passwordHash)
    if (!ok) return res.status(401).json({ message: "Invalid credentials" })

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    )

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    })
  } catch (err) {
    if (err?.name === "ZodError") {
      return res.status(400).json({ message: "Validation error", issues: err.issues })
    }
    next(err)
  }
})

router.get("/me", auth, async (req, res, next) => {
  try {
    const me = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    })
    res.json(me)
  } catch (err) {
    next(err)
  }
})

export default router
