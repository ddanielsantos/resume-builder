"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"

export const projectsSchema = z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().url("Invalid URL format").optional(),
}));

export type ProjectList = z.infer<typeof projectsSchema>;


export function ProjectsForm({ data, updateData }) {


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {projectsList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No projects added yet</p>
          <Button type="button" onClick={addProject} className="gap-2">
            <Plus size={16} /> Add Project
          </Button>
        </div>
      ) : (
        <>
          {projectsList.map((project, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`name-${index}`}>Project Name</Label>
                    <Input
                      id={`name-${index}`}
                      value={project.name}
                      onChange={(e) => handleChange(index, "name", e.target.value)}
                      placeholder="E-commerce Platform"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={project.description}
                      onChange={(e) => handleChange(index, "description", e.target.value)}
                      placeholder="Describe the project, technologies used, and your role..."
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`link-${index}`}>Project Link</Label>
                    <Input
                      id={`link-${index}`}
                      value={project.link}
                      onChange={(e) => handleChange(index, "link", e.target.value)}
                      placeholder="github.com/username/project"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeProject(index)}
                    className="gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={addProject} className="gap-2">
              <Plus size={16} /> Add Another Project
            </Button>
            <Button type="submit">Save Projects</Button>
          </div>
        </>
      )}
    </form>
  )
}
