"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Card, CardContent} from "@/components/ui/card"
import {Plus, Trash2} from "lucide-react"
import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod"
import {useFieldArray, useForm} from "react-hook-form"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"

export const educationSchema = z.array(z.object({
    degree: z.string().min(1, "Degree/Certificate is required"),
    institution: z.string().min(1, "Institution is required"),
    location: z.string().min(1, "Location is required"),
    from: z.string().min(1, "From year is required"),
    to: z.string().optional(),
}));

export type EducationList = z.infer<typeof educationSchema>;

type Props = {
    data: EducationList
    updateData: (data: EducationList) => void
}

export function EducationForm({data, updateData}: Props) {
    const form = useForm<{ list: EducationList }>({
        resolver: zodResolver(educationSchema),
        defaultValues: { list: data },
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "list",
    });

    const onSubmit = (data: EducationList) => {
        updateData(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(({list}) => onSubmit(list))} className="space-y-6">
                {fields.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No education entries yet</p>
                        <Button type="button" onClick={() => append({ degree: "", institution: "", location: "", from: "", to: "" })} className="gap-2">
                            <Plus size={16}/> Add Education
                        </Button>
                    </div>
                ) : (
                    <>
                        {fields.map((field, index) => (
                            <Card key={field.id}>
                                <CardContent className="pt-6">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.degree`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Degree/Certificate</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="B.S. Computer Science" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.institution`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Institution</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="University of California, Berkeley" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-3 mt-4">
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.location`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Berkeley, CA" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.from`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>From Year</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="2018" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.to`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>To Year</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="2022 (or Present)" />
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
                            <Button type="button" variant="outline" onClick={() => append({ degree: "", institution: "", location: "", from: "", to: "" })} className="gap-2">
                                <Plus size={16}/> Add Another Education
                            </Button>
                            <Button type="submit">Save Education</Button>
                        </div>
                    </>
                )}
            </form>
        </Form>
    );
}
