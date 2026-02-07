'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, FileText, Upload, Loader2 } from 'lucide-react'

interface SummaryData {
  totalUsers: number
  totalReports: number
  totalUploads: number
}

export function SummaryCards() {
  const [data, setData] = useState<SummaryData>({
    totalUsers: 0,
    totalReports: 0,
    totalUploads: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchSummary() {
      try {
        // Fetch total users
        const { count: usersCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true })

        // Fetch total reports
        const { count: reportsCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })

        // Fetch total uploads (reports with status 'uploaded' or 'verified')
        const { count: uploadsCount } = await supabase
          .from('reports')
          .select('*', { count: 'exact', head: true })
          .in('status', ['uploaded', 'verified'])

        setData({
          totalUsers: usersCount || 0,
          totalReports: reportsCount || 0,
          totalUploads: uploadsCount || 0,
        })
      } catch (error) {
        console.error('Error fetching summary:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [supabase])

  const cards = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: Users,
      bgColor: 'bg-primary',
      textColor: 'text-primary-foreground',
    },
    {
      title: 'Total Reports',
      value: data.totalReports,
      icon: FileText,
      bgColor: 'bg-secondary',
      textColor: 'text-secondary-foreground',
    },
    {
      title: 'Total Uploads',
      value: data.totalUploads,
      icon: Upload,
      bgColor: 'bg-accent',
      textColor: 'text-accent-foreground',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <Card key={card.title} className={`${card.bgColor} border-0`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className={`text-sm font-medium ${card.textColor}`}>
              {card.title}
            </CardTitle>
            <card.icon className={`h-5 w-5 ${card.textColor} opacity-80`} />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Loader2 className={`h-6 w-6 animate-spin ${card.textColor}`} />
            ) : (
              <p className={`text-3xl font-bold ${card.textColor}`}>
                {card.value.toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
