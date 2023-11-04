<script lang="ts">
    import { enhance } from '$app/forms';
    import Heading from '$lib/component/Heading.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';

    export let data;
    const {
        title: original_title,
        description: original_description,
        hidden: original_hidden,
        date: original_date,
        slug: original_slug
    } = data.album || {};

    let title = original_title;
    let description = original_description;
    let hidden = original_hidden;
    let slug = original_slug;
    let date = original_date;
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
                    action=""
                    class="font-roboto flex flex-col sm:flex-row gap-[1rem]"
                >
                    <div>
                        <img
                            src={data.album.thumbnail?.path}
                            alt={data.album.title}
                            class="rounded-[0.5rem]"
                        />
                    </div>
                    <div class="flex flex-col justify-between gap-[1rem]">
                        <div>
                            <label for="thumbnail" class="text-[1.25rem]">
                                Borítókép
                            </label>
                            <input
                                type="file"
                                name="thumbnail"
                                id="thumbnail"
                                class="block"
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
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                bind:value={title}
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
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                bind:value={description}
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
                                class="border border-dark/20 rounded-[0.5rem] px-[0.5rem]"
                                bind:value={slug}
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
                                bind:value={hidden}
                            />
                        </div>
                    </div>
                </form>
            </Wrap>
            <Separator />
        </div>
        <!-- {#if edit}
                <form
                    action="?/edit"
                    method="POST"
                    enctype="multipart/form-data"
                    use:enhance
                >
                    <input type="text" bind:value={title} />
                    <textarea bind:value={description} />
                    <button on:click={() => (edit = false)}> Mentés </button>
                </form>
            {:else}
                <button on:click={() => (edit = true)}> Szerkesztés </button>
            {/if} -->
        {#if data.album}
            <div class="flex flex-col gap-[2rem] font-roboto">
                {#each data.album.images as image}
                    <div class="c-image flex gap-[1rem]">
                        <img
                            class="w-[20rem] h-[20rem] object-cover"
                            src={image.path}
                            alt={image.title}
                        />
                        <Wrap class="flex-1">
                            <div class="flex flex-col gap-[1rem] w-full h-full">
                                <label class="flex flex-col gap-[1rem]">
                                    Cím
                                    <input
                                        class="border"
                                        type="text"
                                        value={image.title ?? ''}
                                    />
                                </label>
                                <label class="flex flex-col gap-[1rem] flex-1">
                                    Leírás
                                    <textarea
                                        class="flex-1 border"
                                        value={image.description ?? ''}
                                    />
                                </label>
                            </div>
                        </Wrap>
                        <hr class="c-separator-mobile hidden" />
                    </div>
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

        .c-separator-mobile {
            display: initial;
        }
    }
</style>
