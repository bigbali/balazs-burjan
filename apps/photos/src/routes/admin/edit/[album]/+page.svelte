<script lang="ts">
    import Heading from '$lib/component/Heading.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';
    import Button from '$lib/component/Button.svelte';
    import type { CreateAlbumForm, CreateImageForm } from '$lib/type.js';
    import api from '$lib/client/api';
    import { notify } from '$lib/client/notification';
    import { goto } from '$app/navigation';
    import autoAnimate from '@formkit/auto-animate';
    import AdminImageEdit from '$lib/component/AdminImageEdit.svelte';
    import AdminImageCreate from '$lib/component/AdminImageCreate.svelte';
    import { pretty, transition } from '$lib/apihelper.js';
    import Suspense from '$lib/component/Suspense.svelte';

    export let data;

    const [pending, suspend] = transition();

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

    const handler = {
        album: {
            delete: async (id: number) => {
                const response = await api.album.delete(id);

                notify({
                    message: response.message,
                    type: response.ok ? 'info' : 'error'
                });

                console.log(response);
                if (response.ok) {
                    goto('/admin');
                }
            }
        },
        image: {
            create: async (e: Event) => {
                if (imageForm.image && imageForm.image.length > 0) {
                    const response = await api.image.create({
                        albumId: data.album!.id.toString(),
                        albumPath: data.album!.path,
                        ...imageForm,
                        image: imageForm.image[0]
                    });

                    if (response.ok) {
                        data.album!.images = [
                            response.data,
                            ...data.album!.images
                        ];
                    }

                    notify({
                        message: response.message,
                        type: response.ok ? 'info' : 'error'
                    });
                }

                (e.target as HTMLFormElement).reset();
            },
            delete: async (id: number) => {
                const response = await api.image.delete({
                    id
                });

                if (response.ok) {
                    data.album!.images = data.album!.images.filter(
                        (image) => image.id !== response.data.id
                    );
                }

                notify({
                    message: response.message,
                    type: response.ok ? 'info' : 'error'
                });
            }
        }
    };
</script>

<svelte:head>
    <title>Szerkesztés</title>
    <meta name="description" content="Album szerkesztése" />
</svelte:head>

<Suspense pending={$pending}>
    <Page>
        {#if !data.album}
            <Heading>Ez az album nem található.</Heading>
        {:else}
            <section class="flex flex-col gap-[1rem]">
                <Heading style="line-height: 3rem">
                    Szerkesztés:
                    <br />
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
                                    <p
                                        class="text-dark/50 font-medium pl-[0.5rem]"
                                    >
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
                                    <p
                                        class="text-dark/50 font-medium pl-[0.5rem]"
                                    >
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
                                    <p
                                        class="text-dark/50 font-medium pl-[0.5rem]"
                                    >
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
            <section class="flex flex-col gap-[2rem]">
                <AdminImageCreate {imageForm} oncreate={handler.image.create} />
                {#if data.album.images.length > 0}
                    <div
                        class="flex flex-col gap-[2rem] font-roboto"
                        use:autoAnimate
                    >
                        {#each data.album.images as image, index (image.id)}
                            <AdminImageEdit
                                {image}
                                ondelete={handler.image.delete}
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
</Suspense>
