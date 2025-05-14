import {z} from "zod";
import {personalInfoSchema} from "@/components/personal-info-form";
import {projectsSchema} from "@/components/projects-form";
import {educationSchema} from "@/components/education-form";
import {experienceSchema} from "@/components/experience-form";
import {skillsSchema} from "@/components/skills-form";

// Define the schema for the CV data
export const cvDataSchema = z.object({
    personal: personalInfoSchema,
    projects: projectsSchema,
    education: educationSchema,
    experience: experienceSchema,
    skills: skillsSchema,
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