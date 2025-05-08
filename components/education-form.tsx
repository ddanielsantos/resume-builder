"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

export function EducationForm({ data, updateData }) {
  const [educationList, setEducationList] = useState(data || [])

  useEffect(() => {
    setEducationList(data || [])
  }, [data])

  const addEducation = () => {
    setEducationList([
      ...educationList,
      {
        degree: "",
        institution: "",
        location: "",
        from: "",
        to: "",
      },
    ])
  }

  const removeEducation = (index) => {
    const newList = [...educationList]
    newList.splice(index, 1)
    setEducationList(newList)
    updateData(newList)
  }

  const handleChange = (index, field, value) => {
    const newList = [...educationList]
    newList[index][field] = value
    setEducationList(newList)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    updateData(educationList)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {educationList.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-4">No education entries yet</p>
          <Button type="button" onClick={addEducation} className="gap-2">
            <Plus size={16} /> Add Education
          </Button>
        </div>
      ) : (
        <>
          {educationList.map((education, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor={`degree-${index}`}>Degree/Certificate</Label>
                    <Input
                      id={`degree-${index}`}
                      value={education.degree}
                      onChange={(e) => handleChange(index, "degree", e.target.value)}
                      placeholder="B.S. Computer Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`institution-${index}`}>Institution</Label>
                    <Input
                      id={`institution-${index}`}
                      value={education.institution}
                      onChange={(e) => handleChange(index, "institution", e.target.value)}
                      placeholder="University of California, Berkeley"
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor={`location-${index}`}>Location</Label>
                    <Input
                      id={`location-${index}`}
                      value={education.location}
                      onChange={(e) => handleChange(index, "location", e.target.value)}
                      placeholder="Berkeley, CA"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`from-${index}`}>From Year</Label>
                    <Input
                      id={`from-${index}`}
                      value={education.from}
                      onChange={(e) => handleChange(index, "from", e.target.value)}
                      placeholder="2018"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`to-${index}`}>To Year</Label>
                    <Input
                      id={`to-${index}`}
                      value={education.to}
                      onChange={(e) => handleChange(index, "to", e.target.value)}
                      placeholder="2022 (or Present)"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeEducation(index)}
                    className="gap-2"
                  >
                    <Trash2 size={16} /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button type="button" variant="outline" onClick={addEducation} className="gap-2">
              <Plus size={16} /> Add Another Education
            </Button>
            <Button type="submit">Save Education</Button>
          </div>
        </>
      )}
    </form>
  )
}
