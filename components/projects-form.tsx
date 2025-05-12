"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent} from "@/components/ui/card"
import {Plus, Trash2} from "lucide-react"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";

export const projectsSchema = z.array(z.object({
    name: z.string().min(1, "Project name is required"),
    description: z.string().min(1, "Description is required"),
    link: z.string().url("Invalid URL format").optional(),
}));

export type ProjectList = z.infer<typeof projectsSchema>;

type Props = {
    data: ProjectList
    updateData: (data: ProjectList) => void
}

export function ProjectsForm({data, updateData}: Props) {
    const form = useForm<{ list: ProjectList }>({
        resolver: zodResolver(projectsSchema),
        defaultValues: { list: data },
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "list",
    });

    const onSubmit = (data: ProjectList) => {
        updateData(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(({list}) => onSubmit(list))} className="space-y-6">
                {fields.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No projects added yet</p>
                        <Button type="button" onClick={() => append({ name: "", description: "", link: "" })} className="gap-2">
                            <Plus size={16}/> Add Project
                        </Button>
                    </div>
                ) : (
                    <>
                        {fields.map((field, index) => (
                            <Card key={field.id}>
                                <CardContent className="pt-6">
                                    <div className="space-y-4">
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.name`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Project Name</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="E-commerce Platform" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.description`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Description</FormLabel>
                                                    <FormControl>
                                                        <Textarea {...field} placeholder="Describe the project, technologies used, and your role..." className="min-h-[100px]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.link`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Project Link</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="github.com/username/project" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="mt-4 flex justify-end">
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="gap-2"
                                        >
                                            <Trash2 size={16}/> Remove
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}

                        <div className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => append({ name: "", description: "", link: "" })} className="gap-2">
                                <Plus size={16}/> Add Another Project
                            </Button>
                            <Button type="submit">Save Projects</Button>
                        </div>
                    </>
                )}
            </form>
        </Form>
    );
}
