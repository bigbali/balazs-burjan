<script lang="ts">
    import Heading from '$lib/component/Heading.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';
    import Button from '$lib/component/Button.svelte';
    import type {
        ImageCreateForm,
        ImageEditParams,
        AlbumEditForm,
        Album
    } from '$lib/type.js';
    import { notify, responseToNotification } from '$lib/client/notification';
    import { goto } from '$app/navigation';
    import autoAnimate from '@formkit/auto-animate';
    import AdminImageEdit from '$lib/component/AdminImageEdit.svelte';
    import AdminImageCreate from '$lib/component/AdminImageCreate.svelte';
    import { transition } from '$lib/apihelper.js';
    import Suspense from '$lib/component/Suspense.svelte';
    import ClientAPI from '$lib/client/api';

    export let data;

    const [pending, suspend] = transition();

    let original = {
        title: data.album?.title,
        description: data.album?.description,
        hidden: data.album?.hidden,
        date: data.album?.date,
        slug: data.album?.slug
    };

    const editAlbumForm = {
        title: original.title,
        description: original.description ?? undefined,
        slug: original.slug,
        hidden: original.hidden,
        date:
            (original.date instanceof Date
                ? original.date.toISOString().split('T')[0]
                : original.date) ?? undefined
    };

    const createImageForm: ImageCreateForm = {
        title: '',
        description: '',
        image: undefined
    };

    const handler = {
        album: {
            delete: async (id: number) => {
                const response = await ClientAPI.Album.delete(id);

                notify(responseToNotification(response));

                if (response.ok) {
                    goto('/admin');
                }
            },
            edit: async () => {
                const response = await ClientAPI.Album.edit({
                    id: data.album!.id,
                    originalTitle: data.album!.title,
                    ...editAlbumForm
                });

                notify(responseToNotification(response));

                if (response.ok) {
                    // @ts-ignore when we override the orinal date, it's gonna be str instead of date
                    original = { ...editAlbumForm };
                    goto(`/admin/edit/${response.data.slug}`);
                    // window.location.href = window.location.href.replace(
                    //     data.album!.slug,
                    //     response.data.slug
                    // );
                }
            }
        },
        image: {
            create: async (e: Event) => {
                if (createImageForm.image && createImageForm.image.length > 0) {
                    const response = await ClientAPI.Image.create({
                        album: {
                            id: data.album!.id,
                            path: data.album!.path
                        },
                        image: {
                            file: createImageForm.image[0],
                            title: createImageForm.title,
                            description: createImageForm.description
                        }
                    });

                    if (response.ok) {
                        data.album!.images = [
                            response.data,
                            ...data.album!.images
                        ];
                    }

                    notify(responseToNotification(response));
                }

                (e.target as HTMLFormElement).reset();
            },
            delete: async (id: number) => {
                const response = await ClientAPI.Image.delete({
                    id
                });

                if (response.ok) {
                    data.album!.images = data.album!.images.filter(
                        (image) => image.id !== response.data.id
                    );
                }

                notify(responseToNotification(response));
            },
            edit: async (params: ImageEditParams<'client'>) => {
                const response = await ClientAPI.Image.edit(params);

                if (response.ok) {
                    const i = data.album!.images.findIndex(
                        (image) => image.id === response.data.id
                    );

                    if (i >= 0) {
                        data.album!.images[i] = response.data;
                    }
                }

                notify(responseToNotification(response));
            }
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
        <Suspense pending={$pending}>
            <section class="flex flex-col gap-[1rem]">
                <Heading style="line-height: 3rem">
                    Szerkesztés:
                    <br />
                    {original.title}
                </Heading>
                <Wrap>
                    <form
                        id="edit-album"
                        class="font-roboto flex flex-col lg:flex-row gap-[1rem]"
                    >
                        <div
                            class="min-w-full sm:min-w-0 lg:max-w-[40vw] min-h-[30rem]"
                        >
                            <img
                                src={data.album.thumbnail?.source}
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
                                {#if original.title}
                                    <p
                                        class="text-dark/50 font-medium pl-[0.5rem]"
                                    >
                                        {original.title}
                                    </p>
                                {/if}
                                <input
                                    type="text"
                                    name="title"
                                    id="title"
                                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                    bind:value={editAlbumForm.title}
                                />
                            </div>
                            <div>
                                <label for="description" class="text-[1.25rem]">
                                    Leírás
                                </label>
                                {#if original.description}
                                    <p
                                        class="text-dark/50 font-medium pl-[0.5rem]"
                                    >
                                        {original.description}
                                    </p>
                                {/if}
                                <textarea
                                    name="description"
                                    id="description"
                                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                    bind:value={editAlbumForm.description}
                                />
                            </div>
                            <div>
                                <label for="slug" class="text-[1.25rem]">
                                    URL
                                </label>
                                <p class="text-dark/50 font-medium pl-[0.5rem]">
                                    {original.slug}
                                </p>
                                <input
                                    type="text"
                                    name="slug"
                                    id="slug"
                                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                    bind:value={editAlbumForm.slug}
                                />
                            </div>
                            <div>
                                <label for="date" class="text-[1.25rem]">
                                    Dátum
                                </label>
                                {#if original.date}
                                    <p
                                        class="text-dark/50 font-medium pl-[0.5rem]"
                                    >
                                        {original.date instanceof Date
                                            ? original.date.toLocaleDateString()
                                            : original.date}
                                    </p>
                                {/if}
                                <input
                                    type="date"
                                    name="date"
                                    id="date"
                                    class="border border-dark/20 rounded-[0.5rem] px-[0.5rem] w-full"
                                    bind:value={editAlbumForm.date}
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
                                    bind:value={editAlbumForm.hidden}
                                />
                            </div>
                        </div>
                    </form>
                </Wrap>
                <div class="flex gap-[1rem] font-roboto">
                    <Button
                        size="medium"
                        color="green"
                        class="!text-[1.5rem] mt-auto"
                        on:click={() => suspend(handler.album.edit())}
                    >
                        Mentés
                    </Button>
                    <Button
                        size="medium"
                        color="red"
                        class="!text-[1.5rem] mt-auto"
                        on:click={async () => {
                            data.album?.id &&
                                handler.album.delete(data.album.id);
                            // suspend(handler.album.delete(data.album.id))}
                        }}
                    >
                        Törlés
                    </Button>
                </div>
                <Separator />
            </section>
        </Suspense>
        <section class="flex flex-col gap-[2rem]">
            <AdminImageCreate
                imageForm={createImageForm}
                oncreate={handler.image.create}
            />
            {#if data.album.images.length > 0}
                <div
                    class="flex flex-col gap-[2rem] font-roboto"
                    use:autoAnimate
                >
                    {#each data.album.images as image, index (image.id)}
                        <AdminImageEdit
                            {image}
                            ondelete={handler.image.delete}
                            onedit={handler.image.edit}
                        />
                    {/each}
                </div>
            {:else}
                <p class="text-center text-[1.5rem]">
                    Nem találhatók szerkeszthető képek.
                </p>
            {/if}
        </section>
    {/if}
</Page>
