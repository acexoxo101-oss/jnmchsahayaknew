import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { FileText, ArrowLeft, Phone, Mail, Calendar, Eye, Download } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function DoctorPatientViewPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  // Get patient profile
  const { data: patient, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "patient")
    .single()

  if (error || !patient) {
    notFound()
  }

  // Get patient's reports
  const { data: reports } = await supabase
    .from("test_reports")
    .select("*")
    .eq("patient_id", id)
    .order("created_at", { ascending: false })

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
      {/* Back Button */}
      <Link href="/doctor/patients">
        <Button variant="ghost" className="gap-2 -ml-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Patients
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Patient Info Card */}
        <Card className="bg-card">
          <CardContent className="p-6">
            <div className="text-center">
              <Avatar className="h-20 w-20 mx-auto mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-xl">
                  {getInitials(patient.full_name)}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold text-card-foreground">
                {patient.full_name}
              </h2>
              <p className="text-muted-foreground">Patient</p>
            </div>

            <Separator className="my-6" />

            <div className="space-y-4">
              {patient.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{patient.phone}</span>
                </div>
              )}
              {patient.jnmch_registration_id && (
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">ID: {patient.jnmch_registration_id}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">
                  Joined: {formatDate(patient.created_at)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <Card className="lg:col-span-2 bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Patient Reports</CardTitle>
            <CardDescription>
              {reports?.length || 0} reports for this patient
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
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{report.test_name}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span>{report.department}</span>
                          <span>&bull;</span>
                          <span>{formatDate(report.report_date)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {getCategoryBadge(report.test_category)}
                          {getStatusBadge(report.status)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-14 lg:ml-0">
                      <Link href={`/doctor/reports/${report.id}`}>
                        <Button size="sm" variant="outline" className="gap-2 bg-transparent">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                      </Link>
                      {report.file_url && (
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
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-1">No Reports</h3>
                <p className="text-muted-foreground">
                  This patient doesn&apos;t have any test reports yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
