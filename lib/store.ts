import type { LeaderboardEntry, User } from "@/types"
import bcrypt from "bcryptjs"

const seededUsers = new Map<string, User>([
  [
    "seed1",
    {
      id: "seed1",
      name: "Arjun S.",
      email: "arjun@demo.com",
      xp: 1850,
      level: "Engineer",
      badges: ["First Step", "Code Breaker", "Game On", "On Fire"],
      completed_msns: ["linear-regression", "neural-networks", "decision-trees"],
      skill_vector: { python: 0.8, tf: 0.7, pytorch: 0.6, nlp: 0.5, cv: 0.4, data_eng: 0.7 },
      updated_at: new Date().toISOString()
    }
  ],
  [
    "seed2",
    {
      id: "seed2",
      name: "Priya M.",
      email: "priya@demo.com",
      xp: 1200,
      level: "Practitioner",
      badges: ["First Step", "On Fire"],
      completed_msns: ["linear-regression", "decision-trees"],
      skill_vector: { python: 0.6, tf: 0.5, pytorch: 0.4, nlp: 0.3, cv: 0.2, data_eng: 0.5 },
      updated_at: new Date().toISOString()
    }
  ],
  [
    "seed3",
    {
      id: "seed3",
      name: "Rohan K.",
      email: "rohan@demo.com",
      xp: 900,
      level: "Practitioner",
      badges: ["First Step", "Code Breaker"],
      completed_msns: ["linear-regression"],
      skill_vector: { python: 0.5, tf: 0.4, pytorch: 0.3, nlp: 0.2, cv: 0.1, data_eng: 0.4 },
      updated_at: new Date().toISOString()
    }
  ],
  [
    "seed4",
    {
      id: "seed4",
      name: "Sneha P.",
      email: "sneha@demo.com",
      xp: 550,
      level: "Learner",
      badges: ["First Step"],
      completed_msns: [],
      skill_vector: { python: 0.3, tf: 0.2, pytorch: 0.1, nlp: 0.1, cv: 0.1, data_eng: 0.2 },
      updated_at: new Date().toISOString()
    }
  ],
  [
    "seed5",
    {
      id: "seed5",
      name: "Dev T.",
      email: "dev@demo.com",
      xp: 280,
      level: "Learner",
      badges: ["Game On"],
      completed_msns: [],
      skill_vector: { python: 0.2, tf: 0.1, pytorch: 0.1, nlp: 0.1, cv: 0.1, data_eng: 0.1 },
      updated_at: new Date().toISOString()
    }
  ]
])

declare global {
  // eslint-disable-next-line no-var
  var __vibeathonUsers: Map<string, User> | undefined
  // eslint-disable-next-line no-var
  var __vibeathonUserPasswords: Map<string, string> | undefined
}

const users = globalThis.__vibeathonUsers ?? new Map<string, User>(seededUsers)
if (!globalThis.__vibeathonUsers) {
  globalThis.__vibeathonUsers = users
}
const userPasswords = globalThis.__vibeathonUserPasswords ?? new Map<string, string>()
if (!globalThis.__vibeathonUserPasswords) {
  globalThis.__vibeathonUserPasswords = userPasswords
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

function cloneUser(user: User): User {
  return {
    ...user,
    badges: [...user.badges],
    completed_msns: [...user.completed_msns],
    skill_vector: { ...user.skill_vector }
  }
}

export function getUser(id: string): User | undefined {
  const user = users.get(id)
  return user ? cloneUser(user) : undefined
}

export function getUserByEmail(email: string): User | undefined {
  const normalized = normalizeEmail(email)
  for (const user of users.values()) {
    if (normalizeEmail(user.email) === normalized) return cloneUser(user)
  }
  return undefined
}

export function createUser(user: User): User {
  users.set(user.id, cloneUser(user))
  return cloneUser(user)
}

export function updateUser(id: string, updates: Partial<User>): User {
  const existing = users.get(id)
  if (!existing) throw new Error("USER_NOT_FOUND")
  const updated: User = {
    ...existing,
    ...updates,
    badges: updates.badges ? [...updates.badges] : [...existing.badges],
    completed_msns: updates.completed_msns
      ? [...updates.completed_msns]
      : [...existing.completed_msns],
    skill_vector: updates.skill_vector
      ? { ...updates.skill_vector }
      : { ...existing.skill_vector }
  }
  users.set(id, updated)
  return cloneUser(updated)
}

export function getAllUsers(): User[] {
  return Array.from(users.values()).map(cloneUser)
}

export function getLeaderboard(): LeaderboardEntry[] {
  return getAllUsers()
    .sort((a, b) => b.xp - a.xp)
    .map((user, index) => ({
      rank: index + 1,
      name: user.name,
      xp: user.xp,
      level: user.level,
      badges: [...user.badges]
    }))
}

export async function setUserPassword(email: string, password: string): Promise<void> {
  const normalized = normalizeEmail(email)
  const hash = await bcrypt.hash(password, 10)
  userPasswords.set(normalized, hash)
}

export async function verifyUserPassword(email: string, password: string): Promise<boolean> {
  const normalized = normalizeEmail(email)
  const hash = userPasswords.get(normalized)
  if (!hash) return false
  return bcrypt.compare(password, hash)
}

