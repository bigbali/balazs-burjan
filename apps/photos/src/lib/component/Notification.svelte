<script lang="ts">
    import { cancel, notifications } from '$lib/client/notification';
    import autoAnimate from '@formkit/auto-animate';

    const color = {
        info: ' bg-theme-green',
        warn: ' bg-[rgb(200, 100, 100)]',
        error: ' bg-theme-red'
    } as const;
</script>

<ul
    class="c-notifications fixed inset-0 top-[10%] pointer-events-none"
    use:autoAnimate
>
    {#each $notifications as notification}
        <li
            class={`c-notification relative mx-auto w-fit h-fit min-w-[40rem] min-h-[10rem] rounded-[1rem] border border-light/25${
                color[notification.type]
            }`}
        >
            <button
                class="absolute top-1 right-1 grid place-items-center text-[1.5rem] leading-[1.5rem] h-[1.5rem] w-[1.5rem] font-bold text-light"
                on:click={() => {
                    cancel(notification.id);
                }}
            >
                x
            </button>
            <div class="flex flex-col gap-[1rem] font-roboto">
                {#if notification.title}
                    <p class="text-[1.5rem] px-[1rem] text-light">
                        {notification.title}
                    </p>
                {/if}
                {#if notification.message}
                    <p class="text-light px-[1rem]">
                        {notification.message}
                    </p>
                {/if}
            </div>
        </li>
    {/each}
</ul>

<style>
    .c-notifications {
        z-index: 1000;
    }
    .c-notification {
        pointer-events: all;
    }

    button {
        font-family: Verdana, Geneva, Tahoma, sans-serif;
    }
</style>
