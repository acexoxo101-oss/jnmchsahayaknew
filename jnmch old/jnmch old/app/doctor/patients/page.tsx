import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, User, FileText, Phone, Eye } from "lucide-react"
import Link from "next/link"

export default async function DoctorPatientsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get all patients
  const { data: patients } = await supabase
    .from("profiles")
    .select(`
      *,
      reports:test_reports(count)
    `)
    .eq("role", "patient")
    .order("created_at", { ascending: false })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Search Patients</h1>
        <p className="text-muted-foreground mt-1">
          Find and view patient reports
        </p>
      </div>

      {/* Search */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, Aadhaar, JNMCH ID, or phone..."
                className="pl-10"
              />
            </div>
            <Button className="gap-2">
              <Search className="w-4 h-4" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Patients List */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">All Patients</CardTitle>
          <CardDescription>
            {patients?.length || 0} patients registered
          </CardDescription>
        </CardHeader>
        <CardContent>
          {patients && patients.length > 0 ? (
            <div className="space-y-4">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-secondary/50 rounded-lg gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground font-medium">
                        {getInitials(patient.full_name)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{patient.full_name}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                        {patient.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </span>
                        )}
                        {patient.jnmch_registration_id && (
                          <span>ID: {patient.jnmch_registration_id}</span>
                        )}
                        <span>Joined: {formatDate(patient.created_at)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-16 lg:ml-0">
                    <Badge variant="secondary" className="gap-1">
                      <FileText className="w-3 h-3" />
                      {patient.reports?.[0]?.count || 0} Reports
                    </Badge>
                    <Link href={`/doctor/patients/${patient.id}`}>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Eye className="w-4 h-4" />
                        View Reports
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Patients Found</h3>
              <p className="text-muted-foreground">
                No registered patients in the system yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
