"use client"

import {useState} from "react";

type BookingStep = 1 | 2 | 3 | 4;

export function BookingSteps() {
    const [step, setStep] = useState<BookingStep>(1);

    const steps:Array<{
        number: BookingStep;
        label: string;
    }> = [
        {number: 1, label: "Service"},
        {number: 2, label: "Barber"},
        {number: 3, label: "Date & Time"},
        {number: 4, label: "Details"},
    ];

    return (
        <div className="mx-auto mt-12 max-w-4xl px-6">
            <div className="grid grid-cols-4 border border-neutral-200">
                {steps.map((bookingStep) => (
                    <button
                        key={bookingStep.number}
                        onClick={() => setStep(bookingStep.number)}
                        className={`px-3 py-5 text-sm font-semibold transition ${
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
    );
}