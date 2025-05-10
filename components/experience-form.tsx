"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"

export const experienceSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  description: z.string().optional(),
});

export type Experience = z.infer<typeof experienceSchema>;

export function ExperienceForm({ data, updateData }) {

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {experienceList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No experience entries yet</p>
          <Button type="button" onClick={addExperience} className="gap-2">
            <Plus size={16} /> Add Experience
          </Button>
        </div>
      ) : (
        <>
          {experienceList.map((experience, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`title-${index}`}>Job Title</Label>
                    <Input
                      id={`title-${index}`}
                      value={experience.title}
                      onChange={(e) => handleChange(index, "title", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`company-${index}`}>Company</Label>
                    <Input
                      id={`company-${index}`}
                      value={experience.company}
                      onChange={(e) => handleChange(index, "company", e.target.value)}
                      placeholder="Tech Solutions Inc."
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      value={experience.location}
                      onChange={(e) => handleChange(index, "location", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`from-${index}`}>From</Label>
                    <Input
                      id={`from-${index}`}
                      value={experience.from}
                      onChange={(e) => handleChange(index, "from", e.target.value)}
                      placeholder="Jan 2020"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`to-${index}`}>To</Label>
                    <Input
                      id={`to-${index}`}
                      value={experience.to}
                      onChange={(e) => handleChange(index, "to", e.target.value)}
                      placeholder="Present"
                    />
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label htmlFor={`description-${index}`}>Description</Label>
                  <Textarea
                    id={`description-${index}`}
                    value={experience.description}
                    onChange={(e) => handleChange(index, "description", e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeExperience(index)}
                    className="gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={addExperience} className="gap-2">
              <Plus size={16} /> Add Another Experience
            </Button>
            <Button type="submit">Save Experience</Button>
          </div>
        </>
      )}
    </form>
  )
}
