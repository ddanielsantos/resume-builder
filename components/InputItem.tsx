import {Input} from "@/components/ui/input";
import {FormControl} from "@/components/ui/form";

type Props = {
    append: (value: { skill: string }) => void;
    placeholder: string;
}

export const InputItem = (props: Props) => {
    return <FormControl>
        <Input
            placeholder={props.placeholder}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    const input = document.querySelector<HTMLInputElement>(
                        `input[placeholder*="skill"]`
                    );

                    props.append({ skill: e.currentTarget.value });
                    if (input) {
                        input.value = ""
                    }
                }
            }}
        />
    </FormControl>
}