"use client"

import { useState, useEffect, type FormEvent, useRef } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { auth, db } from "../../../database/firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"
import Image from "next/image"
import { getImageUrl } from "@/routes/imageroute"
import { initializeTokens } from "@/app/utils/tokenManager"

export default function SignInForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [error, setError] = useState("")
  const [processing, setProcessing] = useState(false)
  const [timer, setTimer] = useState(0)
  const [username, setUsername] = useState("")
  const [showUsernameForm, setShowUsernameForm] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false) // Login flow toggle
  const [rememberMe, setRememberMe] = useState(false) // Remember me checkbox

  const inputRef = useRef<HTMLInputElement>(null) // Ref for hidden input

  // Test Firebase connection
  const testFirebaseConnection = async () => {
    try {
      console.log("🧪 Testing Firebase connection...")
      console.log("📊 Firebase config:", {
        projectId: db.app.options.projectId,
        authDomain: db.app.options.authDomain,
        currentUser: auth.currentUser?.email || "Not authenticated"
      })

      // Try to read a test document (this will fail with permission error if rules are wrong)
      const testRef = doc(db, "test", "connection")
      await getDoc(testRef)
      console.log("✅ Firebase connection test successful")
    } catch (err: unknown) {
      console.error("❌ Firebase connection test failed:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: err instanceof Error && 'code' in err ? (err as { code: string }).code : undefined,
        fullError: err
      })
    }
  }

  const handleSendOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!termsAccepted) {
      setError("Please accept the terms & policy to continue")
      return
    }
    setError("")
    try {
      setProcessing(true)
      

      
      await axios.post("http://localhost:5001/send-otp", { email })
      setOtpSent(true)
      setTimer(60)
    } catch (error) {
      const apiError = error as ApiError
      setError(apiError.message || 'Failed to send OTP')
      setProcessing(false)
    }
  }

  const handleVerifyOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    try {
      setProcessing(true)
      await axios.post("http://localhost:5001/verify-otp", {
        email,
        otp: otp.trim(),
      })

      localStorage.setItem("otpUser", email)
      console.log("📧 OTP verified for email:", email)

      const userRef = doc(db, "users", email)
      console.log("📄 Creating user document reference for:", email)

      console.log("🔍 Attempting to read user document (OTP flow)...")
      const userSnap = await getDoc(userRef)
      console.log("✅ User document read successful (OTP), exists:", userSnap.exists())

      if (userSnap.exists()) {
        const data = userSnap.data()
        console.log("📊 User data retrieved (OTP):", {
          hasUsername: !!data?.username,
          username: data?.username,
          email: data?.email
        })

        if (data.username) {
          localStorage.setItem("username", data.username)
          console.log("🏠 Redirecting to home page (OTP):", data.username)
          router.push(`/view/home/${data.username}`)
        } else {
          console.log("👤 User exists but no username (OTP), showing username form")
          setShowUsernameForm(true)
        }
      } else {
        console.log("🆕 User doesn't exist (OTP), creating new user document...")
        await setDoc(userRef, { email })
        console.log("✅ New user document created successfully (OTP)")
        setShowUsernameForm(true)
      }

      setOtp("")
      setOtpSent(false)
      setError("")
    } catch (err) {
      console.error("OTP verification error:", err)
      setError("Invalid OTP or expired.")
    } finally {
      setProcessing(false)
    }
  }

  const handleResendOtp = async () => {
    try {
      setProcessing(true)
      setError("")
      await axios.post("http://localhost:5001/send-otp", { email })
      setTimer(60)
    } catch {
      setError("Failed to resend OTP.")
    } finally {
      setProcessing(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      console.log("🚀 Starting Google login process...")

      const provider = new GoogleAuthProvider()
      console.log("📱 Google provider created")

      const result = await signInWithPopup(auth, provider)
      console.log("✅ Google sign-in popup completed", {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName
      })

      const userEmail = result.user.email
      if (!userEmail) {
        console.error("❌ No email from Google user")
        throw new Error("No email from Google user")
      }

      console.log("📧 User email obtained:", userEmail)
      console.log("🔐 Auth state:", {
        currentUser: auth.currentUser?.email,
        isAuthenticated: !!auth.currentUser
      })

      localStorage.setItem("otpUser", userEmail)
      console.log("💾 Email saved to localStorage")

      const userRef = doc(db, "users", userEmail)
      console.log("📄 User document reference created for:", userEmail)

      console.log("🔍 Attempting to read user document...")
      const userSnap = await getDoc(userRef)
      console.log("✅ User document read successful, exists:", userSnap.exists())

      if (userSnap.exists()) {
        const data = userSnap.data()
        console.log("📊 User data retrieved:", {
          hasUsername: !!data?.username,
          username: data?.username,
          email: data?.email
        })

        if (data?.username) {
          localStorage.setItem("username", data.username)
          console.log("🏠 Redirecting to home page for existing user:", data.username)
          router.push(`/view/home/${data.username}`)
        } else {
          console.log("👤 User exists but no username, showing username form")
          setShowUsernameForm(true)
        }
      } else {
        console.log("🆕 User doesn't exist, creating new user document...")
        console.log("📝 Attempting to create user document with data:", { email: userEmail })

        await setDoc(userRef, { email: userEmail })
        console.log("✅ New user document created successfully")
        console.log("👤 Showing username form for new user")
        setShowUsernameForm(true)
      }
    } catch (err: unknown) {
      console.error("❌ Google sign-in error:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: err instanceof Error && 'code' in err ? (err as { code: string }).code : undefined,
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      })

      // More specific error messages
      const errorCode = err instanceof Error && 'code' in err ? (err as { code: string }).code : undefined
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      if (errorCode === 'permission-denied' || errorMessage?.includes('permissions')) {
        setError("Database permission error. Please contact support.")
        console.error("🔒 PERMISSION ERROR: Firestore rules may be too restrictive")
      } else if (errorCode === 'auth/popup-closed-by-user') {
        setError("Sign-in cancelled.")
      } else if (errorCode === 'auth/popup-blocked') {
        setError("Popup blocked. Please allow popups and try again.")
      } else {
        setError("Google sign-in failed. Please try again.")
      }
    }
  }

  const handleUsernameSubmit = async () => {
    try {
      const email = localStorage.getItem("otpUser")
      console.log("👤 Starting username submission for email:", email)

      if (email && username.trim()) {
        const realUsername = username.trim()
        const slug = `${realUsername.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(0, 6)}`

        console.log("📝 Username data prepared:", {
          email,
          username: realUsername,
          slug
        })

        console.log("💾 Attempting to update user document with username...")
        await setDoc(
          doc(db, "users", email),
          {
            email,
            username: realUsername,
            slug, // only used for routing
          },
          { merge: true },
        )
        console.log("✅ User document updated successfully with username")

        localStorage.setItem("username", realUsername)
        localStorage.setItem("slug", slug)
        console.log("💾 Username and slug saved to localStorage")

        // Initialize tokens for new user
        initializeTokens()
        console.log("🎫 Tokens initialized for new user")

        console.log("🏠 Redirecting to home page:", `/view/home/${slug}`)
        router.push(`/view/home/${slug}`)
      } else {
        console.error("❌ Missing email or username:", { email, username: username.trim() })
        setError("Missing email or username. Please try again.")
      }
    } catch (err: unknown) {
      console.error("❌ Username submission error:", {
        message: err instanceof Error ? err.message : 'Unknown error',
        code: err instanceof Error && 'code' in err ? (err as { code: string }).code : undefined,
        stack: err instanceof Error ? err.stack : undefined,
        fullError: err
      })

      const errorCode = err instanceof Error && 'code' in err ? (err as { code: string }).code : undefined
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      
      if (errorCode === 'permission-denied' || errorMessage?.includes('permissions')) {
        setError("Database permission error. Please contact support.")
        console.error("🔒 PERMISSION ERROR: Firestore rules may be too restrictive")
      } else {
        setError("Failed to save username. Please try again.")
      }
    }
  }

  useEffect(() => {
    if (typeof window === "undefined") return

    // Debug Firebase auth state on component mount
    console.log("🔐 Firebase Auth Debug:", {
      currentUser: auth.currentUser,
      isAuthenticated: !!auth.currentUser,
      projectId: db.app.options.projectId,
      authDomain: db.app.options.authDomain
    })

    // Test Firebase connection on mount
    testFirebaseConnection()

    if (otpSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [otpSent, timer])

  useEffect(() => {
    if (typeof window === "undefined") return

    if (otpSent && inputRef.current) {
      inputRef.current.focus()
    }
  }, [otpSent])

  return (
    <div className="w-full h-full flex flex-col p-12 bg-[#1E1E1E] relative">        
    <div className="absolute inset-0 bg-gradient-to-l from-gray-900/90 via-transparent to-transparent pointer-events-none"></div>

      {/* Header with WildMind Logo - Top Left */}
      <div className="flex items-center mb-6">
        <Image 
          src={getImageUrl('core','logo')}
          alt="WildMind Logo" 
          width={120} 
          height={40} 
          className="h-10 w-auto"
        />
      </div>
       
      {/* Form Content - Centered */}
      <div className="flex-1 flex items-center justify-center -mt-4   ">
        <div className="w-full max-w-md space-y-6  ">
          {/* Welcome Section - Only show when not on OTP screen, username screen, or login screen */}
          {!otpSent && !showUsernameForm && !showLoginForm && (
            <div className="text-start space-y-2 ml-2">
              <h1 className="text-3xl font-medium text-white">Welcome to WildMind!</h1>
              <p className="text-white text-sm font-light">Sign up to access the platform.</p>
            </div>
          )}

          {showUsernameForm ? (
            <div className="space-y-6">
              {/* Title */}
              <div className="text-start space-y-3">
                <h1 className="text-3xl font-medium text-white">Verification Successful!</h1>
                <p className="text-white text-regular">Last step, Make a Unique Username</p>
              </div>

              {/* Username Input */}
              <div className="space-y-3">
                <label className="text-white font-medium text-lg ml-2">Enter User Name</label>
                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2e2e2e] border border-[#464646] placeholder-[#9094A6] focus:outline-none focus:border-[#5AD7FF] rounded-2xl text-white text-base"
                  required
                />
              </div>

              {/* Access WildMind Button */}
              <button 
                onClick={handleUsernameSubmit} 
                className="w-full bg-[#1C303D] hover:bg-[#3367D6] py-2 rounded-full font-semibold text-white transition-all duration-200"
              >
                Access WildMind
              </button>
            </div>
          ) : showLoginForm ? (
            <div className="space-y-6">
              {/* Title */}
              <div className="text-start space-y-3">
                <h1 className="text-3xl font-medium text-white">Welcome back!</h1>
                <p className="text-white text-base">Enter your Credentials to access your account.</p>
              </div>

              {/* Email/Username Input */}
              <div className="space-y-3">
                <label className="text-white font-regular text-md ">Email address / User Name</label>
                <input
                  type="text"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-[#2e2e2e] border border-[#464646] placeholder-[#9094A6] focus:outline-none focus:border-[#5AD7FF] rounded-2xl text-white text-base"
                  required
                />
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-[#5AD7FF] bg-[#2e2e2e] border-[#464646] rounded focus:ring-[#5AD7FF] focus:ring-2"
                  />
                  <label htmlFor="remember" className="text-sm text-[#A0A0A0]">
                    Remember for 30 days
                  </label>
                </div>
              </div>

              {/* Login Button */}
              <button 
                type="button"
                className="w-full bg-[#1C303D] hover:bg-[#3367D6] py-2 rounded-full font-semibold text-white transition-all duration-200"
              >
                Login
              </button>

              {/* Separator */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-grow h-px bg-[#464646]"></div>
                <span className="text-[#A0A0A0] text-sm">or</span>
                <div className="flex-grow h-px bg-[#464646]"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex gap-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-80 bg-[#1a1a1a] text-white font-medium py-2.5 px-4 rounded-2xl border border-[#464646] hover:bg-[#2a2a2a] transition-all duration-200 flex items-center justify-center gap-4"
                >
                  <Image src={getImageUrl('svgs','google')} alt="Google" width={20} height={20} className="w-5 h-5" />
                  <span className="text-sm">Sign in with Google</span>
                </button>
                <button
                  onClick={() => {}}
                  className="w-80 bg-[#1a1a1a] text-white font-medium py-2.5 px-6 rounded-2xl border border-[#464646] hover:bg-[#2a2a2a] transition-all duration-200 flex items-center justify-center gap-4"
                >
                  <Image src={getImageUrl('svgs','apple')} alt="Apple" width={20} height={20} className="w-5 h-5" />
                  <span className="text-sm">Sign in with Apple</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-[#A0A0A0] text-sm">Don&apos;t have an account? </span>
                <button
                  type="button"
                  onClick={() => setShowLoginForm(false)}
                  className="text-[#4285F4] underline cursor-pointer text-sm"
                >
                  Sign Up
                </button>
              </div>
            </div>
          ) : otpSent ? (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              {/* Title */}
              <div className="text-start space-y-3">
                <h1 className="text-3xl font-medium text-white">Verify code</h1>
                <p className="text-white text-regular">An authentication code has been sent to your email.</p>
              </div>

              {/* Code Input */}
              <div className="space-y-3">
                <label className="text-white font-medium text-lg">Enter Code</label>
                <input
                  type="text"
                  placeholder="Enter your Code"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6)
                    setOtp(value)
                  }}
                  className="w-full px-4 py-2 bg-[#2e2e2e] border border-[#464646] placeholder-[#9094A6] focus:outline-none focus:border-[#5AD7FF] rounded-2xl text-white text-base"
                  required
                />
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={processing || otp.length < 4}
                className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                  processing || otp.length < 4
                    ? "bg-[#3A3A3A] text-[#9B9B9B] cursor-not-allowed"
                    : "bg-[#1C303D] hover:bg-[#3367D6] text-white"
                }`}
              >
                {processing ? "Verifying..." : "Verify"}
              </button>

              {/* Resend Link */}
              <div className="text-center">
                <span className="text-[#A0A0A0] text-sm">Not receive email? </span>
                <button 
                  type="button" 
                  onClick={handleResendOtp} 
                  className="text-[#4285F4] underline cursor-pointer text-sm"
                >
                  Resend
                </button>
              </div>

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            </form>
          ) : (
            <>
              {/* Email Form */}
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div className="space-y-4 mt-8">
                  <label className="text-white font-medium text-md ml-2">Email address</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    className="w-full px-4 py-2 bg-[#171717] border border-[#464646] placeholder-[#9094A6] focus:outline-none focus:border-[#5AD7FF] rounded-full text-white text-base"
                    required
                  />
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3 ml-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 w-4 h-4 text-[#5AD7FF] bg-[#2e2e2e] border-[#464646] rounded focus:ring-[#5AD7FF] focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-sm text-[#A0A0A0]">
                    I agree to the{" "}
                    <span className="text-[#5AD7FF] underline cursor-pointer">terms & policy</span>
                  </label>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={processing || !termsAccepted}
                  className={`w-full mx-auto py-2 rounded-full font-medium text-md transition-all duration-200 ${
                    processing || !termsAccepted
                      ? "bg-[#3A3A3A] text-[#9B9B9B] cursor-not-allowed"
                      : "bg-[#1C303D] hover:bg-[#3367D6] text-white"
                  }`}
                >
                  {processing ? "Sending..." : "Sign Up"}
                </button>
              </form>

              {/* Separator */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-grow h-px bg-[#464646]"></div>
                <span className="text-[#A0A0A0] text-sm">Or</span>
                <div className="flex-grow h-px bg-[#464646]"></div>
              </div>

              {/* Social Login Buttons */}
              <div className="flex gap-6 mb-10">
                <button
                  onClick={handleGoogleLogin}
                  className="w-80 bg-[#1a1a1a] text-white font-medium py-2.5 px-4 rounded-2xl border border-[#464646] hover:bg-[#2a2a2a] transition-all duration-200 flex items-center justify-center gap-4"
                >
                  <Image src={getImageUrl('svgs','google')} alt="Google" width={20} height={20} className="w-5 h-5" />
                  <span className="text-sm">Sign in with Google</span>
                </button>
                <button
                  onClick={() => {}}
                  className="w-80 bg-[#1a1a1a] text-white font-medium py-2.5 px-6 rounded-2xl border border-[#464646] hover:bg-[#2a2a2a] transition-all duration-200 flex items-center justify-center gap-4"
                >
                  <Image src={getImageUrl('svgs','apple')} alt="Apple" width={20} height={20} className="w-5 h-5" />
                  <span className="text-sm">Sign in with Apple</span>
                </button>
              </div>


            </>
          )}
        </div>
      </div>

      {/* Separator for visual break */}
      <div className="h-2"></div>

      {/* Footer - Only show when not on OTP screen, username screen, or login screen */}
      {!otpSent && !showUsernameForm && !showLoginForm && (
        <div className="text-center text-xs text-[#A0A0A0] space-y-3 mb-10">
          <p>By Continuing, you agree to WildMind&apos;s</p>
          <p>
            <span className="text-[#4285F4] ">Terms of Use</span> and{" "}
            <span className="text-[#4285F4] ">Privacy Policy</span>.
          </p>
        </div>
      )}

      {/* Cookies Settings - Individual Div - Only show when not on OTP screen, username screen, or login screen */}
      {!otpSent && !showUsernameForm && !showLoginForm && (
        <div className="text-center mb-12">
          <span className="text-[#4285F4] text-xs">Cookies Settings</span>
        </div>
      )}
    </div>
  )
}

// Add interface for Firebase errors
// interface FirebaseError {
//   message: string;
//   code?: string;
//   stack?: string;
// }

// Replace the any type with proper typing
interface ApiError {
  message: string;
  code?: string;
}
