"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {useForm} from "react-hook-form";
import {PersonalInfo, personalInfoResolver} from "@/lib/cv";


type Props = {
    data: PersonalInfo
    updateData: (data: PersonalInfo) => void
}

export function PersonalInfoForm({data, updateData}: Props) {
    const form = useForm<PersonalInfo>({
        resolver: personalInfoResolver,
        defaultValues: data,
    });
    const onSubmit = (data: PersonalInfo) => {
        updateData(data);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Full name</FormLabel>
                                <FormControl><Input placeholder="John Doe" {...field}/></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Professional title</FormLabel>
                                    <FormControl><Input
                                        placeholder="Senior Software Engineer" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl><Input
                                        placeholder="john.doe@example.com" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="phone"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl><Input
                                        placeholder="(123) 456-7890" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="location"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Location</FormLabel>
                                    <FormControl><Input
                                        placeholder="San Francisco, CA" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="website"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl><Input
                                        placeholder="johndoe.dev" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="github"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Github</FormLabel>
                                    <FormControl><Input
                                        placeholder="github.com/johndoe" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                    <div className="space-y-2">
                        <FormField
                            control={form.control}
                            name="linkedin"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Linkedin</FormLabel>
                                    <FormControl><Input
                                        placeholder="linkedin.com/in/johndoe" {...field}/></FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}/>
                    </div>
                </div>

                <div className="space-y-2">
                    <FormField
                        control={form.control}
                        name="summary"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Professional Summary</FormLabel>
                                <FormControl><Textarea
                                    {...field}
                                    placeholder="A brief summary of your professional background and goals..."
                                    className="min-h-[100px]"
                                /></FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}/>
                </div>

                <Button type="submit">Save Personal Information</Button>
            </form>
        </Form>
    )
}
