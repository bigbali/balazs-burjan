<script lang="ts">
    import { enhance } from '$app/forms';
    import Heading from '$lib/component/Heading.svelte';
    import Wrap from '$lib/component/Wrap.svelte';
    import Page from '$lib/component/Page.svelte';

    export let data;
    const { title: original_title, description: original_description } =
        data.album || {};

    let title = original_title;
    let description = original_description;
</script>

<Page>
    {#if !data.album}
        <Heading>Ez az album nem található.</Heading>
    {:else}
        <div>
            <Heading>
                Szerkesztés: <br />
                {original_title}
            </Heading>
            <p>{original_description}</p>
            <hr class="text-dark/20 mb-[4rem]" />
        </div>
        <div>
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
        </div>
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
