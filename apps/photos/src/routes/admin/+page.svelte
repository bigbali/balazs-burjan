<script lang="ts">
    import { enhance } from '$app/forms';
    import Error from '$lib/component/Error.svelte';
    import Heading from '$lib/component/Heading.svelte';
    import Separator from '$lib/component/Separator.svelte';
    import Button from '$lib/component/Button.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Album from '$lib/component/Album.svelte';
    import Page from '$lib/component/Page.svelte';
    import type { ActionData } from './$types';

    let create = false;
    let awaiting_action = false;

    let thumbnail: FileList | undefined = undefined;
    let images: FileList | undefined = undefined;

    export let data;
    export let form: ActionData;

    $: error = form?.error;

    $: {
        if (form?.success) {
            thumbnail = undefined;
            images = undefined;
        }
    }
</script>

<svelte:head>
    <title>Admin</title>
    <meta name="description" content="Admin" />
</svelte:head>

<Page>
    <Error className="text-[1.5rem] font-medium text-light" condition={error}>
        Album létrehozása sikertelen.
    </Error>
    <Heading>Adminisztráció</Heading>
    <Separator />
    {#if create}
        <section
            class="relative mx-auto border-dark/25 rounded-[1rem] p-[1.5rem] w-fit min-w-[75%] border font-roboto text-dark/80"
        >
            {#if awaiting_action}
                <div
                    class="absolute grid place-items-center inset-0 bg-dark/10 rounded-[1rem]"
                >
                    <p class="text-[2rem]"> Album létrehozása... </p>
                </div>
            {/if}
            <div>
                <form
                    class="flex flex-col gap-[1.5rem]"
                    action="?/create"
                    method="POST"
                    enctype="multipart/form-data"
                    use:enhance={() => {
                        awaiting_action = true;

                        return async ({ update }) => {
                            awaiting_action = false;

                            update();
                        };
                    }}
                >
                    <div
                        class="flex flex-col lg:flex-row justify-between gap-[1rem]"
                    >
                        <Wrap class="flex-1">
                            <label class="text-[1.25rem]">
                                <p>Album címe</p>
                                <input
                                    class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                                    placeholder="Cím"
                                    name="title"
                                    type="text"
                                    required
                                />
                            </label>
                        </Wrap>
                        <Wrap class="flex-1">
                            <label class="text-[1.25rem]">
                                <p>URL azonosító</p>
                                <input
                                    class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                                    placeholder="album-azonosito"
                                    name="slug"
                                    type="text"
                                    required
                                />
                            </label>
                        </Wrap>
                    </div>
                    <Wrap>
                        <label class="text-[1.25rem]">
                            <p>Leírás</p>
                            <textarea
                                class="border border-dark/25 py-1 px-2 rounded-[0.5rem] max-w-full"
                                placeholder="Lorem ipsum, dolor sit amet..."
                                rows="5"
                                name="description"
                            />
                        </label>
                    </Wrap>
                    <Wrap>
                        <label class="text-[1.25rem]">
                            <p>Elrejtés</p>
                            <input
                                class="border border-dark/25 p-2 w-[1.5rem] h-[1.5rem] self-start"
                                name="hidden"
                                type="checkbox"
                                value="hidden"
                                checked
                            />
                        </label>
                    </Wrap>
                    <div
                        class="flex flex-col justify-between flex-grow gap-[1rem]"
                    >
                        <div class="flex">
                            <div>
                                <label
                                    class="text-[1.25rem] bg-light text-dark border-dark hover:bg-dark hover:text-light text-center rounded-[0.8rem] border transition-colors py-2 px-6"
                                    for="thumbnail"
                                >
                                    <input
                                        class="hidden"
                                        name="thumbnail"
                                        id="thumbnail"
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        bind:files={thumbnail}
                                    />
                                    Borító feltöltése
                                </label>
                            </div>
                            {#if thumbnail}
                                <p
                                    class="c-monospace p-[0.5rem] text-[1.25rem] font-medium"
                                >
                                    {thumbnail[0].name}
                                </p>
                            {/if}
                        </div>
                        <div class="flex">
                            <div>
                                <label
                                    class="text-[1.25rem] bg-light text-dark border-dark hover:bg-dark hover:text-light text-center rounded-[0.8rem] border transition-colors py-2 px-6"
                                    for="images"
                                >
                                    <input
                                        class="hidden"
                                        name="images"
                                        id="images"
                                        type="file"
                                        accept=".jpg, .jpeg, .png"
                                        multiple
                                        bind:files={images}
                                    />
                                    Fotók feltöltése
                                </label>
                            </div>
                            {#if images}
                                <div
                                    class="c-monospace flex flex-col gap-[0.25rem] p-[0.5rem]"
                                >
                                    <p class="text-[1.25rem] font-bold">
                                        {images.length} kiválasztott fotó:
                                    </p>
                                    <ul
                                        class="flex flex-col gap-[0.25rem] text-[1rem]"
                                    >
                                        {#each images as image}
                                            <li>
                                                {image.name}
                                            </li>
                                        {/each}
                                    </ul>
                                </div>
                            {/if}
                        </div>
                    </div>
                    <div class="flex gap-[1rem]">
                        <Button
                            class="!text-[1.5rem] flex-1"
                            type="submit"
                            color="green"
                        >
                            Mentés
                        </Button>
                        <Button
                            class="!text-[1.5rem] flex-1"
                            color="red"
                            on:click={(e) => {
                                e.preventDefault();
                                thumbnail = undefined;
                                images = undefined;
                                create = false;
                            }}
                        >
                            Elvetés
                        </Button>
                    </div>
                </form>
            </div>
        </section>
    {/if}
    <section>
        {#if !create}
            <div class="text-center mb-[2rem]">
                <Button on:click={() => (create = true)}>
                    Új album létrehozása
                </Button>
            </div>
        {/if}
        {#if data.albums.length === 0}
            <p class="text-[1.25rem] my-4">Nincsenek elérhető albumok.</p>
        {:else}
            <div class="c-cards grid gap-8 py-[2rem]">
                {#each data.albums as album}
                    <Album {album} is_admin />
                {/each}
            </div>
        {/if}
    </section>
</Page>

<style>
    input::placeholder,
    textarea::placeholder {
        font-weight: 300;
    }
    label {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        cursor: pointer;
    }

    .c-cards {
        grid-template-columns: repeat(5, 1fr);
    }

    @media (max-width: 1900px) {
        .c-cards {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 1600px) {
        .c-cards {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 1024px) {
        .c-cards {
            grid-template-columns: repeat(2, 1fr);
        }
    }

    @media (max-width: 768px) {
        .c-cards {
            grid-template-columns: 1fr;
        }
    }

    .c-monospace {
        font-family: monospace;
    }
</style>
