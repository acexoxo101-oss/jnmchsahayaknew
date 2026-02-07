"use client"

import React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Building2, Loader2, AlertCircle } from "lucide-react"

type UserRole = "patient" | "doctor" | "lab_staff"

export default function SignUpPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<UserRole>("patient")
  const [aadhaarNumber, setAadhaarNumber] = useState("")
  const [jnmchId, setJnmchId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
  e.preventDefault()
  setError(null)

  if (password !== confirmPassword) {
    setError("Passwords do not match")
    return
  }

  setIsLoading(true)

  try {
    // 1️⃣ Create auth user
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (signUpError) throw signUpError
    if (!data.user) throw new Error("User not created")

    const userId = data.user.id

    // 2️⃣ Create profile (THIS WAS MISSING)
    const { error: profileError } = await supabase
      .from("profiles")
      .insert({
        id: userId,
        role: role,
      })

    if (profileError) throw profileError

    // 3️⃣ Create patient row (ONLY if patient)
    if (role === "patient") {
      const { error: patientError } = await supabase
        .from("patients")
        .insert({
          profile_id: userId,
          full_name: fullName,
          phone,
          aadhaar_number: aadhaarNumber || null,
        })

      if (patientError) throw patientError
    }

    router.push("/auth/login")
  } catch (err: any) {
    console.error(err)
    setError(err.message || "Signup failed")
  } finally {
    setIsLoading(false)
  }
}


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

      {/* Sign Up Form */}
      <main className="flex-1 flex items-center justify-center py-12 px-4 bg-background">
        <Card className="w-full max-w-lg bg-card">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-card-foreground">Create Account</CardTitle>
            <CardDescription>
              Register to access your medical reports online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="role" className="text-card-foreground">I am a</Label>
                <Select value={role} onValueChange={(v) => setRole(v as UserRole)}>
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                    <SelectItem value="lab_staff">Lab Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-card-foreground">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  disabled={isLoading}
                  className="bg-card"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-card-foreground">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-card-foreground">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={isLoading}
                    className="bg-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar" className="text-card-foreground">
                    Aadhaar Number <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="aadhaar"
                    type="text"
                    placeholder="XXXX XXXX XXXX"
                    value={aadhaarNumber}
                    onChange={(e) => setAadhaarNumber(e.target.value)}
                    disabled={isLoading}
                    className="bg-card"
                    maxLength={14}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="jnmchId" className="text-card-foreground">
                    JNMCH ID <span className="text-muted-foreground">(Optional)</span>
                  </Label>
                  <Input
                    id="jnmchId"
                    type="text"
                    placeholder="Registration ID"
                    value={jnmchId}
                    onChange={(e) => setJnmchId(e.target.value)}
                    disabled={isLoading}
                    className="bg-card"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-card-foreground">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Min 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-card"
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-card-foreground">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-card"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By creating an account, you agree to our Terms of Service and Privacy Policy.
              </p>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </CardFooter>
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
