<style lang="scss">

</style>

<script lang="ts">
    import Search from './Search.svelte';
    import Loader from './Loader.svelte';
    import 'style.main';
    import 'style.mixins';
    import 'style.richtext';

    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import { fly } from 'svelte/transition';

    let loaded = writable(false);


    onMount(() => {
        // setTimeout(() => {
            $loaded = true;
        // }, 500);
    });

</script>

{#if $loaded}
<div class="anim-cont animated" in:fly={{ y: 20, duration: 200 }}>
<Search></Search>
</div>
{:else}
<div class="anim-cont animated" in:fly={{ y: 20, duration: 200 }}>
<Loader done={loaded}></Loader>
</div>
{/if}