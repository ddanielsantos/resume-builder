"use client"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Badge} from "@/components/ui/badge"
import {Plus, X} from "lucide-react"
import {useFieldArray, useForm} from "react-hook-form"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form"
import {LanguagesList, languagesResolver} from "@/lib/cv";


type LanguagesFormProp = {
    data: LanguagesList
    updateData: (data: LanguagesList) => void
}

export function LanguagesForm({data, updateData}: LanguagesFormProp) {
    const form = useForm<{language: LanguagesList}>({
        resolver: languagesResolver,
        defaultValues: {language: data},
    });

    const onSubmit = ({language}: {language: LanguagesList}) => {
        updateData(language);
    };

    const {fields, append, remove} = useFieldArray({
        control: form.control,
        name: "language",
    });

    const { handleSubmit } = form

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {fields.map((_, index) => (
                    <FormField
                        key={_.id}
                        control={form.control}
                        name={`language.${index}`}
                        render={({ field: { value } }) => (
                            <FormItem>
                                <FormLabel>Languages</FormLabel>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    <Badge key={index} variant="secondary" className="gap-1 px-3 py-1.5">
                                        {value.language}
                                        <button
                                            type="button"
                                            onClick={() => remove(index)}
                                            className="ml-1 rounded-full hover:bg-muted"
                                        >
                                            <X size={14} />
                                            <span className="sr-only">Remove</span>
                                        </button>
                                    </Badge>
                                </div>
                                <div className="flex gap-2">
                                    <FormControl>
                                        <Input
                                            placeholder={"Add a language (e.g., Portuguese, English, Spanish)"}
                                            onKeyDown={(e) => {
                                                const input = document.querySelector<HTMLInputElement>(
                                                    `input[placeholder*="language"]`
                                                );

                                                if (e.key === "Enter") {
                                                    append({ language: e.currentTarget.value });
                                                    if (input) {
                                                        input.value = ""
                                                    }
                                                }
                                            }}
                                        />
                                    </FormControl>
                                    <Button type="button" variant="outline" onClick={() => append({ language: "" })}>
                                        <Plus size={16}/>Add
                                    </Button>
                                </div>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <Button type="submit">save languages</Button>
            </form>
        </Form>
    );
}
