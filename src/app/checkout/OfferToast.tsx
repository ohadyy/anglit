"use client";

import { useState } from "react";
import { Toast } from "@/components/Toast";

// Shown once when the checkout opens with the upcoming-cohort price. The price ends when that cohort
// starts (see upcomingCourseOffer), so "כדאי למהר" is true. It closes by itself after 12 seconds.
export function OfferToast({ priceIls, regularPrice }: { priceIls: number; regularPrice: string | number }) {
  const [open, setOpen] = useState(true);
  if (!open) return null;

  return (
    <Toast
      seconds={12}
      onClose={() => setOpen(false)}
      message={
        <>
          המחיר למחזור הקרוב הוא <span className="font-bold">{priceIls} ₪</span> בלבד, ומחיר הסמינר הרגיל הוא {regularPrice} ₪.{" "}
          <span className="font-bold">כדאי למהר</span>, המחיר נסגר כשהמחזור מתחיל.
        </>
      }
    />
  );
}
