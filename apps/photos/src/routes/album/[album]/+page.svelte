<script lang="ts">
    import { browser } from '$app/environment';
    import Button from '$lib/component/Button.svelte';
    import CarouselImage from '$lib/component/CarouselImage.svelte';
    import Heading from '$lib/component/Heading.svelte';
    import Image from '$lib/component/Image.svelte';
    import Page from '$lib/component/Page.svelte';
    import Separator from '$lib/component/Separator.svelte';

    // @ts-ignore
    import Carousel from 'svelte-carousel';

    export let data;

    let carousel: typeof Carousel;

    let carousel_open = false;
    let current_image = 0;

    const carousel_change = (e: CustomEvent<number>) =>
        (current_image = e.detail);

    $: change_carousel = (index: number, animate = false) => {
        current_image = index;
        carousel.goTo(index, { animated: animate });
    };

    $: if (browser)
        window.document.body.style.overflow = carousel_open ? 'hidden' : 'auto';
</script>

<svelte:head>
    <title>
        {data?.album?.title ? `Album: ${data.album.title}` : 'Album'}
    </title>
    <meta
        name="description"
        content={data?.album?.title
            ? `Album megtekintése: ${data.album.title}`
            : 'Album megtekintése'}
    />
</svelte:head>

<Page>
    {#if !data.album}
        <Heading>Ez az album nem található.</Heading>
    {:else}
        <Heading>
            {data.album?.title}
        </Heading>
        <Separator />
        {#if browser}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <section
                class="c-hide flex flex-col justify-center fixed z-30 inset-0 w-full h-full bg-dark/80 py-[0.5rem] lg:p-[5rem] backdrop-blur-md"
                class:c-show={carousel_open}
                on:click={() => (carousel_open = false)}
            >
                {#if carousel_open}
                    <button
                        class="absolute right-[1rem] top-[1rem] lg:p-[1rem] text-[5rem] lg:text-[8rem] leading-[0] text-light z-10 hover:text-theme-green transition-colors"
                        on:click={() => (carousel_open = false)}
                    >
                        x
                    </button>
                {/if}
                <div
                    class="flex flex-col justify-center items-center max-w-full max-h-full gap-[1rem]"
                    on:click={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                    }}
                >
                    <div class="sm:hidden">
                        <Button
                            name="Letöltés"
                            href={data.album.images[current_image].source}
                            download
                            target="_blank"
                        >
                            Letöltés
                        </Button>
                    </div>
                    <Carousel
                        let:loaded
                        bind:this={carousel}
                        on:pageChange={carousel_change}
                    >
                        <div
                            slot="dots"
                            class="absolute left-0 right-0 bottom-[-5rem] sm:bottom-[1rem] flex justify-center pointer-events-none"
                        >
                            <div
                                class="flex gap-[0.5rem] w-fit bg-dark/50 p-[1rem] border border-light/20 rounded-[0.5rem] backdrop-blur-[1rem] pointer-events-auto"
                            >
                                {#each data.album.images as _, index}
                                    <button
                                        class="w-[1rem] h-[1rem] border-[2px] border-light rounded-full [&.active]:border-theme-green [&.active]:bg-light/20 [&.active]:border-[4px]"
                                        class:active={index === current_image}
                                        on:click={() => change_carousel(index)}
                                    >
                                    </button>
                                {/each}
                            </div>
                        </div>
                        {#each data.album.images as image, index}
                            <CarouselImage
                                {image}
                                loaded={loaded.includes(index)}
                            />
                        {/each}
                        <button
                            slot="prev"
                            class="flex flex-col justify-center p-[0.5rem]"
                            let:showPrevPage
                            on:click={() => showPrevPage()}
                        >
                            <div
                                class="group/btn w-[2rem] h-[2rem] p-[0.25rem] border-[2px] border-light rounded-full hover:border-theme-green transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                    class="h-full w-full fill-light transition-colors group-hover/btn:fill-theme-green"
                                >
                                    <path
                                        d="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 246.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"
                                    />
                                </svg>
                            </div>
                        </button>
                        <button
                            slot="next"
                            class="flex flex-col justify-center p-[0.5rem]"
                            let:showNextPage
                            on:click={() => showNextPage()}
                        >
                            <div
                                class="group/btn w-[2rem] h-[2rem] p-[0.25rem] border-[2px] border-light rounded-full hover:border-theme-green transition-colors"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 320 512"
                                    class="h-full w-full fill-light transition-colors group-hover/btn:fill-theme-green"
                                >
                                    <path
                                        d="M278.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-160 160c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L210.7 256 73.4 118.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l160 160z"
                                    />
                                </svg>
                            </div>
                        </button>
                    </Carousel>
                </div>
            </section>
        {/if}
        <div class="c-cards-grid">
            {#each data.album.images as image, index}
                <Image
                    {image}
                    on:click={() => {
                        carousel_open = true;
                        change_carousel(index);
                    }}
                />
            {/each}
        </div>
    {/if}
</Page>

<style>
    .c-hide {
        visibility: hidden;
        opacity: 0;
        transition: opacity 0.2s;

        &.c-show {
            visibility: visible;
            opacity: 1;
        }
    }

    :global(.sc-carousel__carousel-container) {
        max-height: 100%;
        position: relative;
    }
    :global(.sc-carousel__content-container) {
        max-height: 100%;
    }
    :global(.sc-carousel__pages-window) {
        max-height: 100%;
    }
    :global(.sc-carousel__pages-container) {
        max-height: 100%;
    }

    :global(.sc-carousel__arrow-container) {
        max-height: 100%;
    }
    :global(.sc-carousel-progress__container) {
        max-height: 100%;
    }
</style>
