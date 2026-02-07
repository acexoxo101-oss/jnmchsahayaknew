'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { SummaryCards } from '@/components/admin/summary-cards'
import { ActivityLogs } from '@/components/admin/activity-logs'
import { Button } from '@/components/ui/button'
import { LogOut, Shield, Loader2 } from 'lucide-react'

export default function AdminPage() {
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)
  const [userName, setUserName] = useState('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkAccess() {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        router.push('/login')
        return
      }

      // Check if user has admin role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', user.id)
        .single()

      if (profileError || profile?.role !== 'admin') {
        router.push('/unauthorized')
        return
      }

      setUserName(profile.full_name || user.email || 'Administrator')
      setAuthorized(true)
      setLoading(false)

      // Log admin access
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        user_role: 'admin',
        action: 'Accessed admin dashboard',
      })
    }

    checkAccess()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-4 text-muted-foreground">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary-foreground" />
              <div>
                <h1 className="text-xl font-semibold text-primary-foreground">
                  JNMC Sahayak
                </h1>
                <p className="text-sm text-primary-foreground/70">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground/90 text-sm">
                Welcome, {userName}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Summary Cards */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              System Overview
            </h2>
            <SummaryCards />
          </section>

          {/* Activity Logs */}
          <section>
            <ActivityLogs />
          </section>
        </div>
      </main>
    </div>
  )
}
