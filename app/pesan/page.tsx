import { Suspense } from "react";
import type { Metadata } from "next";
import BookingForm from "@/components/pesan/booking-form";

export const metadata: Metadata = {
  title: "Pesan Layanan — Beres",
  description: "Pesan jasa rumah tangga dalam 4 langkah mudah.",
};

export default function PesanPage() {
  // Suspense diperlukan karena BookingForm memakai useSearchParams.
  return (
    <Suspense>
      <BookingForm />
    </Suspense>
  );
}
