<script lang="ts">
    import type { AlbumWithThumbnail } from '$lib/type';

    export let data;
    let { title, description } = data.album || {};
    // let description = data.album?.description;

    let edit_title = false;
    let edit_description = false;

    let images: unknown[] = [];
</script>

<section>
    <div>
        <h1>{title}</h1>
        {#if edit_title}
            <input type="text" bind:value={title} />
            <button> Mentés </button>
        {/if}
    </div>
    <div>
        <p>{description}</p>
        {#if edit_description}
            <input type="text" bind:value={description} />
            <button> Mentés </button>
        {/if}
    </div>
    {#each images as image}
        <div>
            <img src="" alt="" />
        </div>
    {/each}
</section>
