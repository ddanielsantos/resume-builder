"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { z } from "zod"

export const skillsSchema = z.object({
  technical: z.array(z.string()).optional(),
  soft: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
});

export type Skills = z.infer<typeof skillsSchema>

export function SkillsForm({ data, updateData }) {


  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-4">
        <Label>Technical Skills</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.technical.map((skill, index) => (
            <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill("technical", index)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X size={14} />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTechnical}
            onChange={(e) => setNewTechnical(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "technical", newTechnical)}
            placeholder="Add a technical skill (e.g., JavaScript, React, AWS)"
          />
          <Button type="button" onClick={() => addSkill("technical", newTechnical)} disabled={!newTechnical.trim()}>
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Soft Skills</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.soft.map((skill, index) => (
            <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
              {skill}
              <button
                type="button"
                onClick={() => removeSkill("soft", index)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X size={14} />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newSoft}
            onChange={(e) => setNewSoft(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "soft", newSoft)}
            placeholder="Add a soft skill (e.g., Leadership, Communication)"
          />
          <Button type="button" onClick={() => addSkill("soft", newSoft)} disabled={!newSoft.trim()}>
            Add
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Languages</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {skills.languages.map((language, index) => (
            <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
              {language}
              <button
                type="button"
                onClick={() => removeSkill("languages", index)}
                className="ml-1 rounded-full hover:bg-muted"
              >
                <X size={14} />
                <span className="sr-only">Remove</span>
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, "languages", newLanguage)}
            placeholder="Add a language (e.g., English (Native), Spanish (Intermediate))"
          />
          <Button type="button" onClick={() => addSkill("languages", newLanguage)} disabled={!newLanguage.trim()}>
            Add
          </Button>
        </div>
      </div>

      <Button type="submit">Save Skills</Button>
    </form>
  )
}
