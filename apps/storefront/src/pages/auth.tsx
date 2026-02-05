import { useState } from "react"
import { useLogin, useRegister } from "../lib/hooks/use-customer"
import { useNavigate, useParams } from "@tanstack/react-router"

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [error, setError] = useState("")

  const navigate = useNavigate()
  const { countryCode } = useParams({ strict: false })
  const loginMutation = useLogin()
  const registerMutation = useRegister()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      if (isLogin) {
        await loginMutation.mutateAsync({ email, password })
      } else {
        await registerMutation.mutateAsync({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
        })
      }
      navigate({ to: "/$countryCode/account", params: { countryCode: countryCode || "de" } })
    } catch (err: any) {
      setError(err?.message || "Authentication failed. Please try again.")
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center pt-32 pb-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light mb-2">
            {isLogin ? "Login to Your Account" : "Create Your Essentials Account"}
          </h1>
          <p className="text-neutral-600">
            {isLogin
              ? "Welcome back to Essentials"
              : "Join Essentials for a personalized shopping experience"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-neutral-700 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
                  placeholder="Doe"
                />
              </div>
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-neutral-700 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-neutral-300 focus:outline-none focus:border-neutral-900"
              placeholder="Enter your password"
              minLength={8}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending || registerMutation.isPending}
            className="w-full bg-neutral-900 text-white py-3 hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loginMutation.isPending || registerMutation.isPending
              ? "Processing..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
            }}
            className="text-neutral-600 hover:text-neutral-900 text-sm"
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </button>
        </div>
      </div>
    </div>
  )
}
