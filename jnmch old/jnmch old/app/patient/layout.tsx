import React from "react"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PatientSidebar } from "@/components/patient/sidebar"

export default async function PatientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
    return
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (error || !profile) {
    redirect("/auth/login")
    return
  }

  // Only block non-patients
  if (profile.role && profile.role !== "patient") {
    // send them to their real section, not dashboard
    if (profile.role === "admin") {
      redirect("/admin")
      return
    }
    
    if (profile.role === "doctor") {
      redirect("/doctor")
      return
    }
    
    if (profile.role === "lab_staff") {
      redirect("/lab")
      return
    }

    redirect("/unauthorized")
    return
  }

  return (
    <div className="min-h-screen flex bg-background">
      <PatientSidebar profile={profile} />
      <main className="flex-1 w-full overflow-auto">
        {children}
      </main>
    </div>
  )
}