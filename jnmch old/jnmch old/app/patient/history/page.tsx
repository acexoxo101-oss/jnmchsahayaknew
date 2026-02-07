import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { History, FileText, Eye, Download, LogIn } from "lucide-react"

export default async function PatientHistoryPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // For now, we'll show a placeholder since activity logs require admin access
  // In a real implementation, you'd track patient-specific activities

  const getActionIcon = (action: string) => {
    switch (action) {
      case "view_report":
        return <Eye className="w-4 h-4 text-blue-600" />
      case "download_report":
        return <Download className="w-4 h-4 text-green-600" />
      case "login":
        return <LogIn className="w-4 h-4 text-primary" />
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />
    }
  }

  // Mock activity data for demonstration
  const activities = [
    {
      id: 1,
      action: "login",
      description: "Logged into JNMC Sahayak",
      timestamp: new Date().toISOString(),
    },
  ]

  const formatDate = (date: string) => {
    return new Date(date).toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Activity History</h1>
        <p className="text-muted-foreground mt-1">
          Track your recent activities and access history
        </p>
      </div>

      {/* Activity List */}
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Your recent actions and report access history
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-4 p-4 bg-secondary/30 rounded-lg"
                >
                  <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(activity.timestamp)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-1">No Activity Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Your activity history will appear here as you use the platform.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
