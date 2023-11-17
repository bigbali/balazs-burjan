<script lang="ts">
    $: pending = $$props.pending as boolean;
</script>

<div class="contents" class:child-pending={pending}>
    <slot />
</div>

<style>
    :global(.child-pending > *) {
        position: relative;
        overflow: hidden;
    }

    :global(.child-pending > *::before) {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: linear-gradient(
            90deg,
            rgba(37, 32, 71, 0.5),
            rgba(165, 165, 165, 0.5),
            rgba(37, 32, 71, 0.5)
        );
        background-repeat: repeat-x;
        background-size: 200% 100%;
        animation: pending-suspense 1.5s infinite;
        animation-timing-function: linear;
    }

    @keyframes -global-pending-suspense {
        0% {
            background-position-x: 100%;
        }

        100% {
            background-position-x: -100%;
        }
    }
</style>
