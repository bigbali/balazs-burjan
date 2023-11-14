<script lang="ts">
    import { enhance } from '$app/forms';
    import Heading from '$lib/component/Heading.svelte';
    import Separator from '$lib/component/Separator.svelte';
    import Button from '$lib/component/Button.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Album from '$lib/component/Album.svelte';
    import Page from '$lib/component/Page.svelte';
    import api from '$lib/client/api';
    import { notify } from '$lib/client/notification';
    import type { CreateAlbumForm } from '$lib/type';

    let create = false;
    let awaiting_action = false;

    const createAlbumForm: CreateAlbumForm = {
        title: '',
        slug: '',
        thumbnail: undefined,
        images: undefined,
        description: undefined,
        date: undefined,
        hidden: false
    };

    export let data;
</script>

<svelte:head>
    <title>Admin</title>
    <meta name="description" content="Admin" />
</svelte:head>

<Page>
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
                    method="POST"
                    action="?/create"
                    enctype="multipart/form-data"
                    use:enhance={async () => {
                        awaiting_action = true;

                        const album = await api.album.create(createAlbumForm);

                        if (album.ok && album.message) {
                            notify({
                                title: 'Album létrehozva',
                                message: album.message,
                                timeout: 7500
                            });
                        } else if (!album.ok) {
                            notify({
                                title: 'Album létrehozása sikertelen',
                                message: album.message,
                                timeout: 7500
                            });
                        }

                        return async ({ update }) => {
                            awaiting_action = false;
                            await update();
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
                                    bind:value={createAlbumForm.title}
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
                                    bind:value={createAlbumForm.slug}
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
                                bind:value={createAlbumForm.description}
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
                                bind:checked={createAlbumForm.hidden}
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
                                        bind:files={createAlbumForm.thumbnail}
                                    />
                                    Borító feltöltése
                                </label>
                            </div>
                            {#if createAlbumForm.thumbnail?.length && createAlbumForm.thumbnail.length > 0}
                                <p
                                    class="c-monospace p-[0.5rem] text-[1.25rem] font-medium"
                                >
                                    {createAlbumForm.thumbnail[0].name}
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
                                        bind:files={createAlbumForm.images}
                                    />
                                    Fotók feltöltése
                                </label>
                            </div>
                            {#if createAlbumForm.images}
                                <div
                                    class="c-monospace flex flex-col gap-[0.25rem] p-[0.5rem]"
                                >
                                    <p class="text-[1.25rem] font-bold">
                                        {createAlbumForm.images.length} kiválasztott
                                        fotó:
                                    </p>
                                    <ul
                                        class="flex flex-col gap-[0.25rem] text-[1rem]"
                                    >
                                        {#each createAlbumForm.images as image}
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
                                // thumbnail = undefined;
                                // images = undefined;
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
            <div class="grid place-items-center">
                <Heading level={2}>Még nincsenek feltöltött albumok :(</Heading>
            </div>
        {:else}
            <div class="c-cards-grid py-[2rem]">
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

    .c-monospace {
        font-family: monospace;
    }
</style>
