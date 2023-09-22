<script lang="ts">
    import { enhance } from '$app/forms';
    import type { ActionData } from './$types';
    import Error from '$lib/component/Error.svelte';
    import Heading from '$lib/component/Heading.svelte';
    import Button from '$lib/component/Button.svelte';
    import Wrap from '$lib/component/Wrap.svelte';

    let create = false;

    let thumbnail: FileList | undefined = undefined;
    let images: FileList | undefined = undefined;

    export let data;
    export let form: ActionData;
</script>

<div class="px-[8rem] py-[4rem]">
    <Error
        className="text-[1.5rem] font-medium text-light"
        condition={form?.success === false}
        message="album létrehozása sikertelen"
    />
    <Heading>Adminisztráció</Heading>
    <hr class="text-dark/20 mb-[4rem]" />
    {#if create}
        <section
            class="mx-auto border-dark/25 rounded-[1rem] p-[1.5rem] w-fit min-w-[75%] border font-roboto text-dark/80"
        >
            <div>
                <form
                    class="flex flex-col gap-[1.5rem]"
                    action="?/create"
                    method="POST"
                    enctype="multipart/form-data"
                    use:enhance
                >
                    <div class="flex justify-between gap-[1rem]">
                        <Wrap class="flex-1">
                            <label class="text-[1.25rem]">
                                <p>Album címe</p>
                                <input
                                    class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                                    placeholder="Cím"
                                    name="title"
                                    type="text"
                                    required
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
                                />
                            </label>
                        </Wrap>
                    </div>
                    <Wrap>
                        <label class="text-[1.25rem]">
                            <p>Leírás</p>
                            <textarea
                                class="border border-dark/25 py-1 px-2 rounded-[0.5rem]"
                                placeholder="Lorem ipsum, dolor sit amet..."
                                cols="50"
                                rows="5"
                                name="description"
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
                                checked
                            />
                        </label>
                    </Wrap>
                    <div class="flex justify-between flex-grow gap-[1rem]">
                        <div class="flex-1">
                            <label
                                class="text-[1.25rem] bg-light text-dark border-dark hover:bg-dark hover:text-light text-center rounded-[0.8rem] border transition-colors py-2 px-6"
                                for="thumbnail"
                            >
                                Borító feltöltése
                            </label>
                            <input
                                class="hidden"
                                name="thumbnail"
                                id="thumbnail"
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                bind:files={thumbnail}
                            />
                            {#if thumbnail}
                                <p
                                    class="c-monospace p-[1rem] text-[1.25rem] font-medium"
                                >
                                    {thumbnail[0].name}
                                </p>
                            {/if}
                        </div>
                        <div class="flex-1">
                            <label
                                class="text-[1.25rem] bg-light text-dark border-dark hover:bg-dark hover:text-light text-center rounded-[0.8rem] border transition-colors py-2 px-6"
                                for="images"
                            >
                                Fotók feltöltése
                            </label>
                            <input
                                class="hidden"
                                name="images"
                                id="images"
                                type="file"
                                accept=".jpg, .jpeg, .png"
                                multiple
                                bind:files={images}
                            />
                            {#if images}
                                <div
                                    class="c-monospace flex flex-col gap-[0.25rem] p-[1rem]"
                                >
                                    <p class="text-[1.25rem] font-bold">
                                        {images.length} kiválasztott fotó:
                                    </p>
                                    <ul
                                        class="flex flex-col gap-[0.25rem] text-[1rem]"
                                    >
                                        {#each images as image}
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
                                thumbnail = undefined;
                                images = undefined;
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
            <p class="text-[1.25rem] my-4">Nincsenek elérhető albumok.</p>
        {:else}
            <div class="grid grid-flow-col auto-cols-auto gap-8 py-[2rem]">
                {#each data.albums as album}
                    <div
                        class="c-card relative rounded-[2rem] border border-theme-red hover:brightness-75"
                    >
                        <a href={`admin/edit/${album.slug}`}>
                            <div
                                class="flex flex-col items-center gap-2 py-2 absolute z-10 rounded-t-[2rem] text-light text-[1.5rem] text-center bg-dark/80 top-0 left-0 right-0"
                            >
                                <p>
                                    {album.title}
                                </p>
                                <hr class="text-light/25 w-3/4" />
                                <p>
                                    {album.date || '-'}
                                </p>
                                {#if album.hidden}
                                    <p> Rejtett </p>
                                {/if}
                            </div>
                            <img
                                class="rounded-[2rem] w-full h-full object-cover aspect-square"
                                src={album.thumbnail?.path}
                                alt={album.title}
                            />
                        </a>
                    </div>
                {/each}
            </div>
        {/if}
    </section>
</div>

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

    .c-card {
        transition: filter 0.2s;
    }

    .c-monospace {
        font-family: monospace;
    }
</style>
