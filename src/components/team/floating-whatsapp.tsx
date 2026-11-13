import { WhatsAppIcon } from "@/components/ui/icons";
import "@/styles/floating-whatsapp.css";

interface FloatingWhatsAppProps {
  personName?: string;
  phoneNumber?: string;
}

export function FloatingWhatsApp({
  personName = "Ayomiposi",
  phoneNumber = "447403605289",
}: FloatingWhatsAppProps) {
  return (
    <aside
      className="founder-floating-whatsapp-container"
      aria-label={`Direct WhatsApp contact with ${personName}`}
    >
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="founder-floating-whatsapp-btn"
        aria-label={`Chat with ${personName} on WhatsApp`}
        id="founder-floating-whatsapp"
      >
        <WhatsAppIcon className="whatsapp-icon-svg" />
        <span
          className="founder-floating-whatsapp-tooltip"
          aria-hidden="true"
        >
          Chat with {personName}
        </span>
      </a>
    </aside>
  );
}
