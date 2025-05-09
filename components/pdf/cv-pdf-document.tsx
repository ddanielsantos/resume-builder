import { Document, Page, Text, View, StyleSheet, Font, Link } from "@react-pdf/renderer"

// Register fonts (optional - you can use default fonts too)
Font.register({
  family: "Open Sans",
  fonts: [
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-regular.ttf" },
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-600.ttf", fontWeight: 600 },
    { src: "https://cdn.jsdelivr.net/npm/open-sans-all@0.1.3/fonts/open-sans-700.ttf", fontWeight: 700 },
  ],
})

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: "Open Sans",
    fontSize: 10,
    color: "#333",
  },
  header: {
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  title: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  contactInfo: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
    marginBottom: 5,
  },
  contactText: {
    marginLeft: 5,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  entryTitle: {
    fontWeight: "bold",
    marginBottom: 3,
  },
  entrySubtitle: {
    marginBottom: 3,
  },
  entryDate: {
    color: "#666",
    fontSize: 9,
  },
  entryDescription: {
    marginTop: 5,
    fontSize: 9,
    lineHeight: 1.5,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 5,
  },
  skill: {
    backgroundColor: "#f1f1f1",
    padding: "3 6",
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
  },
  highlightedSkill: {
    backgroundColor: "#e6f7ff",
    padding: "3 6",
    borderRadius: 3,
    marginRight: 5,
    marginBottom: 5,
    color: "#0070f3",
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginBottom: 10,
  },
  col: {
    flex: 1,
    paddingRight: 10,
  },
  link: {
    color: "#0070f3",
    textDecoration: "none",
  },
})

// PDF Document Component
export const CvPdfDocument = ({ data, highlightedSkills = [] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personal.name || "Your Name"}</Text>
        <Text style={styles.title}>{data.personal.title || "Professional Title"}</Text>

        <View style={styles.contactInfo}>
          {data.personal.email && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{data.personal.email}</Text>
            </View>
          )}

          {data.personal.phone && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{data.personal.phone}</Text>
            </View>
          )}

          {data.personal.location && (
            <View style={styles.contactItem}>
              <Text style={styles.contactText}>{data.personal.location}</Text>
            </View>
          )}
        </View>

        <View style={styles.contactInfo}>
          {data.personal.website && (
            <View style={styles.contactItem}>
              <Link src={`https://${data.personal.website}`} style={styles.link}>
                {data.personal.website}
              </Link>
            </View>
          )}

          {data.personal.github && (
            <View style={styles.contactItem}>
              <Link src={`https://${data.personal.github}`} style={styles.link}>
                {data.personal.github}
              </Link>
            </View>
          )}

          {data.personal.linkedin && (
            <View style={styles.contactItem}>
              <Link src={`https://${data.personal.linkedin}`} style={styles.link}>
                {data.personal.linkedin}
              </Link>
            </View>
          )}
        </View>
      </View>

      {/* Summary */}
      {data.personal.summary && (
        <View style={styles.section}>
          <Text>{data.personal.summary}</Text>
        </View>
      )}

      {/* Experience */}
      {data.experience && data.experience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Experience</Text>

          {data.experience.map((exp, index) => (
            <View key={index} style={{ marginBottom: index < data.experience.length - 1 ? 10 : 0 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.entryTitle}>{exp.title}</Text>
                <Text style={styles.entryDate}>
                  {exp.from} - {exp.to}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>
                {exp.company}
                {exp.location ? `, ${exp.location}` : ""}
              </Text>
              {exp.description && <Text style={styles.entryDescription}>{exp.description}</Text>}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>

          {data.education.map((edu, index) => (
            <View key={index} style={{ marginBottom: index < data.education.length - 1 ? 10 : 0 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={styles.entryTitle}>{edu.degree}</Text>
                <Text style={styles.entryDate}>
                  {edu.from} - {edu.to}
                </Text>
              </View>
              <Text style={styles.entrySubtitle}>
                {edu.institution}
                {edu.location ? `, ${edu.location}` : ""}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Skills */}
      {data.skills && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>

          <View style={styles.row}>
            {/* Technical Skills */}
            {data.skills.technical && data.skills.technical.length > 0 && (
              <View style={styles.col}>
                <Text style={styles.entryTitle}>Technical Skills</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.technical.map((skill, index) => {
                    const isHighlighted = highlightedSkills?.includes(skill)
                    return (
                      <Text key={index} style={isHighlighted ? styles.highlightedSkill : styles.skill}>
                        {skill}
                      </Text>
                    )
                  })}
                </View>
              </View>
            )}

            {/* Soft Skills */}
            {data.skills.soft && data.skills.soft.length > 0 && (
              <View style={styles.col}>
                <Text style={styles.entryTitle}>Soft Skills</Text>
                <View style={styles.skillsContainer}>
                  {data.skills.soft.map((skill, index) => {
                    const isHighlighted = highlightedSkills?.includes(skill)
                    return (
                      <Text key={index} style={isHighlighted ? styles.highlightedSkill : styles.skill}>
                        {skill}
                      </Text>
                    )
                  })}
                </View>
              </View>
            )}
          </View>

          {/* Languages */}
          {data.skills.languages && data.skills.languages.length > 0 && (
            <View style={{ marginTop: 10 }}>
              <Text style={styles.entryTitle}>Languages</Text>
              <Text>{data.skills.languages.join(", ")}</Text>
            </View>
          )}
        </View>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Projects</Text>

          {data.projects.map((project, index) => (
            <View key={index} style={{ marginBottom: index < data.projects.length - 1 ? 10 : 0 }}>
              <Text style={styles.entryTitle}>{project.name}</Text>
              {project.description && <Text style={styles.entryDescription}>{project.description}</Text>}
              {project.link && (
                <Link
                  src={project.link.startsWith("http") ? project.link : `https://${project.link}`}
                  style={styles.link}
                >
                  {project.link}
                </Link>
              )}
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
)
