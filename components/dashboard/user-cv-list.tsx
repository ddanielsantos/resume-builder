import { getSupabaseServer } from "@/lib/supabase/server"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { FileEdit, Eye, Trash2 } from "lucide-react"

export async function UserCvList({ userId }: { userId: string }) {
  const supabase = getSupabaseServer()

  const { data: cvs, error } = await supabase
    .from("cvs")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })

  if (error) {
    console.error("Error fetching CVs:", error)
    return <div>Failed to load your CVs. Please try again later.</div>
  }

  if (!cvs || cvs.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">You don't have any CVs yet</h3>
        <p className="text-muted-foreground mb-6">Create your first CV to get started</p>
        <Link href="/builder">
          <Button>Create Your First CV</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {cvs.map((cv) => (
        <Card key={cv.id}>
          <CardHeader>
            <CardTitle>{cv.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: {new Date(cv.updated_at).toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {cv.is_default ? <span className="text-primary font-medium">Default CV</span> : "Regular CV"}
            </p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link href={`/builder?id=${cv.id}`}>
              <Button variant="outline" size="sm" className="gap-1">
                <FileEdit size={14} /> Edit
              </Button>
            </Link>
            <div className="flex gap-2">
              <Link href={`/tailor?id=${cv.id}`}>
                <Button variant="outline" size="sm" className="gap-1">
                  <Eye size={14} /> Tailor
                </Button>
              </Link>
              <Button variant="destructive" size="sm" className="gap-1">
                <Trash2 size={14} /> Delete
              </Button>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
