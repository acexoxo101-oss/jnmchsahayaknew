import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  FileText, 
  Download, 
  ArrowLeft, 
  Calendar, 
  Building, 
  User, 
  FlaskConical,
  CheckCircle,
  Clock,
  XCircle,
  Printer
} from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ReportViewerPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/auth/login")
  }

  // Get report details
  const { data: report, error } = await supabase
    .from("test_reports")
    .select(`
      *,
      uploaded_by_profile:profiles!test_reports_uploaded_by_fkey(full_name),
      verified_by_profile:profiles!test_reports_verified_by_fkey(full_name)
    `)
    .eq("id", id)
    .eq("patient_id", user.id)
    .single()

  if (error || !report) {
    notFound()
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "verified":
        return {
          badge: <Badge className="bg-green-100 text-green-800 border-0">Verified</Badge>,
          icon: <CheckCircle className="w-5 h-5 text-green-600" />,
          text: "This report has been verified by authorized staff."
        }
      case "uploaded":
        return {
          badge: <Badge className="bg-blue-100 text-blue-800 border-0">Available</Badge>,
          icon: <Clock className="w-5 h-5 text-blue-600" />,
          text: "This report is available and awaiting verification."
        }
      case "pending":
        return {
          badge: <Badge className="bg-yellow-100 text-yellow-800 border-0">Pending</Badge>,
          icon: <Clock className="w-5 h-5 text-yellow-600" />,
          text: "This report is being processed and will be available soon."
        }
      case "rejected":
        return {
          badge: <Badge className="bg-red-100 text-red-800 border-0">Rejected</Badge>,
          icon: <XCircle className="w-5 h-5 text-red-600" />,
          text: "This report has been rejected. Please contact the lab."
        }
      default:
        return {
          badge: <Badge variant="secondary">{status}</Badge>,
          icon: <Clock className="w-5 h-5 text-muted-foreground" />,
          text: "Status unknown"
        }
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

  const formatDate = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatDateTime = (date: string | null) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const statusInfo = getStatusInfo(report.status)

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Back Button */}
      <Link href="/patient/reports">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Reports
        </Button>
      </Link>

      {/* Report Header */}
      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
            <FileText className="w-7 h-7 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
              {report.test_name}
            </h1>
            <p className="text-muted-foreground mt-1">
              Report #{report.report_number}
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              {getCategoryBadge(report.test_category)}
              {statusInfo.badge}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {report.file_url && (
            <>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Printer className="w-4 h-4" />
                Print
              </Button>
              <Button className="gap-2">
                <Download className="w-4 h-4" />
                Download PDF
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Status Banner */}
      <Card className={`border-l-4 ${
        report.status === "verified" ? "border-l-green-500" :
        report.status === "uploaded" ? "border-l-blue-500" :
        report.status === "pending" ? "border-l-yellow-500" :
        "border-l-red-500"
      }`}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {statusInfo.icon}
            <p className="text-foreground">{statusInfo.text}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Report Details */}
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Report Details</CardTitle>
            <CardDescription>Complete information about this test report</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="w-4 h-4" />
                  Report Date
                </div>
                <p className="font-medium text-foreground">{formatDate(report.report_date)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Building className="w-4 h-4" />
                  Department
                </div>
                <p className="font-medium text-foreground">{report.department}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <FlaskConical className="w-4 h-4" />
                  Sample Collected
                </div>
                <p className="font-medium text-foreground">
                  {formatDateTime(report.sample_collected_at)}
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <User className="w-4 h-4" />
                  Referring Doctor
                </div>
                <p className="font-medium text-foreground">
                  {report.doctor_name || "N/A"}
                </p>
              </div>
            </div>

            <Separator />

            {report.notes && (
              <div className="space-y-2">
                <h4 className="font-medium text-foreground">Notes</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {report.notes}
                </p>
              </div>
            )}

            {/* Report Preview Placeholder */}
            {report.file_url ? (
              <div className="border rounded-lg bg-secondary/30 aspect-[8.5/11] flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Report preview available
                  </p>
                  <Button className="mt-4 gap-2">
                    <Download className="w-4 h-4" />
                    Download to View
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border rounded-lg bg-secondary/30 aspect-[8.5/11] flex items-center justify-center">
                <div className="text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Report file not yet available
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Please check back later
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* Processing Info */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="text-card-foreground text-base">Processing Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Uploaded By</p>
                <p className="font-medium text-foreground">
                  {report.uploaded_by_profile?.full_name || "Lab Staff"}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Technician</p>
                <p className="font-medium text-foreground">
                  {report.technician_name || "N/A"}
                </p>
              </div>
              {report.verified_by && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Verified By</p>
                  <p className="font-medium text-foreground">
                    {report.verified_by_profile?.full_name || "Staff"}
                  </p>
                </div>
              )}
              {report.verified_at && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Verified On</p>
                  <p className="font-medium text-foreground">
                    {formatDateTime(report.verified_at)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Info */}
          {report.file_url && (
            <Card className="bg-card">
              <CardHeader>
                <CardTitle className="text-card-foreground text-base">File Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">File Name</p>
                  <p className="font-medium text-foreground truncate">
                    {report.file_name || "report.pdf"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">File Type</p>
                  <p className="font-medium text-foreground">
                    {report.file_type || "PDF"}
                  </p>
                </div>
                {report.file_size && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">File Size</p>
                    <p className="font-medium text-foreground">
                      {(report.file_size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
