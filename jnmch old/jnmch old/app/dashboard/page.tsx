import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect("/auth/login")
  
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  
  // Redirect based on role
  if (profile?.role === "patient") redirect("/patient")
  if (profile?.role === "admin") redirect("/admin")
  if (profile?.role === "doctor") redirect("/doctor")
  if (profile?.role === "lab_staff") redirect("/lab")
  
  redirect("/unauthorized")
}