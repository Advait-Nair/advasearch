<style lang="scss">

</style>

<script lang="ts">
    import StatusBar from 'c/StatusBar.svelte';
    import DynamicBackground from 'c/DynamicBackground.svelte';
    import SearchBar from 'c/SearchBar.svelte';
    import Button from 'c/Button.svelte';

    import type {DomainObject} from 'fn';

    let packJSONData:DomainObject;

    // pack.json is in /pack.json. fetch it
    fetch('/pack.json')
        .then(res => res.json())
        .then(data => {
            packJSONData = data;
        });

</script>

<StatusBar></StatusBar>

<div class="flex center-flex fwh top-anchor">
    {#if packJSONData}
    <SearchBar {packJSONData}></SearchBar>
    {/if}
</div>

<div class="bottom-cling pad blur dark">
    <div class="flex center-flex flex-col">
        <Button icon="search">View Domains</Button>
    </div>
</div>

<DynamicBackground></DynamicBackground>

