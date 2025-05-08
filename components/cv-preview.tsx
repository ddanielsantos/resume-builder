"use client"

import { Briefcase, GraduationCap, Mail, MapPin, Phone, Globe, Github, Linkedin, Code, Languages } from "lucide-react"

export function CvPreview({ data, highlightedSkills = [] }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-muted-foreground">Fill in your information to see the preview</p>
      </div>
    )
  }

  return (
    <div className="font-sans text-sm leading-relaxed">
      {/* Header */}
      <header className="mb-6">
        <h1 className="text-2xl font-bold">{data.personal.name || "Your Name"}</h1>
        <p className="text-lg text-muted-foreground">{data.personal.title || "Professional Title"}</p>

        <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
          {data.personal.email && (
            <div className="flex items-center gap-1">
              <Mail size={14} />
              <span>{data.personal.email}</span>
            </div>
          )}

          {data.personal.phone && (
            <div className="flex items-center gap-1">
              <Phone size={14} />
              <span>{data.personal.phone}</span>
            </div>
          )}

          {data.personal.location && (
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{data.personal.location}</span>
            </div>
          )}

          {data.personal.website && (
            <div className="flex items-center gap-1">
              <Globe size={14} />
              <span>{data.personal.website}</span>
            </div>
          )}

          {data.personal.github && (
            <div className="flex items-center gap-1">
              <Github size={14} />
              <span>{data.personal.github}</span>
            </div>
          )}

          {data.personal.linkedin && (
            <div className="flex items-center gap-1">
              <Linkedin size={14} />
              <span>{data.personal.linkedin}</span>
            </div>
          )}
        </div>
      </header>

      {/* Summary */}
      {data.personal.summary && (
        <section className="mb-6">
          <p>{data.personal.summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 pb-1 border-b mb-3">
            <Briefcase size={18} />
            Professional Experience
          </h2>

          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{exp.title}</h3>
                  <span className="text-sm text-muted-foreground">
                    {exp.from} - {exp.to}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <p>
                    {exp.company}
                    {exp.location ? `, ${exp.location}` : ""}
                  </p>
                </div>
                {exp.description && <p className="mt-1 text-sm">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 pb-1 border-b mb-3">
            <GraduationCap size={18} />
            Education
          </h2>

          <div className="space-y-4">
            {data.education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium">{edu.degree}</h3>
                  <span className="text-sm text-muted-foreground">
                    {edu.from} - {edu.to}
                  </span>
                </div>
                <p>
                  {edu.institution}
                  {edu.location ? `, ${edu.location}` : ""}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && (
        <section className="mb-6">
          <h2 className="text-lg font-semibold flex items-center gap-2 pb-1 border-b mb-3">
            <Code size={18} />
            Skills
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Technical Skills */}
            {data.skills.technical && data.skills.technical.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Technical Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.technical.map((skill, index) => {
                    const isHighlighted = highlightedSkills?.includes(skill)
                    return (
                      <span
                        key={index}
                        className={`inline-block px-2 py-1 rounded-md text-xs ${
                          isHighlighted ? "bg-primary/20 text-primary font-medium" : "bg-muted"
                        }`}
                      >
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Soft Skills */}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Soft Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {data.skills.soft.map((skill, index) => {
                    const isHighlighted = highlightedSkills?.includes(skill)
                    return (
                      <span
                        key={index}
                        className={`inline-block px-2 py-1 rounded-md text-xs ${
                          isHighlighted ? "bg-primary/20 text-primary font-medium" : "bg-muted"
                        }`}
                      >
                        {skill}
                      </span>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Languages */}
          {data.skills.languages && data.skills.languages.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2 flex items-center gap-1">
                <Languages size={16} />
                Languages
              </h3>
              <p>{data.skills.languages.join(", ")}</p>
            </div>
          )}
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold flex items-center gap-2 pb-1 border-b mb-3">
            <Code size={18} />
            Projects
          </h2>

          <div className="space-y-4">
            {data.projects.map((project, index) => (
              <div key={index}>
                <h3 className="font-medium">{project.name}</h3>
                {project.description && <p className="mt-1 text-sm">{project.description}</p>}
                {project.link && (
                  <a
                    href={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-1 inline-block"
                  >
                    {project.link}
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
