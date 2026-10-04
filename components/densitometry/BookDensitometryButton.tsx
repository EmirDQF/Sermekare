import { WhatsAppIcon } from "@/components/shared/BrandIcons";
import { buttonVariants } from "@/components/ui/button";
import { densitometry } from "@/data/densitometry";
import { clinicWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

interface BookDensitometryButtonProps {
  className?: string;
  /** Muestra debajo "Densitometría y consulta en una sola visita". */
  withSupport?: boolean;
}

/** CTA "Agendar densitometría": abre WhatsApp con el mensaje prellenado. */
export function BookDensitometryButton({ className, withSupport = true }: BookDensitometryButtonProps) {
  return (
    <div className={cn("flex flex-col items-start gap-2", className)}>
      <a
        href={clinicWhatsApp(densitometry.cta.message)}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants({ variant: "primary", size: "lg" })}
      >
        <WhatsAppIcon />
        {densitometry.cta.label}
      </a>
      {withSupport ? <p className="text-sm font-semibold text-muted">{densitometry.cta.support}</p> : null}
    </div>
  );
}
