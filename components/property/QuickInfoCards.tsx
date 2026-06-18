import { Bath, BedDouble, LogIn, LogOut, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface QuickInfoCardsProps {
  checkInTime: string;
  checkOutTime: string;
  bedroomQuantity: number;
  bathroomQuantity: number;
  guestCapacity: number;
}

/** "15:00" -> "15h", "12:30" -> "12h30". */
function formatTime(time: string): string {
  const [hour, minute] = time.split(":");
  return minute && minute !== "00" ? `${hour}h${minute}` : `${hour}h`;
}

export function QuickInfoCards({
  checkInTime,
  checkOutTime,
  bedroomQuantity,
  bathroomQuantity,
  guestCapacity,
}: QuickInfoCardsProps) {
  const items = [
    { icon: LogIn, label: "Check-in", value: formatTime(checkInTime) },
    { icon: LogOut, label: "Check-out", value: formatTime(checkOutTime) },
    { icon: BedDouble, label: "Quartos", value: String(bedroomQuantity) },
    { icon: Bath, label: "Banheiros", value: String(bathroomQuantity) },
    { icon: Users, label: "Hóspedes", value: String(guestCapacity) },
  ];

  return (
    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {items.map(({ icon: Icon, label, value }) => (
        <Card key={label} size="sm">
          <CardContent className="flex flex-col items-center gap-1 text-center">
            <Icon className="size-5 text-muted-foreground" aria-hidden />
            <span className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
              {label}
            </span>
            <span className="text-xl font-semibold tracking-tight">{value}</span>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
