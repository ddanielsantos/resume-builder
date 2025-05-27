import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

const personalInfoSchema = z.object({
    name: z.string().min(1, "Name is required"),
    title: z.string().min(1, "Title is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().optional(),
    location: z.string().optional(),
    website: z.string().url("Invalid URL").optional(),
    github: z.string().url("Invalid URL").optional(),
    linkedin: z.string().url("Invalid URL").optional(),
    summary: z.string().optional(),
});
export type PersonalInfo = z.infer<typeof personalInfoSchema>;
export const personalInfoResolver = zodResolver(personalInfoSchema);

const projectsSchema = z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().url("Invalid URL format").optional(),
}));
export type ProjectList = z.infer<typeof projectsSchema>;
export const projectsResolver = zodResolver(z.object({
    projects: projectsSchema,
}));

export const educationSchema = z.object({
    degree: z.string().min(1, "Degree/Certificate is required"),
    institution: z.string().min(1, "Institution is required"),
    location: z.string().min(1, "Location is required"),
    from: z.string().min(1, "From year is required"),
    to: z.string().optional(),
}).array();
export type EducationList = z.infer<typeof educationSchema>;
export const educationResolver = zodResolver(z.object({
    education: educationSchema,
}));

const experienceSchema = z.array(z.object({
    title: z.string().min(1, "Title is required"),
    company: z.string().min(1, "Company is required"),
    location: z.string().optional(),
    from: z.string().optional(),
    to: z.string().optional(),
    description: z.string().optional(),
}));
export type ExperienceList = z.infer<typeof experienceSchema>;
export const experienceResolver = zodResolver(z.object({
    experience: experienceSchema,
}));

const softSkillsSchema = z.array(z.object({
    skill: z.string().min(1, "Soft skill cannot be empty"),
}));
export type SoftSkillsList = z.infer<typeof softSkillsSchema>;
export const softSkillsResolver = zodResolver(z.object({
    soft: softSkillsSchema,
}));

const technicalSkillsSchema = z.array(z.object({
    skill: z.string().min(1, "Technical skill cannot be empty")
}));
export type TechnicalSkillsList = z.infer<typeof technicalSkillsSchema>;
export const technicalSkillsResolver = zodResolver(z.object({
    technical: technicalSkillsSchema,
}));

const languagesSchema = z.array(z.object({
    language: z.string().min(1, "Language cannot be empty")
}));
export type LanguagesList = z.infer<typeof languagesSchema>;
export const languagesResolver = zodResolver(z.object({
    language: languagesSchema,
}));

// Define the schema for the CV data
export const cvDataSchema = z.object({
    personal: personalInfoSchema,
    projects: projectsSchema,
    education: educationSchema,
    experience: experienceSchema,
    softSkills: softSkillsSchema,
    technicalSkills: technicalSkillsSchema,
    languages: languagesSchema,
})
export type CvData = z.infer<typeof cvDataSchema>
export type CvDataKeys = keyof CvData

// Define the schema for the tailor CV response
export const tailorCVResponseSchema = z.object({
    tailoredCV: cvDataSchema,
    highlightedSkills: z.array(z.string()),
    suggestedImprovements: z.array(z.string()),
})
export type TailorCVResponse = z.infer<typeof tailorCVResponseSchema>

// Define the schema for the tailor CV request
export const tailorCvRequestSchema = z.object({
    cvID: z.string().min(1, "CV is required"),
    jobTitle: z.string().min(1, "Job title is required"),
    company: z.string().min(1, "Company name is required"),
    jobDescription: z.string().min(1, "Job description is required"),
});
export type TailorCVRequest = z.infer<typeof tailorCvRequestSchema>

// Define the schema for the tailor CV form
export const tailorCVFormSchema = tailorCvRequestSchema.omit({ cvID: true })
export type TailorCVForm = z.infer<typeof tailorCVFormSchema>