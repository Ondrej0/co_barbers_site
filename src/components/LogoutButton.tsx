"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const supabase = createClient();
    const router = useRouter();

    const handleLogout = async () => {
        await supabase.auth.signOut();

        router.push("/login");
    };

    return (
        <button type="button" onClick={handleLogout} className="btn btn-secondary w-full shrink-0 sm:w-auto">
            Log out <span aria-hidden="true">↗</span>
        </button>
    );
}
