<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import Error from '$lib/component/Error.svelte';

    let create = false;

    export let data;
    export let form: ActionData;
</script>

<div class="px-[8rem] py-[4rem]">
    <Error
        className="text-[1.5rem] font-medium text-light"
        condition={form?.success === false}
        message="album létrehozása sikertelen"
    />
    <h1 class="text-center text-[4rem]">Admin</h1>
    <hr />
    <section>
        <h1 class="text-[4rem]">Albumok</h1>
        <hr />
        <div></div>
        {#if data.albums.length === 0}
            <p class="text-[1.25rem] my-4">Nincsenek elérhető albumok.</p>
        {:else}
            <div class="grid grid-flow-col auto-cols-max py-[2rem]">
                {#each data.albums as album}
                    <a href={`/admin/edit/${album.slug}`}>
                        <div class="relative">
                            <p
                                class="absolute z-10 p-[1.5rem] top-0 left-0 right-0 bg-dark/50 text-light text-[1.5rem]"
                            >
                                {album.title}
                            </p>
                            <img
                                src={album.thumbnail?.path}
                                alt={album.title}
                            />
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
        {#if !create}
            <button
                class="bg-theme-green text-light px-6 py-2 text-[1.5rem] font-medium rounded-full border border-light/25 mt-[2rem]"
                on:click={() => (create = true)}
            >
                Új album létrehozása
            </button>
        {/if}
    </section>
    {#if create}
        <section class="border-dark/25 rounded-[2rem] p-[3rem] w-fit border">
            <form
                class="flex flex-col gap-[2rem]"
                action="?/create"
                method="POST"
                enctype="multipart/form-data"
                use:enhance
            >
                <label class="text-[1.25rem]">
                    <p>Album címe</p>
                    <input
                        class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                        placeholder="Cím"
                        name="title"
                        type="text"
                    />
                </label>
                <label class="text-[1.25rem]">
                    <p>URL azonosító</p>
                    <input
                        class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                        placeholder="album-azonosito"
                        name="slug"
                        type="text"
                    />
                </label>
                <label class="text-[1.25rem]">
                    <p>Leírás</p>
                    <textarea
                        class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                        placeholder="Lorem ipsum, dolor sit amet..."
                        cols="50"
                        name="description"
                    />
                </label>
                <label class="text-[1.25rem]">
                    <p>Borító</p>
                    <input
                        class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                        name="thumbnail"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                    />
                </label>
                <label class="text-[1.25rem]">
                    <p>Fotók</p>
                    <input
                        class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                        name="images"
                        type="file"
                        accept=".jpg, .jpeg, .png"
                        multiple
                    />
                </label>
                <button
                    class="text-[1.5rem] bg-theme-green border border-light/25 px-6 py-2 text-light rounded-full font-medium"
                    type="submit"
                >
                    Mentés
                </button>
            </form>
            <button
                class="text-[1.5rem] bg-theme-red border border-light/25 px-6 py-2 text-light rounded-full font-medium w-full mt-[1.5rem]"
                on:click={() => (create = false)}
            >
                Elvetés
            </button>
        </section>
    {/if}
</div>

<style>
    @import url('@fontsource-variable/caveat');
    h1 {
        font-family: 'Caveat Variable';
    }
</style>
