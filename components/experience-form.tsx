"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Card, CardContent} from "@/components/ui/card"
import {Plus, Trash2} from "lucide-react"
import {useFieldArray, useForm} from "react-hook-form"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import {ExperienceList, experienceResolver} from "@/lib/cv"

type Props = {
    data: ExperienceList
    updateData: (data: ExperienceList) => void
}

export function ExperienceForm({data, updateData}: Props) {
    const form = useForm<{ list: ExperienceList }>({
        resolver: experienceResolver,
        defaultValues: { list: data },
    });

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "list",
    });

    const onSubmit = (data: ExperienceList) => {
        updateData(data);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(({list}) => onSubmit(list))} className="space-y-6">
                {fields.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-muted-foreground mb-4">No experience entries yet</p>
                        <Button type="button" onClick={() => append({
                            title: "",
                            company: "",
                            location: "",
                            from: "",
                            to: "",
                            description: ""
                        })} className="gap-2">
                            <Plus size={16}/> Add Experience
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
                                            name={`list.${index}.title`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Job Title</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Software Engineer"/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.company`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>Company</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Tech Solutions Inc."/>
                                                    </FormControl>
                                                    <FormMessage/>
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
                                                        <Input {...field} placeholder="San Francisco, CA"/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.from`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>From</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Jan 2020"/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`list.${index}.to`}
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel>To</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} placeholder="Present"/>
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name={`list.${index}.description`}
                                        render={({field}) => (
                                            <FormItem className="mt-4">
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea {...field}
                                                              placeholder="Describe your responsibilities and achievements..."
                                                              className="min-h-[100px]"/>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

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
                            <Button type="button" variant="outline" onClick={() => append({
                                title: "",
                                company: "",
                                location: "",
                                from: "",
                                to: "",
                                description: ""
                            })} className="gap-2">
                                <Plus size={16}/> Add Another Experience
                            </Button>
                            <Button type="submit">Save Experience</Button>
                        </div>
                    </>
                )}
            </form>
        </Form>
    );
}
