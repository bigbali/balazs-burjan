<script lang="ts">
    import { enhance } from '$app/forms';
    import Heading from '$lib/component/Heading.svelte';
    import type { AlbumWithThumbnail } from '$lib/type';

    export let data;
    const { title: original_title, description: original_description } =
        data.album || {};

    let title = original_title;
    let description = original_description;

    let edit = false;

    let images: unknown[] = [];
</script>

<section>
    <div>
        <Heading>
            {original_title}
        </Heading>
        <p>{original_description}</p>
    </div>
    <div>
        {#if edit}
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
        {/if}
    </div>
    {#each images as image}
        <div>
            <img src="" alt="" />
        </div>
    {/each}
</section>
