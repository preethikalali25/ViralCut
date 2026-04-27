import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MOCK_USERS } from "@/constants/mockData";
import PlatformBadge from "@/components/features/PlatformBadge";
import {
  Search,
  Users,
  Crown,
  Pencil,
  Eye,
  MoreHorizontal,
  Mail,
  Video,
  TrendingUp,
  Circle,
  UserPlus,
} from "lucide-react";
import type { UserRole, UserStatus } from "@/types";

const ROLE_CONFIG: Record<UserRole, { label: string; icon: typeof Crown; color: string; bg: string }> = {
  admin: { label: "Admin", icon: Crown, color: "text-amber-400", bg: "bg-amber-500/15" },
  editor: { label: "Editor", icon: Pencil, color: "text-primary", bg: "bg-primary/15" },
  viewer: { label: "Viewer", icon: Eye, color: "text-sky-400", bg: "bg-sky-500/15" },
};

const STATUS_CONFIG: Record<UserStatus, { label: string; color: string; dot: string }> = {
  active: { label: "Active", color: "text-emerald-400", dot: "bg-emerald-400" },
  inactive: { label: "Inactive", color: "text-muted-foreground", dot: "bg-muted-foreground" },
  pending: { label: "Pending", color: "text-amber-400", dot: "bg-amber-400" },
};

type FilterRole = "all" | UserRole;

