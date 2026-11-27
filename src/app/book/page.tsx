import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingForm } from "@/components/book/BookingForm";
import { Breadcrumbs } from "@/components/layout/PageIntro";

export const metadata: Metadata = {
  title: "Request a visit",
  description: "Pick a time that suits you and Hushwell Dental will call within one business hour to confirm. It takes about two minutes.",
  alternates: { canonical: "/book" },
};

function FormSkeleton() {
  return (
    <div aria-hidden="true" className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="h-[40rem] rounded-pebble bg-white shadow-soft" />
      <div className="hidden h-[28rem] rounded-pebble bg-white shadow-soft lg:block" />
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="container-page pt-8 pb-20 lg:pt-12 lg:pb-28">
      <Breadcrumbs trail={[{ href: "/", label: "Home" }]} current="Request a visit" />
      <h1 className="mt-8 text-h1">Request a visit</h1>
      <p className="mt-4 max-w-[40rem] text-lead text-ink-soft">
        Pick a time that suits you. We&apos;ll call within one business hour to confirm. It takes about two minutes.
      </p>
      <div className="mt-10 lg:mt-12">
        <Suspense fallback={<FormSkeleton />}>
          <BookingForm />
        </Suspense>
      </div>
    </div>
  );
}
