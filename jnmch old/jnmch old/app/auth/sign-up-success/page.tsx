import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, CheckCircle } from "lucide-react"

export default function SignUpSuccessPage() {
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

      {/* Success Message */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-background">
        <Card className="w-full max-w-md bg-card text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-card-foreground">Account Created!</CardTitle>
            <CardDescription>
              Your account has been successfully created.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-secondary rounded-lg p-4">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Mail className="w-5 h-5 text-primary" />
                <p className="font-medium text-secondary-foreground">Check Your Email</p>
              </div>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a confirmation link to your email address. 
                Please click the link to verify your account before logging in.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/auth/login" className="block">
                <Button className="w-full">
                  Go to Login
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
