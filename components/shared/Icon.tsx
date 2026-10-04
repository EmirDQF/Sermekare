import {
  Activity,
  CalendarCheck,
  ClipboardList,
  FileCheck2,
  Crosshair,
  Dumbbell,
  FlaskConical,
  Microscope,
  Pill,
  ScanLine,
  Stethoscope,
  Syringe,
  Video,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { IconName } from "@/types/medical";
import { cn } from "@/lib/utils";

const ICONS: Record<IconName, LucideIcon> = {
  scan: ScanLine,
  syringe: Syringe,
  video: Video,
  crosshair: Crosshair,
  stethoscope: Stethoscope,
  activity: Activity,
  flask: FlaskConical,
  pill: Pill,
  waves: Waves,
  dumbbell: Dumbbell,
  microscope: Microscope,
  calendar: CalendarCheck,
  clipboard: ClipboardList,
  "file-check": FileCheck2,
};

interface IconProps {
  name: IconName;
  className?: string;
}

export function Icon({ name, className }: IconProps) {
  const Component = ICONS[name];
  return <Component aria-hidden strokeWidth={1.75} className={cn("size-6", className)} />;
}

interface IconBadgeProps extends IconProps {
  size?: "md" | "lg";
}

/** Icono lucide dentro de un contenedor suave con tinte teal. */
export function IconBadge({ name, className, size = "md" }: IconBadgeProps) {
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-2xl bg-teal-tint text-primary",
        size === "lg" ? "size-14" : "size-12",
        className,
      )}
    >
      <Icon name={name} className={size === "lg" ? "size-7" : "size-6"} />
    </span>
  );
}
