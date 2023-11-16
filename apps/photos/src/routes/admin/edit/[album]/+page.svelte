<script lang="ts">
    import { enhance } from '$app/forms';
    import Heading from '$lib/component/Heading.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';
    import Button from '$lib/component/Button.svelte';
    import type { CreateAlbumForm, CreateImageForm } from '$lib/type.js';
    import api from '$lib/client/api';
    import { notify } from '$lib/client/notification';
    import { goto } from '$app/navigation';
    import { log } from '$lib/apihelper.js';

    export let data;

    const {
        title: original_title,
        description: original_description,
        hidden: original_hidden,
        date: original_date,
        slug: original_slug
    } = data.album || {};

    const form: CreateAlbumForm = {
        title: original_title!,
        description: original_description!,
        slug: original_slug!,
        hidden: original_hidden!,
        date: original_date?.toISOString().split('T')[0]
    };

    const imageForm: CreateImageForm = {
        title: '',
        description: '',
        image: undefined
    };

    const album = {
        delete: async (id: number) => {
            const response = await api.album.delete(id);

            log(response);

            notify({
                message: response.message,
                type: response.ok ? 'info' : 'error'
            });

            if (response.ok) {
                goto('/admin');
            }
        }
    };

    const image = {
        create: async (e: Event) => {
            if (imageForm.image && imageForm.image.length > 0) {
                const response = await api.image.create({
                    albumId: data.album!.id.toString(),
                    albumPath: data.album!.path,
                    ...imageForm,
                    image: imageForm.image[0]
                });

                log(response);

                notify({
                    message: response.message,
                    type: response.ok ? 'info' : 'error'
                });
            }

            (e.target as HTMLFormElement).reset();
        }
    };
</script>

<svelte:head>
    <title>Szerkesztés</title>
    <meta name="description" content="Album szerkesztése" />
</svelte:head>

