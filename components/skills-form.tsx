"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {X} from "lucide-react"
import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"

export const skillsSchema = z.object({
    technical: z.array(z.string().min(1, "Skill cannot be empty")).optional(),
    soft: z.array(z.string().min(1, "Skill cannot be empty")).optional(),
    languages: z.array(z.string().min(1, "Language cannot be empty")).optional(),
});

export type Skills = z.infer<typeof skillsSchema>;

type Props = {
    data: Skills
    updateData: (data: Skills) => void
}

export function SkillsForm({data, updateData}: Props) {
    const form = useForm<Skills>({
        resolver: zodResolver(skillsSchema),
        defaultValues: data,
    });

    const onSubmit = (data: Skills) => {
        updateData(data);
    };

    const removeSkill = (field: keyof Skills, index: number) => {
        const updatedField = form.getValues(field)?.filter((_, i) => i !== index) || [];
        form.setValue(field, updatedField);
    };

    const addSkill = (field: keyof Skills, value: string) => {
        if (value.trim()) {
            const updatedField = [...(form.getValues(field) || []), value.trim()];
            form.setValue(field, updatedField);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {["technical", "soft", "languages"].map((field) => (
                    <FormField
                        key={field}
                        control={form.control}
                        name={field as keyof Skills}
                        render={({ field: { value, onChange } }) => (
                            <FormItem>
                                <FormLabel>
                                    {field === "technical" && "Technical Skills"}
                                    {field === "soft" && "Soft Skills"}
                                    {field === "languages" && "Languages"}
                                </FormLabel>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {(value || []).map((skill: string, index: number) => (
                                        <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
                                            {skill}
                                            <button
                                                type="button"
                                                onClick={() => removeSkill(field as keyof Skills, index)}
                                                className="ml-1 rounded-full hover:bg-muted"
                                            >
                                                <X size={14} />
                                                <span className="sr-only">Remove</span>
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input
                                            placeholder={
                                                field === "technical"
                                                    ? "Add a technical skill (e.g., JavaScript, React, AWS)"
                                                    : field === "soft"
                                                    ? "Add a soft skill (e.g., Leadership, Communication)"
                                                    : "Add a language (e.g., English (Native), Spanish (Intermediate))"
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    addSkill(field as keyof Skills, e.currentTarget.value);
                                                    e.currentTarget.value = "";
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <Button
                                        type="button"
                                        onClick={() => {
                                            const input = document.querySelector<HTMLInputElement>(
                                                `input[placeholder*="${field === "technical" ? "technical" : field === "soft" ? "soft" : "language"}"]`
                                            );
                                            if (input) {
                                                addSkill(field as keyof Skills, input.value);
                                                input.value = "";
                                            }
                                        }}
                                    >
                                        Add
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button type="submit">Save Skills</Button>
            </form>
        </Form>
    );
}
