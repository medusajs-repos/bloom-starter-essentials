import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { useState } from "react"

interface ErrorFallbackProps {
  error: Error;
  reset?: () => void;
}

const ErrorFallback = ({ error, reset }: ErrorFallbackProps) => {
  const isDev = import.meta.env.DEV;
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="content-container py-16">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-zinc-200 shadow-sm p-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-rose-500 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-zinc-900 mb-3">
              Oops! Something went wrong
            </h2>
            <p className="text-zinc-600 text-lg">
              We encountered an unexpected error.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
            {reset && (
              <Button variant="secondary" onClick={reset} className="sm:w-auto">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try again
              </Button>
            )}
            <Link to="/">
              <Button className="w-full sm:w-auto">
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Go home
              </Button>
            </Link>
          </div>

          {isDev && (
            <div className="border-t border-zinc-200 pt-6">
              <Button
                onClick={() => setShowDetails(!showDetails)}
                variant="secondary"
              >
                <svg
                  className={`w-4 h-4 mr-2 transition-transform ${
                    showDetails ? "rotate-90" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
                {showDetails ? "Hide" : "Show"} error details
              </Button>

              {showDetails && (
                <div className="mt-4 p-4 bg-zinc-50">
                  <div className="text-left space-y-3">
                    <div>
                      <p className="text-xs font-medium text-zinc-900 uppercase tracking-wide mb-1">
                        Error Message
                      </p>
                      <code className="text-sm text-rose-900 break-all">
                        {error.message}
                      </code>
                    </div>

                    {error.stack && (
                      <div>
                        <p className="text-xs font-medium text-zinc-900 uppercase tracking-wide mb-1">
                          Stack Trace
                        </p>
                        <pre className="text-xs text-zinc-600 bg-white border border-zinc-300 p-3 overflow-auto max-h-40">
                          {error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorFallback;
