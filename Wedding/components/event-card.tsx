import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Clock, Shirt } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time?: string;
  venue: string;
  address: string;
  reception?: string;
  dressCode: string;
}

export function EventCard({
  title,
  date,
  time,
  venue,
  address,
  reception,
  dressCode,
}: EventCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="font-serif text-xl md:text-2xl text-primary">
          {title}
        </CardTitle>
        <p className="text-accent font-medium text-sm">{date}</p>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {time && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-accent mt-0.5 shrink-0" />
            <span className="text-sm text-card-foreground">{time}</span>
          </div>
        )}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <div className="text-sm text-card-foreground">
            <p className="font-medium">{venue}</p>
            <p className="text-muted-foreground">{address}</p>
          </div>
        </div>
        {reception && (
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-sage mt-0.5 shrink-0" />
            <div className="text-sm text-card-foreground">
              <p className="font-medium">Reception</p>
              <p className="text-muted-foreground">{reception}</p>
            </div>
          </div>
        )}
        <div className="flex items-start gap-2">
          <Shirt className="h-4 w-4 text-accent mt-0.5 shrink-0" />
          <div className="text-sm text-card-foreground">
            <p className="font-medium">Dress Code</p>
            <p className="text-muted-foreground">{dressCode}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
