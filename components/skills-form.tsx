"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function SkillsForm({ data, updateData }) {
  const [skills, setSkills] = useState(
    data || {
      technical: [],
      soft: [],
      languages: [],
    },
  )
  const [newTechnical, setNewTechnical] = useState("")
  const [newSoft, setNewSoft] = useState("")
  const [newLanguage, setNewLanguage] = useState("")

  useEffect(() => {
    setSkills(
      data || {
        technical: [],
        soft: [],
        languages: [],
      },
    )
  }, [data])

  const addSkill = (type, value) => {
    if (!value.trim()) return

    const newSkills = { ...skills }
    newSkills[type] = [...newSkills[type], value.trim()]

    setSkills(newSkills)

    // Reset input field
    if (type === "technical") setNewTechnical("")
    else if (type === "soft") setNewSoft("")
    else if (type === "languages") setNewLanguage("")
  }

  const removeSkill = (type, index) => {
    const newSkills = { ...skills }
    newSkills[type] = newSkills[type].filter((_, i) => i !== index)
    setSkills(newSkills)
  }

  const handleKeyDown = (e, type, value) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(type, value)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(skills)
  }

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
