<script lang="ts">
    import type { CreateImageForm, Image } from '$lib/type';
    import { transition } from '$lib/apihelper';
    import Button from './Button.svelte';
    import Heading from './Heading.svelte';
    import Suspense from './Suspense.svelte';
    import Wrap from './Wrap.svelte';

    export let imageForm: CreateImageForm;
    export let oncreate: (e: Event) => any;

    let [pending, suspend] = transition();
</script>

<Suspense pending={$pending}>
    <Wrap class="flex flex-col gap-[1rem]">
        <Heading level={2}>
            <span class="font-roboto sm:text-[1.75rem]">
                Új kép feltöltése
            </span>
        </Heading>
        <form
            class="font-roboto flex flex-col gap-[1rem]"
            on:submit|preventDefault={(e) => suspend(oncreate(e))}
        >
            <label>
                Kép
                <input
                    name="image"
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] block w-full"
                    bind:files={imageForm.image}
                />
            </label>
            <label>
                Cím
                <input
                    name="title"
                    type="text"
                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] block w-full"
                    bind:value={imageForm.title}
                />
            </label>
            <label>
                Leírás
                <textarea
                    name="description"
                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] block w-full"
                    bind:value={imageForm.description}
                />
            </label>
            <Button color="green" class="w-fit !text-[1.55rem]">
                Feltöltés
            </Button>
        </form>
    </Wrap>
</Suspense>
