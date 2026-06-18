import { LogIn, LogOut, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface QuickInfoCardsProps {
  checkInTime: string;
  checkOutTime: string;
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
  guestCapacity,
}: QuickInfoCardsProps) {
  const items = [
    { icon: LogIn, label: "Check-in", value: `${formatTime(checkInTime)}` },
    { icon: LogOut, label: "Check-out", value: `${formatTime(checkOutTime)}` },
    {
      icon: Users,
      label: "Hóspedes",
      value: String(guestCapacity),
    },
  ];

  return (
    <section className="grid grid-cols-3 gap-3">
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
