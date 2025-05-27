import {TechnicalSkillsList, technicalSkillsResolver} from "@/lib/cv";
import {useFieldArray, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {Badge} from "@/components/ui/badge";
import {Plus, X} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {InputItem} from "@/components/InputItem";

type TechnicalSkillsForm = {
    data: TechnicalSkillsList
    updateData: (data: TechnicalSkillsList) => void
}

export function TechnicalSkillsForm({data, updateData}: TechnicalSkillsForm) {
    const form = useForm<{tech: TechnicalSkillsList}>({
        resolver: technicalSkillsResolver,
        defaultValues: {tech: data},
    });

    const onSubmit = ({tech}: {tech: TechnicalSkillsList}) => {
        updateData(tech);
    };

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "tech",
    });

    const { handleSubmit } = form

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name={`tech`}
                    render={(_) => (
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
                                <InputItem append={append} placeholder={"Add a tech skill (e.g., Python, Javascript)"}/>
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
