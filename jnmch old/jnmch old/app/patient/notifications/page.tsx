import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, FileText, CheckCircle, Info, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { MarkAsReadButton } from "@/components/patient/mark-read-button"

export default async function PatientNotificationsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get all notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select(`
      *,
      related_report:test_reports(id, test_name, report_number)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "report":
        return <FileText className="w-5 h-5 text-blue-600" />
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Info className="w-5 h-5 text-primary" />
    }
  }

  const formatDate = (date: string) => {
    const d = new Date(date)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60))
        return minutes <= 1 ? "Just now" : `${minutes} minutes ago`
      }
      return hours === 1 ? "1 hour ago" : `${hours} hours ago`
    }
    if (days === 1) return "Yesterday"
    if (days < 7) return `${days} days ago`
    
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated on your test reports and alerts
          </p>
        </div>
        {unreadCount > 0 && (
          <MarkAsReadButton />
        )}
      </div>

      {/* Notifications List */}
      <Card className="bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Bell className="w-5 h-5" />
                All Notifications
              </CardTitle>
              <CardDescription>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex items-start gap-4 p-4 rounded-lg transition-colors ${
                    notification.is_read 
                      ? "bg-secondary/30" 
                      : "bg-primary/5 border-l-4 border-l-primary"
                  }`}
                >
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className={`font-medium ${notification.is_read ? "text-foreground" : "text-foreground"}`}>
                          {notification.title}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        {notification.related_report && (
                          <Link 
                            href={`/patient/reports/${notification.related_report.id}`}
                            className="inline-block mt-2"
                          >
                            <Button size="sm" variant="outline" className="h-7 text-xs bg-transparent">
                              View Report
                            </Button>
                          </Link>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDate(notification.created_at)}
                        </span>
                        {!notification.is_read && (
                          <Badge className="bg-primary/10 text-primary border-0 text-xs">New</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Bell className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Notifications</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                You don&apos;t have any notifications yet. We&apos;ll notify you when 
                your test reports are ready.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
