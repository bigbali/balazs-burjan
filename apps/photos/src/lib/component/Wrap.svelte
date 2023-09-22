<script lang="ts">
    let className: string | undefined = undefined;
    export { className as class };

    let c = 'border border-dark/10 rounded-[1rem] p-[1rem]';

    className && (c += ` ${className}`);
</script>

<div class={c}>
    <slot />
</div>
