CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();


create table "public"."cvs" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "title" text not null,
    "is_default" boolean default false,
    "data" jsonb not null
);


alter table "public"."cvs" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone default now(),
    "username" text,
    "full_name" text,
    "avatar_url" text
);


alter table "public"."profiles" enable row level security;

create table "public"."tailored_cvs" (
    "id" uuid not null default uuid_generate_v4(),
    "cv_id" uuid not null,
    "user_id" uuid not null,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "job_title" text,
    "company" text,
    "job_description" text,
    "tailored_data" jsonb not null
);


alter table "public"."tailored_cvs" enable row level security;

CREATE UNIQUE INDEX cvs_pkey ON public.cvs USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX tailored_cvs_pkey ON public.tailored_cvs USING btree (id);

alter table "public"."cvs" add constraint "cvs_pkey" PRIMARY KEY using index "cvs_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."tailored_cvs" add constraint "tailored_cvs_pkey" PRIMARY KEY using index "tailored_cvs_pkey";

alter table "public"."cvs" add constraint "cvs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."cvs" validate constraint "cvs_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."tailored_cvs" add constraint "tailored_cvs_cv_id_fkey" FOREIGN KEY (cv_id) REFERENCES cvs(id) not valid;

alter table "public"."tailored_cvs" validate constraint "tailored_cvs_cv_id_fkey";

alter table "public"."tailored_cvs" add constraint "tailored_cvs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."tailored_cvs" validate constraint "tailored_cvs_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, username)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'preferred_username'
  );
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."cvs" to "anon";

grant insert on table "public"."cvs" to "anon";

grant references on table "public"."cvs" to "anon";

grant select on table "public"."cvs" to "anon";

grant trigger on table "public"."cvs" to "anon";

grant truncate on table "public"."cvs" to "anon";

grant update on table "public"."cvs" to "anon";

grant delete on table "public"."cvs" to "authenticated";

grant insert on table "public"."cvs" to "authenticated";

grant references on table "public"."cvs" to "authenticated";

grant select on table "public"."cvs" to "authenticated";

grant trigger on table "public"."cvs" to "authenticated";

grant truncate on table "public"."cvs" to "authenticated";

grant update on table "public"."cvs" to "authenticated";

grant delete on table "public"."cvs" to "service_role";

grant insert on table "public"."cvs" to "service_role";

grant references on table "public"."cvs" to "service_role";

grant select on table "public"."cvs" to "service_role";

grant trigger on table "public"."cvs" to "service_role";

grant truncate on table "public"."cvs" to "service_role";

grant update on table "public"."cvs" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."tailored_cvs" to "anon";

grant insert on table "public"."tailored_cvs" to "anon";

grant references on table "public"."tailored_cvs" to "anon";

grant select on table "public"."tailored_cvs" to "anon";

grant trigger on table "public"."tailored_cvs" to "anon";

grant truncate on table "public"."tailored_cvs" to "anon";

grant update on table "public"."tailored_cvs" to "anon";

grant delete on table "public"."tailored_cvs" to "authenticated";

grant insert on table "public"."tailored_cvs" to "authenticated";

grant references on table "public"."tailored_cvs" to "authenticated";

grant select on table "public"."tailored_cvs" to "authenticated";

grant trigger on table "public"."tailored_cvs" to "authenticated";

grant truncate on table "public"."tailored_cvs" to "authenticated";

grant update on table "public"."tailored_cvs" to "authenticated";

grant delete on table "public"."tailored_cvs" to "service_role";

grant insert on table "public"."tailored_cvs" to "service_role";

grant references on table "public"."tailored_cvs" to "service_role";

grant select on table "public"."tailored_cvs" to "service_role";

grant trigger on table "public"."tailored_cvs" to "service_role";

grant truncate on table "public"."tailored_cvs" to "service_role";

grant update on table "public"."tailored_cvs" to "service_role";

create policy "Users can delete their own CVs"
on "public"."cvs"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own CVs"
on "public"."cvs"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own CVs"
on "public"."cvs"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own CVs"
on "public"."cvs"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile."
on "public"."profiles"
as permissive
for insert
to public
with check ((auth.uid() = id));


create policy "Users can update their own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Users can delete their own tailored CVs"
on "public"."tailored_cvs"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can insert their own tailored CVs"
on "public"."tailored_cvs"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Users can update their own tailored CVs"
on "public"."tailored_cvs"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Users can view their own tailored CVs"
on "public"."tailored_cvs"
as permissive
for select
to public
using ((auth.uid() = user_id));



