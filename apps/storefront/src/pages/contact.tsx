import { useState } from "react"
import { Button } from "@/components/ui/button"

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    
    // Placeholder - would connect to actual contact form service
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setStatus("success")
    
    // Reset form
    setFormData({ name: "", email: "", subject: "", message: "" })
    setTimeout(() => setStatus("idle"), 3000)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="content-container pt-32 pb-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-neutral-900 mb-4 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-lg text-neutral-600">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white border border-neutral-200 p-8">
              <h2 className="text-xl font-display font-semibold text-neutral-900 mb-6 uppercase tracking-wide">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold text-neutral-900 mb-2 uppercase tracking-wide"
                  >
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-neutral-900 mb-2 uppercase tracking-wide"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold text-neutral-900 mb-2 uppercase tracking-wide"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold text-neutral-900 mb-2 uppercase tracking-wide"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900 transition-colors resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  className="w-full bg-neutral-900 text-white py-4 hover:bg-neutral-800 transition-colors uppercase text-sm font-semibold tracking-wider disabled:opacity-50"
                >
                  {status === "loading" && "Sending..."}
                  {status === "success" && "Message Sent!"}
                  {(status === "idle" || status === "error") && "Send Message"}
                </Button>

                {status === "success" && (
                  <p className="text-sm text-green-600 text-center">
                    Thank you for your message! We'll get back to you soon.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-sm text-red-600 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white border border-neutral-200 p-8">
                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-4 uppercase tracking-wide">
                  Customer Service
                </h3>
                <div className="space-y-3 text-neutral-700">
                  <p>
                    <strong>Email:</strong> hello@essentials.com
                  </p>
                  <p>
                    <strong>Hours:</strong> Monday - Friday, 9am - 6pm EST
                  </p>
                  <p className="text-sm text-neutral-600 mt-4">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 p-8">
                <h3 className="text-lg font-display font-semibold text-neutral-900 mb-4 uppercase tracking-wide">
                  Press Inquiries
                </h3>
                <div className="space-y-3 text-neutral-700">
                  <p>
                    <strong>Email:</strong> press@essentials.com
                  </p>
                  <p className="text-sm text-neutral-600 mt-4">
                    For media and partnership opportunities.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
