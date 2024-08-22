<script lang="ts">
	import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    export let icon = '';
    export let blur = false;

</script>

<button class:blur class="flex center-flex" on:click={() => dispatch('click')}>
    {#if icon.trim() != ''}
        <span class="material-symbols-outlined">
            {icon}
        </span>
    {/if}
    <slot></slot>
</button>

<style lang="scss">
	button {
        border-radius: 0.8rem;
        padding: 1rem 1.4rem;
        color: #fff;
        background: #000000aa;
        border: none;
        font-size: 1rem;
        font-weight: 600;
        cursor: pointer;
        font-family: 'Inter', sans-serif;
        letter-spacing: -.2px;
        gap: 1rem;

        transition: all 200ms ease;

        &:hover {
            background: #000000cc;
        }
    }
</style>
