"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function PersonalInfoForm({ data, updateData }) {
  const [formData, setFormData] = useState(data)

  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Senior Software Engineer"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john.doe@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="(123) 456-7890" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="San Francisco, CA"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            placeholder="johndoe.dev"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="github">GitHub</Label>
          <Input
            id="github"
            name="github"
            value={formData.github}
            onChange={handleChange}
            placeholder="github.com/johndoe"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn</Label>
          <Input
            id="linkedin"
            name="linkedin"
            value={formData.linkedin}
            onChange={handleChange}
            placeholder="linkedin.com/in/johndoe"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Professional Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleChange}
          placeholder="A brief summary of your professional background and goals..."
          className="min-h-[100px]"
        />
      </div>

      <Button type="submit">Save Personal Information</Button>
    </form>
  )
}
