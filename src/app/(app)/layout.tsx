import { AppShell } from "@/components/layout/app-shell";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/");
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase.from("users").select("id").eq("id", user.id).maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  return <AppShell>{children}</AppShell>;
}
