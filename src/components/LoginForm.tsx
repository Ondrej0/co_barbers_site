"use client";

import { createClient } from "@/utils/supabase/client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
    const supabase = createClient();
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            console.log(error.message);
        } else {
            console.log("Login successful");
            router.push("/dashboard");
        }

    }

    return (
        <div className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-semibold text-ink">
                    Email address
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    autoCapitalize="none"
                    spellCheck={false}
                    placeholder="you@example.com"
                    className="field"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-sm font-semibold text-ink">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="field"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button type="button" onClick={handleLogin} className="btn btn-primary w-full">
                Log in <span aria-hidden="true">↗</span>
            </button>
        </div>
    );
}
