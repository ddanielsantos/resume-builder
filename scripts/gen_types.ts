// @ts-nocheck

import { $ } from "bun";

try {
    const content = await $`bunx supabase gen types --project-id bmisvzerbbwhhjxrcweh`.text();

    const outputPath = "supabase/types/supabase.ts";

    await $`mkdir -p supabase/types`;

    await $`echo ${content} > ${outputPath}`;
    console.log(`Types generated successfully and saved to ${outputPath}`);
} catch (error) {
    console.error("Error generating types:", error);
    process.exit(1);
}
