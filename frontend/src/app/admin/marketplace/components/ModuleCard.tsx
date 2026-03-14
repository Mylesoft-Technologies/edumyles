"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TierBadge } from "./TierBadge";
import { ModuleStatusBadge } from "./ModuleStatusBadge";
import { cn } from "@/lib/utils";
import {
  GraduationCap,
  ClipboardList,
  DollarSign,
  BookOpen,
  Calendar,
  MessageSquare,
  UserCog,
  Library,
  Bus,
  Wallet,
  ShoppingCart,
  Headphones,
  Users,
  CheckCircle2,
  ArrowUpCircle,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

const MODULE_ICONS: Record<string, LucideIcon> = {
  sis: GraduationCap,
  admissions: ClipboardList,
  finance: DollarSign,
  academics: BookOpen,
  timetable: Calendar,
  communications: MessageSquare,
  hr: UserCog,
  library: Library,
  transport: Bus,
  ewallet: Wallet,
  ecommerce: ShoppingCart,
  tickets: Headphones,
  users: Users,
};

/** Module dependency display names */
const MODULE_DEPENDENCIES: Record<string, string[]> = {
  academics: ["SIS"],
  admissions: ["SIS"],
  finance: ["SIS"],
  timetable: ["SIS", "Academics"],
  library: ["SIS"],
  transport: ["SIS"],
  ewallet: ["Finance"],
  ecommerce: ["eWallet"],
};

interface ModuleCardProps {
  moduleId: string;
  name: string;
  description: string;
  tier: string;
  category: string;
  status: string;
  isInstalled: boolean;
  availableForTier: boolean;
  onInstall?: () => void;
  onUninstall?: () => void;
  className?: string;
}

export function ModuleCard({
  moduleId,
  name,
  description,
  tier,
  category,
  status,
  isInstalled,
  availableForTier,
  onInstall,
  onUninstall,
  className,
}: ModuleCardProps) {
  const Icon = MODULE_ICONS[moduleId] ?? BookOpen;
  const deps = MODULE_DEPENDENCIES[moduleId];

  return (
    <Card
      className={cn(
        "relative overflow-hidden transition-shadow hover:shadow-md",
        isInstalled && "ring-1 ring-green-300 bg-green-50/30",
        !availableForTier && "opacity-75",
        className
      )}
    >
      <CardContent className="flex flex-col gap-4 p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
            isInstalled ? "bg-green-100" : "bg-primary/10"
          )}>
            <Icon className={cn("h-5 w-5", isInstalled ? "text-green-600" : "text-primary")} />
          </div>
          <div className="flex items-center gap-2">
            {isInstalled && (
              <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Installed
              </Badge>
            )}
            {status === "beta" && <ModuleStatusBadge status="beta" />}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Link
            href={`/admin/marketplace/${moduleId}`}
            className="text-base font-semibold hover:underline"
          >
            {name}
          </Link>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Dependencies */}
        {deps && deps.length > 0 && (
          <div className="text-xs text-muted-foreground">
            Requires: {deps.join(", ")}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TierBadge tier={tier} />
            <span className="text-xs capitalize text-muted-foreground">
              {category}
            </span>
          </div>
          {isInstalled ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onUninstall}
              className="text-destructive hover:text-destructive"
            >
              Uninstall
            </Button>
          ) : availableForTier ? (
            <Button size="sm" onClick={onInstall}>
              Install
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled className="gap-1">
              <ArrowUpCircle className="h-3 w-3" />
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
