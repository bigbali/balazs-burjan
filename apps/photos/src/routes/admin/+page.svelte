<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';

    const albums: unknown[] = [];

    let create = false;

    export let form: ActionData;

    let album_title = '';
    let album_description = '';
    let album_thumbnail: FileList;
    let album_images: FileList;

    // $: console.log(album_images);
    $: console.log(form);
</script>

<div>
    <h1>Admin</h1>
    <section>
        <h1>Albumok</h1>
        <!-- {#each albums as album}
            <a href="edit/${album.path}"></a>
            <div>
                <img src={album.src} alt="" />
            </div>
        {/each} -->
        {#if !create}
            <button on:click={() => (create = true)}>
                Új album létrehozása
            </button>
        {/if}
    </section>
    {#if create}
        <section>
            <form
                action="?/create"
                method="POST"
                enctype="multipart/form-data"
                use:enhance
            >
                <label>
                    <p>Title</p>
                    <input name="title" type="text" bind:value={album_title} />
                </label>
                <label>
                    <p>Description</p>
                    <input
                        name="description"
                        type="text"
                        bind:value={album_description}
                    />
                </label>
                <label>
                    <p>Thumbnail</p>
                    <input
                        name="thumbnail"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        bind:files={album_thumbnail}
                    />
                </label>
                <label>
                    <p>Fotók</p>
                    <input
                        name="images"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        multiple
                        bind:files={album_images}
                    />
                </label>
                <button type="submit"> Mentés </button>
            </form>
            <button on:click={() => (create = false)}> Elvetés </button>
        </section>
    {/if}
</div>
