import { serviceBookings } from "@/data/services";
import { hqMap } from "@/data/coordonnees";
import { translate as t } from "@/lib/language";
import { Icon } from "@/components/ui/Icon";

export function ServiceBooking({ service }: { service: keyof typeof serviceBookings }) {
  const booking = serviceBookings[service];
  return (
    <div className="mt-6">
      {booking.instructions ? <p className="max-w-[620px] text-body leading-[1.7] text-[#5f5d57]">{booking.instructions}</p> : null}
      <div className="mt-6 flex flex-wrap items-center gap-6">
        <a href={booking.href} target="_blank" rel="noreferrer" className="button button-accent">
          {booking.label}<span><Icon name="arrow-up-right" /></span>
        </a>
        <a href={hqMap.directionsUrl} target="_blank" rel="noreferrer" className="text-link">
          {t("Voir l’itinéraire")} <span><Icon name="arrow-up-right" /></span>
        </a>
      </div>
    </div>
  );
}
