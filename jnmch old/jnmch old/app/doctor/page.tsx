import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Users, Search, Eye, Clock } from "lucide-react"
import Link from "next/link"

export default async function DoctorDashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  // Get recent reports (doctors can view all reports)
  const { data: recentReports } = await supabase
    .from("test_reports")
    .select(`
      *,
      patient:profiles!test_reports_patient_id_fkey(id, full_name, phone)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  // Get stats
  const { count: totalPatients } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .eq("role", "patient")

  const { count: totalReports } = await supabase
    .from("test_reports")
    .select("*", { count: "exact", head: true })

  const { count: todayReports } = await supabase
    .from("test_reports")
    .select("*", { count: "exact", head: true })
    .gte("created_at", new Date().toISOString().split("T")[0])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-0">Verified</Badge>
      case "uploaded":
        return <Badge className="bg-blue-100 text-blue-800 border-0">Available</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
          Welcome, Dr. {profile?.full_name || "Doctor"}
        </h1>
        <p className="text-muted-foreground mt-1">
          Access patient reports and manage your cases
        </p>
      </div>

      {/* Quick Search */}
      <Card className="bg-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search patients by name, Aadhaar, or JNMCH ID..."
                className="pl-12 h-12 text-lg"
              />
            </div>
            <Link href="/doctor/patients">
              <Button size="lg" className="gap-2 w-full md:w-auto">
                <Search className="w-5 h-5" />
                Advanced Search
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Patients</p>
                <p className="text-2xl font-bold text-card-foreground">{totalPatients || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Reports</p>
                <p className="text-2xl font-bold text-card-foreground">{totalReports || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Today&apos;s Reports</p>
                <p className="text-2xl font-bold text-card-foreground">{todayReports || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card className="bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-card-foreground">Recent Reports</CardTitle>
            <CardDescription>Latest test reports across all patients</CardDescription>
          </div>
          <Link href="/doctor/reports">
            <Button variant="outline" size="sm">View All</Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentReports && recentReports.length > 0 ? (
            <div className="space-y-4">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-secondary/50 rounded-lg gap-4"
                >
                  <div className="flex items-start lg:items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{report.test_name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span className="font-medium">{report.patient?.full_name || "Unknown Patient"}</span>
                        <span>&bull;</span>
                        <span>{report.department}</span>
                        <span>&bull;</span>
                        <span>{formatDate(report.report_date)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-14 lg:ml-0">
                    {getStatusBadge(report.status)}
                    <Link href={`/doctor/reports/${report.id}`}>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Reports Yet</h3>
              <p className="text-muted-foreground">
                Recent patient reports will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
