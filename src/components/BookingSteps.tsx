"use client"

import type { Tables } from "@/types/database.types";
import { type FormEvent, useEffect, useState } from "react";

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

export function BookingSteps({ services, barbers, availability }: BookingStepsProps) {
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
    const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

    const today = new Date();
    const minimumDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    const steps:Array<{
        number: BookingStep;
        label: string;
    }> = [
        {number: 1, label: "Service"},
        {number: 2, label: "Barber"},
        {number: 3, label: "Date & Time"},
        {number: 4, label: "Details"},
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

        const overlapsExistingAppointment = bookedAppointments.some((appointment) => {
            const bookedDuration = appointment.services?.duration_mins;

            if (!bookedDuration) {
                return false;
            }

            const bookedStart = timeToMinutes(appointment.start_time);
            const bookedEnd = bookedStart + bookedDuration;

            return requestedStart < bookedEnd && requestedEnd > bookedStart;
        });

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

                const result = await response.json() as {
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
            const result = await response.json() as {
                appointment?: BookingConfirmation;
                error?: string;
            };

            if (!response.ok || !result.appointment) {
                throw new Error(result.error ?? "We could not create your booking.");
            }

            setConfirmation(result.appointment);
        } catch (error) {
            setSubmissionError(
                error instanceof Error ? error.message : "We could not create your booking.",
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    if (confirmation) {
        return (
            <div className="mx-auto mt-12 max-w-4xl px-6 text-neutral-950">
                <h2 className="text-2xl font-bold tracking-tight">Your booking is confirmed</h2>
                <p className="mt-3 text-neutral-600">
                    {booking.customerName}, we have booked you for {booking.appointmentDate} at {booking.startTime}.
                </p>
                <p className="mt-2 text-sm text-neutral-500">
                    Booking reference: {confirmation.id}
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="mx-auto mt-12 max-w-4xl px-6">
                <div className="grid grid-cols-4 border border-neutral-200">
                    {steps.map((bookingStep) => (
                        <button
                            type="button"
                            key={bookingStep.number}
                            onClick={() => setStep(bookingStep.number)}
                            disabled={bookingStep.number > step}
                            aria-current={step === bookingStep.number ? "step" : undefined}
                            className={`px-3 py-5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                                step === bookingStep.number
                                    ? "bg-neutral-950 text-white"
                                    : "bg-white text-neutral-500 hover:bg-neutral-100"
                            }`}
                        >
                        <span className="block text-xs opacity-60">
                            0{bookingStep.number}
                        </span>

                            <span className="mt-1 block">
                            {bookingStep.label}
                        </span>
                        </button>
                    ))}
                </div>

                <p className="mt-6 text-sm text-neutral-500">
                    Step {step} of 4
                </p>
            </div>
            {step === 1 && (
            <div className="mx-auto mt-8 max-w-4xl px-6">
                {services.map((service) => (
                    <button
                        type="button"
                        key={service.id}
                        onClick={() =>
                            setBooking((current) => ({
                                ...current,
                                serviceId: service.id,
                                barberId: "",
                                appointmentDate: "",
                                startTime: "",
                            }))
                        }
                        className={`mr-3 rounded border px-4 py-3 text-left transition ${
                            booking.serviceId === service.id
                                ? "border-neutral-950 bg-neutral-950 text-white"
                                : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-950"
                        }`}
                    >
                        {service.name}
                    </button>
                ))}
                <button
                    type="button"
                    disabled={!booking.serviceId}
                    onClick={() => setStep(2)}
                    className="mt-6 rounded bg-neutral-950 px-5 py-3 font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Next
                </button>
            </div>
            )}
            {step === 2 && (
                <div className="mx-auto mt-8 max-w-4xl px-6">
                    {barbers.map((barber) => (
                        <button
                            type="button"
                            key={barber.id}
                            onClick={() =>
                                setBooking((current) => ({
                                    ...current,
                                    barberId: barber.id,
                                    appointmentDate: "",
                                    startTime: "",
                                }))
                            }
                            className={`mr-3 rounded border px-4 py-3 text-left transition ${
                                booking.barberId === barber.id
                                    ? "border-neutral-950 bg-neutral-950 text-white"
                                    : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-950"
                            }`}
                        >
                            {barber.name}
                        </button>
                    ))}

                    <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="mt-6 rounded border border-neutral-200 px-5 py-3 font-semibold text-neutral-950 transition hover:border-neutral-950"
                    >
                        Back
                    </button>

                    <button
                        type="button"
                        disabled={!booking.barberId}
                        onClick={() => setStep(3)}
                        className="ml-3 mt-6 rounded bg-neutral-950 px-5 py-3 font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            )}
            {step === 3 && (
                <div className="mx-auto mt-8 max-w-4xl px-6">
                    <label className="block">
                        <span className="text-sm font-semibold">Choose a date</span>

                        <input
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

                    {booking.appointmentDate && availabilityForDate.length === 0 && (
                        <p>No appointments are available for this barber on that date.</p>
                    )}

                    {booking.appointmentDate && availabilityForDate.length > 0 && (
                        <div className="mt-6">
                            <p className="text-sm font-semibold text-neutral-950">
                                Choose a time
                            </p>

                            {isLoadingTimes ? (
                                <p className="mt-3 text-sm text-neutral-600">
                                    Checking availability...
                                </p>
                            ) : timesError ? (
                                <p className="mt-3 text-sm text-red-600" role="alert">
                                    {timesError}
                                </p>
                            ) : availableTimeSlots.length === 0 ? (
                                <p className="mt-3 text-sm text-neutral-600">
                                    No times are available on this date.
                                </p>
                            ) : (
                                <div className="mt-3 flex flex-wrap gap-3">
                                    {availableTimeSlots.map((time) => (
                                        <button
                                            type="button"
                                            key={time}
                                            onClick={() =>
                                                setBooking((current) => ({
                                                    ...current,
                                                    startTime: time,
                                                }))
                                            }
                                            className={`rounded border px-4 py-3 text-left transition ${
                                                booking.startTime === time
                                                    ? "border-neutral-950 bg-neutral-950 text-white"
                                                    : "border-neutral-200 bg-white text-neutral-950 hover:border-neutral-950"
                                            }`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <button type="button" onClick={() => setStep(2)}>
                        Back
                    </button>
                    <button
                        type="button"
                        disabled={!booking.startTime || isLoadingTimes || Boolean(timesError)}
                        onClick={() => setStep(4)}
                    >
                        Next
                    </button>
                </div>
            )}
            {step === 4 && (
                <form className="mx-auto mt-8 max-w-4xl px-6" onSubmit={handleSubmit}>
                    <div className="grid gap-5 sm:grid-cols-2">
                        <label className="block">
                            <span className="text-sm font-semibold text-neutral-950">Name</span>
                            <input required minLength={2} value={booking.customerName} onChange={(event) => setBooking((current) => ({ ...current, customerName: event.target.value }))} className="mt-2 w-full rounded border border-neutral-200 px-3 py-2" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-semibold text-neutral-950">Email</span>
                            <input required type="email" value={booking.customerEmail} onChange={(event) => setBooking((current) => ({ ...current, customerEmail: event.target.value }))} className="mt-2 w-full rounded border border-neutral-200 px-3 py-2" />
                        </label>
                        <label className="block">
                            <span className="text-sm font-semibold text-neutral-950">Phone</span>
                            <input required type="tel" value={booking.customerPhone} onChange={(event) => setBooking((current) => ({ ...current, customerPhone: event.target.value }))} className="mt-2 w-full rounded border border-neutral-200 px-3 py-2" />
                        </label>
                        <label className="block sm:col-span-2">
                            <span className="text-sm font-semibold text-neutral-950">Notes (optional)</span>
                            <textarea value={booking.notes} onChange={(event) => setBooking((current) => ({ ...current, notes: event.target.value }))} className="mt-2 min-h-28 w-full rounded border border-neutral-200 px-3 py-2" />
                        </label>
                    </div>

                    {submissionError && <p className="mt-4 text-sm text-red-600" role="alert">{submissionError}</p>}

                    <button type="button" onClick={() => setStep(3)} disabled={isSubmitting} className="mt-6 rounded border border-neutral-200 px-5 py-3 font-semibold text-neutral-950 transition hover:border-neutral-950 disabled:cursor-not-allowed disabled:opacity-50">
                        Back
                    </button>
                    <button type="submit" disabled={isSubmitting} className="ml-3 mt-6 rounded bg-neutral-950 px-5 py-3 font-semibold text-white transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-50">
                        {isSubmitting ? "Booking..." : "Confirm booking"}
                    </button>
                </form>
            )}
        </>
    );
}
