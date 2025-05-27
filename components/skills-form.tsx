"use client"

import {Button} from "@/components/ui/button"
import {Plus, X} from "lucide-react"
import {useFieldArray, useForm} from "react-hook-form"
import {Form, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import { InputItem } from "@/components/InputItem"
import {SoftSkillsList, softSkillsResolver} from "@/lib/cv";


type SoftSkillsForm = {
    data: SoftSkillsList
    updateData: (data: SoftSkillsList) => void
}

export function SoftSkillsForm({data, updateData}: SoftSkillsForm) {
    const form = useForm<{skill: SoftSkillsList}>({
        resolver: softSkillsResolver,
        defaultValues: {skill: data},
    });

    const onSubmit = ({skill}: {skill: SoftSkillsList}) => {
        updateData(skill);
    };

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "skill",
    });

    const { handleSubmit } = form

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name={`skill`}
                    render={({ _ }) => (
                        <FormItem>
                            <FormLabel>Soft Skills</FormLabel>
                            {fields.map((f, i) => (
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge key={i} variant="secondary" className="gap-1 px-3 py-1.5">
                                        <button
                                            type="button"
                                            onClick={() => remove(i)}
                                            className="ml-1 rounded-full hover:bg-muted"
                                        >
                                            <X size={14} />
                                            <span className="sr-only">Remove</span>
                                        </button>
                                        {f.skill}
                                    </Badge>
                                </div>
                            )) }

                            <div className="flex gap-2">
                                <InputItem append={append} placeholder={"Add a soft skill (e.g., Leadership, Communication)"}/>
                                <Button type="button" variant="outline" onClick={() => append({ skill: "" })}>
                                    <Plus size={16}/>Add
                                </Button>
                            </div>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save Skills</Button>
            </form>
        </Form>
    );
}
