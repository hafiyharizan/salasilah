import type {
  User,
  Family,
  FamilyMember,
  Relationship,
  Photo,
  Invite,
  TreeNodeLayout,
  Gender,
  Religion,
  RelationshipType,
  FamilyRole,
  InviteStatus,
  PhotoCategory,
} from '@prisma/client'

export type {
  User,
  Family,
  FamilyMember,
  Relationship,
  Photo,
  Invite,
  Gender,
  Religion,
  RelationshipType,
  FamilyRole,
  InviteStatus,
  PhotoCategory,
  TreeNodeLayout,
}

// Extended types with relations
export type FamilyMemberWithRelations = FamilyMember & {
  relationshipsAsFrom: (Relationship & { to: FamilyMember })[]
  relationshipsAsTo: (Relationship & { from: FamilyMember })[]
  photos: Photo[]
}

export type FamilyWithMembers = Family & {
  members: FamilyMember[]
  _count?: { members: number }
}

// React Flow node data
export interface MemberNodeData extends Record<string, unknown> {
  member: FamilyMember
  branchColor: string
  isCurrentUser?: boolean
}

// Dashboard stats
export interface FamilyStats {
  totalMembers: number
  totalGenerations: number
  totalBranches: number
  upcomingBirthdays: UpcomingBirthday[]
  recentMembers: FamilyMember[]
}

export interface UpcomingBirthday {
  member: FamilyMember
  daysUntil: number
}

// Tree data for React Flow
export interface TreeData {
  nodes: import('@xyflow/react').Node<MemberNodeData>[]
  edges: import('@xyflow/react').Edge[]
}

// Search result
export interface SearchResult {
  members: FamilyMember[]
  total: number
}

// Invite with sender info
export type InviteWithSender = Invite & {
  sender: Pick<User, 'id' | 'name' | 'email'>
  family: Pick<Family, 'id' | 'name'>
}

// Session user type extension
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
