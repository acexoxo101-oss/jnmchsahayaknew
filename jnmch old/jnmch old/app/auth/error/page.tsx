import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, AlertTriangle } from "lucide-react"

export default function AuthErrorPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">JNMC Sahayak</h1>
                <p className="text-xs text-cream/80">JNMCH, AMU</p>
              </div>
            </Link>
          </div>
        </nav>
      </header>

      {/* Error Message */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-background">
        <Card className="w-full max-w-md bg-card text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">Authentication Error</CardTitle>
            <CardDescription>
              Something went wrong during authentication.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              This could happen if the link has expired, has already been used, 
              or if there was a network issue. Please try again.
            </p>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full">
                  Try Again
                </Button>
              </Link>
              <Link href="/" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  Back to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-cream/60">
          <p>&copy; {new Date().getFullYear()} JNMC Sahayak. JNMCH, AMU.</p>
        </div>
      </footer>
    </div>
  )
}
