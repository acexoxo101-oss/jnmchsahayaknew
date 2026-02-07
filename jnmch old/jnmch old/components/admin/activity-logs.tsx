'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Activity, ChevronLeft, ChevronRight, Loader2, Filter } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

interface ActivityLog {
  id: string
  user_id: string
  user_role: string
  action: string
  created_at: string
}

const ROLES = ['all', 'admin', 'doctor', 'patient', 'lab_staff']
const PAGE_SIZE = 10

export function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [roleFilter, setRoleFilter] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const supabase = createClient()

  const fetchLogs = useCallback(async () => {
    setLoading(true)
    try {
      let query = supabase
        .from('activity_logs')
        .select('*', { count: 'exact' })

      // Apply role filter
      if (roleFilter !== 'all') {
        query = query.eq('user_role', roleFilter)
      }

      // Apply date filters
      if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00`)
      }
      if (endDate) {
        query = query.lte('created_at', `${endDate}T23:59:59`)
      }

      // Pagination
      const from = (currentPage - 1) * PAGE_SIZE
      const to = from + PAGE_SIZE - 1

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error) throw error

      setLogs(data || [])
      setTotalCount(count || 0)
    } catch (error) {
      console.error('Error fetching activity logs:', error)
    } finally {
      setLoading(false)
    }
  }, [supabase, roleFilter, startDate, endDate, currentPage])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const getRoleBadge = (role: string) => {
    const styles: Record<string, string> = {
      admin: 'bg-red-100 text-red-800 border-red-200',
      doctor: 'bg-blue-100 text-blue-800 border-blue-200',
      patient: 'bg-green-100 text-green-800 border-green-200',
      lab_staff: 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return (
      <Badge className={styles[role] || 'bg-gray-100 text-gray-800 border-gray-200'}>
        {role.replace('_', ' ')}
      </Badge>
    )
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  const handleClearFilters = () => {
    setRoleFilter('all')
    setStartDate('')
    setEndDate('')
    setCurrentPage(1)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="bg-primary rounded-t-lg">
        <CardTitle className="text-primary-foreground flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Activity Logs
        </CardTitle>
        <CardDescription className="text-primary-foreground/80">
          System-wide activity monitoring (read-only)
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 bg-background">
        {/* Filters */}
        <div className="flex flex-wrap items-end gap-4 mb-6 p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Filters:</span>
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="roleFilter" className="text-xs text-muted-foreground">
              Role
            </Label>
            <Select value={roleFilter} onValueChange={(value) => { setRoleFilter(value); setCurrentPage(1); }}>
              <SelectTrigger className="w-36 bg-background text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROLES.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role === 'all' ? 'All Roles' : role.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label htmlFor="startDate" className="text-xs text-muted-foreground">
              From Date
            </Label>
            <Input
              id="startDate"
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setCurrentPage(1); }}
              className="w-36 bg-background text-foreground"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="endDate" className="text-xs text-muted-foreground">
              To Date
            </Label>
            <Input
              id="endDate"
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setCurrentPage(1); }}
              className="w-36 bg-background text-foreground"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleClearFilters}
            className="text-foreground bg-transparent"
          >
            Clear
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No activity logs found</p>
            <p className="text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted">
                    <TableHead className="text-foreground font-semibold">User Role</TableHead>
                    <TableHead className="text-foreground font-semibold">Action</TableHead>
                    <TableHead className="text-foreground font-semibold">Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {logs.map((log) => (
                    <TableRow key={log.id} className="hover:bg-muted/50">
                      <TableCell>{getRoleBadge(log.user_role)}</TableCell>
                      <TableCell className="text-foreground max-w-md truncate">
                        {log.action}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDateTime(log.created_at)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalCount)} to{' '}
                {Math.min(currentPage * PAGE_SIZE, totalCount)} of {totalCount} entries
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <span className="text-sm text-foreground px-2">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                  className="text-foreground"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
