import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  FileText, 
  Shield, 
  Clock, 
  Users, 
  Download, 
  Bell, 
  Search,
  CheckCircle,
  Building2,
  Stethoscope,
  FlaskConical,
  UserCog
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-primary text-primary-foreground sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">JNMC Sahayak</h1>
                <p className="text-xs text-cream/80">JNMCH, AMU</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button variant="ghost" className="text-cream hover:text-cream hover:bg-navy-light">
                  Login
                </Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-cream text-primary hover:bg-cream/90">
                  Register
                </Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-cream/20 text-cream border-0 mb-6">
                Jawaharlal Nehru Medical College Hospital, AMU
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-balance mb-6">
                Access Your Medical Reports Online, Anytime
              </h1>
              <p className="text-lg text-cream/90 mb-8 leading-relaxed text-pretty">
                JNMC Sahayak is your secure gateway to view, download, and track all your 
                diagnostic test reports from JNMCH. No more waiting in queues - get instant 
                access to your pathology, radiology, and other test results.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/sign-up">
                  <Button size="lg" className="bg-cream text-primary hover:bg-cream/90">
                    Get Started
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="border-cream text-cream hover:bg-cream/10 bg-transparent">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-cream/10 rounded-2xl p-8 backdrop-blur">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-card/10 rounded-lg p-4">
                    <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-cream">Complete Blood Count</p>
                      <p className="text-sm text-cream/70">Report Available</p>
                    </div>
                    <Badge className="ml-auto bg-green-500/20 text-green-200 border-0">Verified</Badge>
                  </div>
                  <div className="flex items-center gap-4 bg-card/10 rounded-lg p-4">
                    <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-cream">Chest X-Ray</p>
                      <p className="text-sm text-cream/70">Report Available</p>
                    </div>
                    <Badge className="ml-auto bg-green-500/20 text-green-200 border-0">Verified</Badge>
                  </div>
                  <div className="flex items-center gap-4 bg-card/10 rounded-lg p-4">
                    <div className="w-12 h-12 bg-cream rounded-full flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-cream">Lipid Profile</p>
                      <p className="text-sm text-cream/70">Processing</p>
                    </div>
                    <Badge className="ml-auto bg-yellow-500/20 text-yellow-200 border-0">Pending</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Why Use JNMC Sahayak?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A modern solution designed for patients, doctors, and hospital staff 
              to streamline access to medical test reports.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Instant Access</CardTitle>
                <CardDescription>
                  Get your test reports as soon as they are uploaded. No more waiting in long queues.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Secure & Private</CardTitle>
                <CardDescription>
                  Your medical data is encrypted and protected with industry-standard security measures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Download & Share</CardTitle>
                <CardDescription>
                  Download your reports in PDF format and share them with your doctors instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Real-time Notifications</CardTitle>
                <CardDescription>
                  Receive instant notifications when your reports are ready for viewing.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <Search className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Easy Search</CardTitle>
                <CardDescription>
                  Find any report quickly with powerful search and filter options by date, type, or department.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-card-foreground">Verified Reports</CardTitle>
                <CardDescription>
                  All reports are verified by authorized lab staff before being made available.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-foreground mb-4">
              Built for Everyone
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              JNMC Sahayak serves the entire hospital ecosystem with role-based access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Patients</CardTitle>
                <CardDescription>
                  View, download, and track your diagnostic test reports from anywhere.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Doctors</CardTitle>
                <CardDescription>
                  Access patient reports securely for faster and better diagnosis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Lab Staff</CardTitle>
                <CardDescription>
                  Upload and manage test reports with easy-to-use tools.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCog className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-card-foreground">Admins</CardTitle>
                <CardDescription>
                  Complete system oversight with access control and audit logs.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Getting started with JNMC Sahayak is simple and quick.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Register</h3>
              <p className="text-muted-foreground">
                Sign up using your Aadhaar number or JNMCH Registration ID with OTP verification.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Get Notified</h3>
              <p className="text-muted-foreground">
                Receive instant notifications when your test reports are uploaded and verified.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Access Reports</h3>
              <p className="text-muted-foreground">
                View and download your reports anytime from your dashboard on any device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">
            Ready to Access Your Reports Online?
          </h2>
          <p className="text-lg text-cream/90 mb-8 max-w-2xl mx-auto">
            Join thousands of patients who are already using JNMC Sahayak for 
            hassle-free access to their medical test reports.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button size="lg" className="bg-cream text-primary hover:bg-cream/90">
                Create Account
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline" className="border-cream text-cream hover:bg-cream/10 bg-transparent">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12 border-t border-navy-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-cream rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">JNMC Sahayak</h3>
                  <p className="text-xs text-cream/80">JNMCH, AMU</p>
                </div>
              </div>
              <p className="text-cream/80 text-sm leading-relaxed max-w-md">
                Jawaharlal Nehru Medical College Hospital, Aligarh Muslim University. 
                Providing quality healthcare services since 1962.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-cream/80">
                <li><Link href="/auth/login" className="hover:text-cream">Patient Login</Link></li>
                <li><Link href="/auth/login" className="hover:text-cream">Doctor Login</Link></li>
                <li><Link href="/auth/login" className="hover:text-cream">Staff Login</Link></li>
                <li><Link href="#features" className="hover:text-cream">Features</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-cream/80">
                <li>JNMCH, AMU Campus</li>
                <li>Aligarh, UP - 202002</li>
                <li>helpdesk@jnmch.edu</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-navy-light mt-8 pt-8 text-center text-sm text-cream/60">
            <p>&copy; {new Date().getFullYear()} JNMC Sahayak. All rights reserved. Jawaharlal Nehru Medical College Hospital, AMU.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
