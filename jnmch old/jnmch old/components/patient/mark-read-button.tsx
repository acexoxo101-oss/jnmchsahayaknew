"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { CheckCheck, Loader2 } from "lucide-react"
import { useState } from "react"

export function MarkAsReadButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleMarkAllRead = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", user.id)
        .eq("is_read", false)

      router.refresh()
    } catch (error) {
      console.error("Error marking notifications as read:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      className="gap-2 bg-transparent"
      onClick={handleMarkAllRead}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <CheckCheck className="w-4 h-4" />
      )}
      Mark All as Read
    </Button>
  )
}