function formatViews(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function Team() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<FilterRole>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    return MOCK_USERS.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase());
      const matchesRole = roleFilter === "all" || u.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [search, roleFilter]);

  const selectedUser = selectedUserId
    ? MOCK_USERS.find((u) => u.id === selectedUserId)
    : null;

  const roleCounts = useMemo(() => {
    const counts = { all: MOCK_USERS.length, admin: 0, editor: 0, viewer: 0 };
    MOCK_USERS.forEach((u) => counts[u.role]++);
    return counts;
  }, []);

  return (
    <div className="flex h-[calc(100vh-64px)] gap-6">
      {/* Left: User list */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Team</h1>
            <p className="text-sm text-muted-foreground">
              {MOCK_USERS.length} members across your workspace
            </p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]">
            <UserPlus className="size-4" />
            Invite Member
          </button>
        </div>

        {/* Filters */}
        <div className="mb-4 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border bg-card py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex rounded-xl border border-border bg-card p-1">
            {(["all", "admin", "editor", "viewer"] as FilterRole[]).map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all",
                  roleFilter === role
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {role === "all" ? "All" : ROLE_CONFIG[role].label}
                <span className="ml-1 opacity-60">{roleCounts[role]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
          {filteredUsers.map((user) => {
            const roleConf = ROLE_CONFIG[user.role];
            const statusConf = STATUS_CONFIG[user.status];
            const isSelected = selectedUserId === user.id;

            return (
              <button
                key={user.id}
                onClick={() => setSelectedUserId(user.id)}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all duration-150",
                  isSelected
                    ? "border-primary/40 bg-primary/5 shadow-sm shadow-primary/10"
                    : "border-border bg-card/60 hover:border-muted hover:bg-card"
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="size-11 rounded-full object-cover"
                  />
                  <div
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-background",
                      statusConf.dot
                    )}
                  />
                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-foreground">{user.name}</p>
                    <span className={cn("flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold", roleConf.bg, roleConf.color)}>
                      <roleConf.icon className="size-2.5" />
                      {roleConf.label}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{user.bio}</p>
                </div>

                {/* Stats */}
                <div className="hidden shrink-0 items-center gap-4 text-right sm:flex">
                  <div>
                    <p className="font-mono text-sm font-bold text-foreground">{user.videosCreated}</p>
                    <p className="text-[10px] text-muted-foreground">Videos</p>
                  </div>
                  <div>
                    <p className="font-mono text-sm font-bold text-foreground">{formatViews(user.totalViews)}</p>
                    <p className="text-[10px] text-muted-foreground">Views</p>
                  </div>
                </div>

                {/* Last active */}
                <span className="hidden shrink-0 text-[11px] text-muted-foreground lg:block">
                  {timeAgo(user.lastActive)}
                </span>
              </button>
            );
          })}

          {filteredUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Users className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground">No members found</p>
              <p className="text-xs text-muted-foreground/60">Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      </div>

      {/* Right: Detail panel */}
      <div className="hidden w-[340px] shrink-0 lg:block">
        {selectedUser ? (
          <div className="spotlight-card sticky top-0 flex flex-col items-center rounded-xl p-6">
            {/* Header */}
            <div className="mb-1 flex w-full justify-end">
              <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                <MoreHorizontal className="size-4" />
              </button>
            </div>

            {/* Avatar */}
            <div className="relative mb-4">
              <img
                src={selectedUser.avatar}
                alt={selectedUser.name}
                className="size-20 rounded-full border-2 border-border object-cover"
              />
              <div
                className={cn(
                  "absolute bottom-0 right-1 size-4 rounded-full border-2 border-background",
                  STATUS_CONFIG[selectedUser.status].dot
                )}
              />
            </div>

            <h2 className="mb-0.5 text-lg font-bold text-foreground">{selectedUser.name}</h2>
            <p className="mb-1 text-xs text-muted-foreground">{selectedUser.email}</p>

            <div className="mb-4 flex items-center gap-2">
              <span
                className={cn(
                  "flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold",
                  ROLE_CONFIG[selectedUser.role].bg,
                  ROLE_CONFIG[selectedUser.role].color
                )}
              >
                {(() => { const Icon = ROLE_CONFIG[selectedUser.role].icon; return <Icon className="size-3" />; })()}
                {ROLE_CONFIG[selectedUser.role].label}
              </span>
              <span className={cn("flex items-center gap-1 text-[11px] font-semibold", STATUS_CONFIG[selectedUser.status].color)}>
                <Circle className="size-2 fill-current" />
                {STATUS_CONFIG[selectedUser.status].label}
              </span>
            </div>

            <p className="mb-6 text-center text-[13px] text-muted-foreground">{selectedUser.bio}</p>

            {/* Stats grid */}
            <div className="mb-6 grid w-full grid-cols-2 gap-3">
              <div className="flex flex-col items-center rounded-lg bg-secondary/60 py-3">
                <Video className="mb-1 size-4 text-primary" />
                <p className="font-mono text-lg font-bold text-foreground">{selectedUser.videosCreated}</p>
                <p className="text-[10px] text-muted-foreground">Videos</p>
              </div>
              <div className="flex flex-col items-center rounded-lg bg-secondary/60 py-3">
                <TrendingUp className="mb-1 size-4 text-amber-400" />
                <p className="font-mono text-lg font-bold text-foreground">{formatViews(selectedUser.totalViews)}</p>
                <p className="text-[10px] text-muted-foreground">Total Views</p>
              </div>
            </div>

            {/* Connected platforms */}
            <div className="mb-6 w-full">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                Connected Platforms
              </p>
              <div className="flex flex-wrap gap-2">
                {selectedUser.connectedPlatforms.length > 0 ? (
                  selectedUser.connectedPlatforms.map((p) => (
                    <PlatformBadge key={p} platform={p} size="md" />
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">None connected</span>
                )}
              </div>
            </div>

            {/* Meta */}
            <div className="w-full space-y-2 border-t border-border pt-4">
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Joined</span>
                <span className="font-medium text-foreground">
                  {new Date(selectedUser.joinedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
              <div className="flex items-center justify-between text-[12px]">
                <span className="text-muted-foreground">Last active</span>
                <span className="font-medium text-foreground">{timeAgo(selectedUser.lastActive)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex w-full gap-2">
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-border bg-card py-2.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted">
                <Mail className="size-3.5" />
                Message
              </button>
              <button className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary/15 py-2.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/25">
                <Pencil className="size-3.5" />
                Edit Role
              </button>
            </div>
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Users className="mb-3 size-12 text-muted-foreground/30" />
            <p className="text-sm font-medium text-muted-foreground">Select a member</p>
            <p className="text-xs text-muted-foreground/60">Click on a user to see details</p>
          </div>
        )}
      </div>
    </div>
  );
}