<Page>
    {#if !data.album}
        <Heading>Ez az album nem található.</Heading>
    {:else}
        <div class="flex flex-col gap-[1rem]">
            <Heading style="line-height: 3rem">
                Szerkesztés: <br />
                {original_title}
            </Heading>
            <Wrap>
                <form
                    id="edit-album"
                    class="font-roboto flex flex-col lg:flex-row gap-[1rem]"
                >
                    <input
                        type="text"
                        name="id"
                        id="id"
                        class="hidden"
                        value={data.album.id}
                    />
                    <input
                        type="text"
                        name="path"
                        id="path"
                        class="hidden"
                        value={data.album.path}
                    />
                    <input
                        type="text"
                        name="thumbid"
                        id="thumbid"
                        class="hidden"
                        value={data.album.thumbnail?.id}
                    />
                    <input
                        type="text"
                        name="thumbpid"
                        id="thumbpid"
                        class="hidden"
                        value={data.album.thumbnail?.cloudinaryPublicId}
                    />
                    <div
                        class="min-w-full sm:min-w-0 lg:max-w-[40vw] min-h-[30rem]"
                    >
                        <img
                            src={data.album.thumbnail?.path}
                            alt={data.album.title}
                            class="rounded-[0.5rem] w-full hfull"
                        />
                    </div>
                    <div
                        class="flex flex-col flex-1 justify-between gap-[1rem]"
                    >
                        <div>
                            <label for="thumbnail" class="text-[1.25rem]">
                                Borítókép
                            </label>
                            <input
                                type="file"
                                name="thumbnail"
                                id="thumbnail"
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                            />
                        </div>
                        <div>
                            <label for="title" class="text-[1.25rem]">
                                Cím
                            </label>
                            {#if original_title}
                                <p class="text-dark/50 font-medium pl-[0.5rem]">
                                    {original_title}
                                </p>
                            {/if}
                            <input
                                type="text"
                                name="title"
                                id="title"
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                bind:value={form.title}
                            />
                        </div>
                        <div>
                            <label for="description" class="text-[1.25rem]">
                                Leírás
                            </label>
                            {#if original_description}
                                <p class="text-dark/50 font-medium pl-[0.5rem]">
                                    {original_description}
                                </p>
                            {/if}
                            <textarea
                                name="description"
                                id="description"
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                bind:value={form.description}
                            />
                        </div>
                        <div>
                            <label for="slug" class="text-[1.25rem]">
                                URL
                            </label>
                            <p class="text-dark/50 font-medium pl-[0.5rem]">
                                {original_slug}
                            </p>
                            <input
                                type="text"
                                name="slug"
                                id="slug"
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                bind:value={form.slug}
                            />
                        </div>
                        <div>
                            <label for="date" class="text-[1.25rem]">
                                Dátum
                            </label>
                            {#if original_date}
                                <p class="text-dark/50 font-medium pl-[0.5rem]">
                                    {original_date.toLocaleDateString()}
                                </p>
                            {/if}
                            <input
                                type="date"
                                name="date"
                                id="date"
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                bind:value={form.date}
                            />
                        </div>
                        <div>
                            <label for="hidden" class="text-[1.25rem]">
                                Elrejtés
                            </label>
                            <input
                                type="checkbox"
                                name="hidden"
                                id="hidden"
                                class="border border-dark/20 rounded-[0.5rem] block"
                                bind:value={form.hidden}
                            />
                        </div>
                    </div>
                </form>
            </Wrap>
            <div class="flex gap-[1rem] font-roboto">
                <Button
                    form="edit-album"
                    type="submit"
                    size="medium"
                    color="green"
                    class="!text-[1.5rem] mt-auto"
                >
                    Mentés
                </Button>
                <Button
                    size="medium"
                    color="red"
                    class="!text-[1.5rem] mt-auto"
                    on:click={() =>
                        data.album?.id && album.delete(data.album.id)}
                >
                    Törlés
                </Button>
            </div>
            <Separator />
        </div>
        <div class="flex flex-col gap-[1rem]">
            <Wrap>
                <Heading level={2}>
                    <span class="font-roboto sm:text-[1.75rem]">
                        Új kép feltöltése
                    </span>
                </Heading>
                <form
                    class="font-roboto flex flex-col gap-[1rem]"
                    on:submit={(e) => image.create(e)}
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
            <Separator />
        </div>
        {#if data.album.images.length > 0}
            <div class="flex flex-col gap-[2rem] font-roboto">
                {#each data.album.images as image, index}
                    <Wrap>
                        <div class="c-image flex gap-[1rem]">
                            <img
                                class="w-[20rem] h-[20rem] object-cover"
                                src={image.path}
                                alt={image.title}
                            />
                            <div class="flex flex-col flex-1 gap-[1rem]">
                                <form
                                    id={`$edit-${index}`}
                                    action="?/edit-image"
                                    method="POST"
                                    class="flex gap-[2rem] w-full h-full"
                                >
                                    <input
                                        type="text"
                                        name="img-id"
                                        value={image.id}
                                        class="hidden"
                                    />
                                    <div
                                        class="flex flex-1 flex-col gap-[1rem]"
                                    >
                                        <label class="flex flex-col gap-[1rem]">
                                            Cím
                                            {#if image.title}
                                                <p
                                                    class="text-dark/50 font-medium pl-[0.5rem]"
                                                >
                                                    {image.title}
                                                </p>
                                            {/if}
                                            <input
                                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                                type="text"
                                                name="title"
                                                value={image.title}
                                            />
                                        </label>
                                        <label
                                            class="flex flex-col gap-[1rem] flex-1"
                                        >
                                            Leírás
                                            {#if image.description}
                                                <p
                                                    class="text-dark/50 font-medium pl-[0.5rem]"
                                                >
                                                    {image.description}
                                                </p>
                                            {/if}
                                            <textarea
                                                class="flex-1 border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                                name="description"
                                                value={image.description}
                                            />
                                        </label>
                                    </div>
                                </form>
                                <form
                                    id={`$delete-${index}`}
                                    action="?/delete-image"
                                    method="POST"
                                    class="hidden"
                                >
                                    <input
                                        type="text"
                                        name="img-id"
                                        value={image.id}
                                    />
                                </form>
                                <div class="flex gap-[1rem]">
                                    <Button
                                        form={`$edit-${index}`}
                                        type="submit"
                                        color="green"
                                        class="!text-[1.5rem]"
                                    >
                                        Mentés
                                    </Button>
                                    <Button
                                        form={`$delete-${index}`}
                                        type="submit"
                                        color="red"
                                        class="!text-[1.5rem]"
                                    >
                                        Törlés
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Wrap>
                {/each}
            </div>
        {:else}
            <p>No images to edit.</p>
        {/if}
    {/if}
</Page>

<style>
    @media (max-width: 1024px) {
        .c-image {
            flex-direction: column;
        }
    }
</style>
