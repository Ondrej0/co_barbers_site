"use client";

import type { Tables } from "@/types/database.types";
import { type FormEvent, useEffect, useRef, useState } from "react";

type BookingStepsProps = {
  services: Tables<"services">[];
  barbers: Tables<"barbers">[];
  availability: Tables<"availability">[];
};

function timeToMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(totalMinutes: number) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

type BookingStep = 1 | 2 | 3 | 4;

type BookedAppointment = {
  start_time: string;
  services: {
    duration_mins: number;
  } | null;
};

type BookingConfirmation = {
  id: string;
};

export function BookingSteps({
  services,
  barbers,
  availability,
}: BookingStepsProps) {
  const [step, setStep] = useState<BookingStep>(1);
  const [booking, setBooking] = useState({
    serviceId: "",
    barberId: "",
    appointmentDate: "",
    startTime: "",
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    notes: "",
  });

  const [bookedAppointments, setBookedAppointments] = useState<
    BookedAppointment[]
  >([]);
  const [isLoadingTimes, setIsLoadingTimes] = useState(false);
  const [timesError, setTimesError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState("");
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(
    null,
  );

  const today = new Date();
  const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const steps: Array<{
    number: BookingStep;
    label: string;
  }> = [
    { number: 1, label: "Service" },
    { number: 2, label: "Barber" },
    { number: 3, label: "Date & Time" },
    { number: 4, label: "Details" },
  ];

  const selectedDate = booking.appointmentDate
    ? new Date(`${booking.appointmentDate}T00:00:00`)
    : null;

  const availabilityForDate = selectedDate
    ? availability.filter(
        (entry) =>
          entry.barber_id === booking.barberId &&
          entry.day_of_week === selectedDate.getDay(),
      )
    : [];

  const selectedService = services.find(
    (service) => service.id === booking.serviceId,
  );

  const timeSlots = selectedService
    ? availabilityForDate.flatMap((period) => {
        const slots: string[] = [];
        const start = timeToMinutes(period.start_time);
        const end = timeToMinutes(period.end_time);

        for (
          let time = start;
          time + selectedService.duration_mins <= end;
          time += 30
        ) {
          slots.push(formatTime(time));
        }

        return slots;
      })
    : [];

  const availableTimeSlots = timeSlots.filter((time) => {
    if (!selectedService) {
      return false;
    }

    const requestedStart = timeToMinutes(time);
    const requestedEnd = requestedStart + selectedService.duration_mins;

    const overlapsExistingAppointment = bookedAppointments.some(
      (appointment) => {
        const bookedDuration = appointment.services?.duration_mins;

        if (!bookedDuration) {
          return false;
        }

        const bookedStart = timeToMinutes(appointment.start_time);
        const bookedEnd = bookedStart + bookedDuration;

        return requestedStart < bookedEnd && requestedEnd > bookedStart;
      },
    );

    return !overlapsExistingAppointment;
  });

  useEffect(() => {
    if (!booking.barberId || !booking.appointmentDate) {
      return;
    }

    let cancelled = false;

    async function loadBookedAppointments() {
      setIsLoadingTimes(true);
      setTimesError("");

      try {
        const params = new URLSearchParams({
          barberId: booking.barberId,
          date: booking.appointmentDate,
        });

        const response = await fetch(`/api/booked-times?${params}`);

        if (!response.ok) {
          throw new Error("Could not load booked appointments");
        }

        const result = (await response.json()) as {
          appointments: BookedAppointment[];
        };

        if (!cancelled) {
          setBookedAppointments(result.appointments);
        }
      } catch {
        if (!cancelled) {
          setTimesError("We could not load available times. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingTimes(false);
        }
      }
    }

    void loadBookedAppointments();

    return () => {
      cancelled = true;
    };
  }, [booking.barberId, booking.appointmentDate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const result = (await response.json()) as {
        appointment?: BookingConfirmation;
        error?: string;
      };

      if (!response.ok || !result.appointment) {
        throw new Error(result.error ?? "We could not create your booking.");
      }

      setConfirmation(result.appointment);
    } catch (error) {
      setSubmissionError(
        error instanceof Error
          ? error.message
          : "We could not create your booking.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Focus follows the visible step; selection and appointment logic above is unchanged.
  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousStep = useRef(step);
  useEffect(() => {
    if (previousStep.current !== step || confirmation) {
      headingRef.current?.focus();
      previousStep.current = step;
    }
  }, [step, confirmation]);

  const selectedBarber = barbers.find(
    (barber) => barber.id === booking.barberId,
  );
  const displayDate = selectedDate?.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const displayPrice = selectedService
    ? (selectedService.price_pence / 100).toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
      })
    : "";
  const stepTitles = {
    1: "Choose your service",
    2: "Choose your barber",
    3: "Find your time",
    4: "The final details",
  };

  if (confirmation) {
    return (
      <div className="booking-panel mx-auto mt-10 max-w-4xl border-brass p-7 sm:p-10">
        <span
          aria-hidden="true"
          className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-ink text-2xl text-brass"
        >
          ✓
        </span>
        <p className="eyebrow text-[#795b37]">See you in the chair</p>
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="section-title mt-4 focus:outline-none"
        >
          Your booking is confirmed.
        </h2>
        <p className="mt-5 text-base leading-7 text-neutral-600">
          {booking.customerName}, we have booked you for {displayDate} at{" "}
          {booking.startTime}.
        </p>
        <dl className="mt-7 grid gap-5 rounded-lg bg-background p-5 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-neutral-500">Service</dt>
            <dd className="mt-2 font-semibold">{selectedService?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Barber</dt>
            <dd className="mt-2 font-semibold">{selectedBarber?.name}</dd>
          </div>
          <div>
            <dt className="text-sm text-neutral-500">Price</dt>
            <dd className="mt-2 font-semibold">{displayPrice}</dd>
          </div>
        </dl>
        <p className="mt-6 break-all text-sm leading-6 text-neutral-500">
          Booking reference: {confirmation.id}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-4xl">
      <nav
        aria-label="Booking progress"
        className="grid grid-cols-4 overflow-hidden rounded-xl border border-ink/15 bg-white"
      >
        {steps.map((bookingStep) => (
          <button
            type="button"
            key={bookingStep.number}
            onClick={() => setStep(bookingStep.number)}
            disabled={bookingStep.number > step}
            aria-current={step === bookingStep.number ? "step" : undefined}
            className={`min-h-20 px-1.5 py-4 text-xs font-semibold transition focus-visible:outline-offset-[-4px] sm:px-3 sm:text-sm ${step === bookingStep.number ? "bg-ink text-white" : "text-neutral-600 enabled:hover:bg-background"}`}
          >
            <span
              className={`mb-2 block text-xs ${step === bookingStep.number ? "text-brass" : "text-[#795b37]"}`}
            >
              {bookingStep.number < step ? "✓" : `0${bookingStep.number}`}
            </span>
            {bookingStep.label}
          </button>
        ))}
      </nav>
      <div className="mb-6 mt-8 flex items-center justify-between gap-3">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-serif text-2xl tracking-tight focus:outline-none sm:text-3xl"
        >
          {stepTitles[step]}
        </h2>
        <p
          aria-live="polite"
          className="shrink-0 text-xs text-neutral-500 sm:text-sm"
        >
          Step {step} of 4
        </p>
      </div>
      {step === 1 && (
        <div className="booking-panel" key="service">
          <div
            className="grid gap-3 sm:grid-cols-2"
            role="group"
            aria-label="Choose a service"
          >
            {services.map((service) => (
              <button
                type="button"
                key={service.id}
                aria-pressed={booking.serviceId === service.id}
                onClick={() =>
                  setBooking((current) => ({
                    ...current,
                    serviceId: service.id,
                    barberId: "",
                    appointmentDate: "",
                    startTime: "",
                  }))
                }
                className={`choice ${booking.serviceId === service.id ? "choice-selected" : "choice-idle"}`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="font-semibold">{service.name}</span>
                  <span className="shrink-0" aria-hidden="true">
                    {booking.serviceId === service.id ? "✓" : "+"}
                  </span>
                </span>
                <span className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs opacity-75">
                    {service.duration_mins} minutes
                  </span>
                  <span className="font-semibold">
                    {(service.price_pence / 100).toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP",
                    })}
                  </span>
                </span>
              </button>
            ))}
          </div>
          {services.length === 0 && (
            <p className="notice">
              There are no services available to book right now. Please check
              back soon.
            </p>
          )}
          <div className="mt-6 flex justify-end border-t border-ink/10 pt-6">
            <button
              type="button"
              disabled={!booking.serviceId}
              onClick={() => setStep(2)}
              className="btn btn-primary w-full sm:w-auto"
            >
              Choose a barber <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="booking-panel" key="barber">
          <p className="mb-5 text-sm leading-6 text-neutral-600">
            {selectedService?.name}{" "}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>{" "}
            {selectedService?.duration_mins} minutes{" "}
            <span className="mx-2" aria-hidden="true">
              ·
            </span>{" "}
            {displayPrice}
          </p>
          <div
            className="grid gap-3 sm:grid-cols-2"
            role="group"
            aria-label="Choose a barber"
          >
            {barbers.map((barber) => (
              <button
                type="button"
                key={barber.id}
                aria-pressed={booking.barberId === barber.id}
                onClick={() =>
                  setBooking((current) => ({
                    ...current,
                    barberId: barber.id,
                    appointmentDate: "",
                    startTime: "",
                  }))
                }
                className={`choice ${booking.barberId === barber.id ? "choice-selected" : "choice-idle"}`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-base font-semibold">{barber.name}</span>
                  <span aria-hidden="true">
                    {booking.barberId === barber.id ? "✓" : "+"}
                  </span>
                </span>
                <span className="mt-2 block text-sm opacity-75">
                  {barber.role}
                </span>
              </button>
            ))}
          </div>
          {barbers.length === 0 && (
            <p className="notice">
              There are no barbers available to book right now. Please check
              back soon.
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-ink/10 pt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="button"
              disabled={!booking.barberId}
              onClick={() => setStep(3)}
              className="btn btn-primary"
            >
              Choose a time <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="booking-panel" key="time">
          <p className="mb-6 text-sm leading-6 text-neutral-600">
            {selectedService?.name} with {selectedBarber?.name}
          </p>
          <label className="block max-w-sm">
            <span className="text-sm font-semibold">Choose a date</span>
            <input
              className="field"
              type="date"
              min={minimumDate}
              value={booking.appointmentDate}
              onChange={(event) =>
                setBooking((current) => ({
                  ...current,
                  appointmentDate: event.target.value,
                  startTime: "",
                }))
              }
            />
          </label>
          <div aria-live="polite" aria-busy={isLoadingTimes} className="mt-6">
            {!booking.appointmentDate && (
              <p className="notice">
                Select a date to see available appointment times.
              </p>
            )}
            {booking.appointmentDate && availabilityForDate.length === 0 && (
              <p className="notice">
                No appointments are available for this barber on that date.
                Please choose another date.
              </p>
            )}
            {booking.appointmentDate && availabilityForDate.length > 0 && (
              <div>
                <p className="text-sm font-semibold">Choose a time</p>
                {isLoadingTimes ? (
                  <p className="notice mt-3">Checking availability…</p>
                ) : timesError ? (
                  <p className="error-notice mt-3" role="alert">
                    {timesError}
                  </p>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="notice mt-3">
                    No times are available on this date. Please choose another
                    date.
                  </p>
                ) : (
                  <div
                    className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6"
                    role="group"
                    aria-label="Available times"
                  >
                    {availableTimeSlots.map((time) => (
                      <button
                        type="button"
                        key={time}
                        aria-pressed={booking.startTime === time}
                        onClick={() =>
                          setBooking((current) => ({
                            ...current,
                            startTime: time,
                          }))
                        }
                        className={`choice text-center tabular-nums ${booking.startTime === time ? "choice-selected" : "choice-idle"}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-ink/10 pt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="button"
              disabled={
                !booking.startTime || isLoadingTimes || Boolean(timesError)
              }
              onClick={() => setStep(4)}
              className="btn btn-primary"
            >
              Your details <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <form
          className="booking-panel"
          onSubmit={handleSubmit}
          key="details"
          aria-busy={isSubmitting}
        >
          <div className="mb-7 rounded-lg border border-ink/10 bg-background p-5">
            <h3 className="eyebrow text-[#795b37]">Your appointment</h3>
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-neutral-500">Service & barber</dt>
                <dd className="mt-1 font-semibold leading-6">
                  {selectedService?.name} with {selectedBarber?.name}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Date & time</dt>
                <dd className="mt-1 font-semibold leading-6">
                  {displayDate} at {booking.startTime}
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Duration</dt>
                <dd className="mt-1 font-semibold">
                  {selectedService?.duration_mins} minutes
                </dd>
              </div>
              <div>
                <dt className="text-neutral-500">Price</dt>
                <dd className="mt-1 font-semibold">{displayPrice}</dd>
              </div>
            </dl>
          </div>
          <p className="mb-5 text-sm text-neutral-600">
            All fields are required unless marked optional.
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold">Name</span>
              <input
                required
                minLength={2}
                autoComplete="name"
                placeholder="Your full name"
                value={booking.customerName}
                onChange={(event) =>
                  setBooking((current) => ({
                    ...current,
                    customerName: event.target.value,
                  }))
                }
                className="field"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Email</span>
              <input
                required
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={booking.customerEmail}
                onChange={(event) =>
                  setBooking((current) => ({
                    ...current,
                    customerEmail: event.target.value,
                  }))
                }
                className="field"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Phone</span>
              <input
                required
                type="tel"
                autoComplete="tel"
                placeholder="Your phone number"
                value={booking.customerPhone}
                onChange={(event) =>
                  setBooking((current) => ({
                    ...current,
                    customerPhone: event.target.value,
                  }))
                }
                className="field"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-sm font-semibold">Notes (optional)</span>
              <textarea
                placeholder="Anything you'd like your barber to know?"
                value={booking.notes}
                onChange={(event) =>
                  setBooking((current) => ({
                    ...current,
                    notes: event.target.value,
                  }))
                }
                className="field min-h-28 resize-y"
              />
            </label>
          </div>
          {submissionError && (
            <p className="error-notice mt-5" role="alert">
              {submissionError}
            </p>
          )}
          <div className="mt-6 flex flex-wrap justify-between gap-3 border-t border-ink/10 pt-6">
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={isSubmitting}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
            >
              {isSubmitting ? "Booking…" : "Confirm booking"}
              <span aria-hidden="true">{isSubmitting ? "" : "↗"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
