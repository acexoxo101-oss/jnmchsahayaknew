import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FileText, Search, Eye, Download, AlertCircle, Filter } from "lucide-react"
import Link from "next/link"

export default async function PatientReportsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get all reports for patient
  const { data: reports } = await supabase
    .from("test_reports")
    .select("*")
    .eq("patient_id", user.id)
    .order("created_at", { ascending: false })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 border-0">Verified</Badge>
      case "uploaded":
        return <Badge className="bg-blue-100 text-blue-800 border-0">Available</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 border-0">Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      pathology: "bg-purple-100 text-purple-800",
      radiology: "bg-orange-100 text-orange-800",
      cardiology: "bg-red-100 text-red-800",
      microbiology: "bg-teal-100 text-teal-800",
      biochemistry: "bg-indigo-100 text-indigo-800",
      other: "bg-gray-100 text-gray-800",
    }
    return (
      <Badge className={`${colors[category] || colors.other} border-0`}>
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </Badge>
    )
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Reports</h1>
          <p className="text-muted-foreground mt-1">
            View and download your diagnostic test reports
          </p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search reports by name, department..."
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">All Reports</CardTitle>
          <CardDescription>
            {reports?.length || 0} reports found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 bg-secondary/50 rounded-lg gap-4"
                >
                  <div className="flex items-start lg:items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{report.test_name}</p>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <span>{report.department}</span>
                        <span>&bull;</span>
                        <span>Report #{report.report_number}</span>
                        <span>&bull;</span>
                        <span>{formatDate(report.report_date)}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {getCategoryBadge(report.test_category)}
                        {getStatusBadge(report.status)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-16 lg:ml-0">
                    <Link href={`/patient/reports/${report.id}`}>
                      <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                    {report.status === "verified" && report.file_url && (
                      <Button size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Reports Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your test reports will appear here once they are uploaded by the lab staff.
                Check back later or contact the hospital if you expect a report.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
