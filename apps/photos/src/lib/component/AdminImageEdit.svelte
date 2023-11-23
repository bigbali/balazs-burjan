<script lang="ts">
    import { transition } from '$lib/util/apihelper';
    import Button from './Button.svelte';
    import Suspense from './Suspense.svelte';
    import Wrap from './Wrap.svelte';
    import type { Image } from '$lib/type';
    import type { ImageEditParams } from '$lib/api/image';

    export let image: Image;
    export let ondelete: (id: number) => any;
    export let onedit: (params: ImageEditParams<'client'>) => any;

    // can't be null, but undefined is welcome
    let title = image.title ?? undefined;
    let description = image.description ?? undefined;

    let [pending, suspend] = transition();
</script>

<Suspense pending={$pending}>
    <Wrap>
        <div class="flex flex-col lg:flex-row gap-[1rem]">
            <img
                class="w-[20rem] h-[20rem] object-cover"
                src={image.source}
                alt={image.title}
            />
            <div class="flex flex-col flex-1 gap-[1rem]">
                <form class="flex gap-[2rem] w-full h-full">
                    <div class="flex flex-1 flex-col gap-[1rem]">
                        <label class="flex flex-col gap-[1rem]">
                            Cím
                            {#if image.title}
                                <p class="text-dark/50 font-medium pl-[0.5rem]">
                                    {image.title}
                                </p>
                            {/if}
                            <input
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                type="text"
                                name="title"
                                bind:value={title}
                            />
                        </label>
                        <label class="flex flex-col gap-[1rem] flex-1">
                            Leírás
                            {#if image.description}
                                <p class="text-dark/50 font-medium pl-[0.5rem]">
                                    {image.description}
                                </p>
                            {/if}
                            <textarea
                                class="flex-1 border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                name="description"
                                bind:value={description}
                            />
                        </label>
                    </div>
                </form>
                <div class="flex gap-[1rem]">
                    <Button
                        on:click={() =>
                            suspend(
                                onedit({ id: image.id, title, description })
                            )}
                        color="green"
                        class="!text-[1.5rem]"
                    >
                        Mentés
                    </Button>
                    <Button
                        on:click={() => suspend(ondelete(image.id))}
                        color="red"
                        class="!text-[1.5rem]"
                    >
                        Törlés
                    </Button>
                </div>
            </div>
        </div>
    </Wrap>
</Suspense>
