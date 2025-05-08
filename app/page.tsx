import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="font-semibold">DevCV Builder</div>
          <nav className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link href="/builder">
              <Button>Create CV</Button>
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-24 space-y-8 md:py-32">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Build your software engineering CV in minutes
            </h1>
            <p className="text-xl text-muted-foreground">
              Create a professional CV and tailor it for specific job postings to increase your chances of landing
              interviews.
            </p>
            <div className="flex justify-center gap-4 pt-4">
              <Link href="/builder">
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight size={16} />
                </Button>
              </Link>
              <Link href="/examples">
                <Button size="lg" variant="outline">
                  View Examples
                </Button>
              </Link>
            </div>
          </div>

          <div className="mx-auto max-w-5xl rounded-lg border bg-background p-8 shadow-sm">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Key Features</h2>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    </div>
                    <span>Professional template designed for tech roles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    </div>
                    <span>Tailor your CV for specific job postings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    </div>
                    <span>Export to PDF for applications</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                    </div>
                    <span>Save and edit your CV anytime</span>
                  </li>
                </ul>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-full overflow-hidden rounded-lg border bg-muted">
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                    CV Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DevCV Builder. All rights reserved.
          </p>
          <nav className="flex gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <Link href="/contact" className="hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
