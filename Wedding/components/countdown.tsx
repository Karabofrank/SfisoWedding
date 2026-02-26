"use client";

import { useEffect, useState } from "react";
import { WEDDING } from "@/lib/constants";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calculateTimeLeft(): TimeLeft {
  const target = new Date(WEDDING.matrimonial.dateISO).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-3 md:gap-6">
        {["Days", "Hours", "Minutes", "Seconds"].map((label) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-serif text-3xl md:text-5xl text-primary tabular-nums opacity-30">
              {"--"}
            </span>
            <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-1">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 md:gap-6">
      {units.map((unit) => (
        <div key={unit.label} className="flex flex-col items-center">
          <span className="font-serif text-3xl md:text-5xl text-primary tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="text-xs md:text-sm text-muted-foreground uppercase tracking-wider mt-1">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
