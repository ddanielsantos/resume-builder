import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { UserCvList } from "@/components/dashboard/user-cv-list"
import {createClient} from "@/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your CVs</h1>
        <Link href="/builder">
          <Button>Create New CV</Button>
        </Link>
      </div>

      <UserCvList userId={user.id} />
    </div>
  )
}
