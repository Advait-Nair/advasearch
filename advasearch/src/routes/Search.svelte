

<script lang="ts">
    import StatusBar from 'c/StatusBar.svelte';
    import DynamicBackground from 'c/DynamicBackground.svelte';
    import SearchBar from 'c/SearchBar.svelte';
    import Container from 'c/Container.svelte';
    import Button from 'c/Button.svelte';

    import type {DomainObject} from 'fn';
    import {allPossibleCombinations, colourCoded} from 'fn';

    let packJSONData:DomainObject;

    // pack.json is in /pack.json. fetch it
    fetch('/pack.json')
        .then(res => res.json())
        .then(data => {
            packJSONData = data;
        });


    let viewDomains = false;

</script>

<StatusBar></StatusBar>

<div class="flex center-flex fwh top-anchor flex-col">
    <div class="quote fadeInUp">
        <img draggable="false" class="logo logo-large" src="/three_strike_long_white.png" alt="">
    </div>
    {#if packJSONData}
    <SearchBar {packJSONData}></SearchBar>
    {/if}
</div>

<div class="domains-wrapper" class:invisible={!viewDomains}>
    <Container>
        <div class="domains">
            {#if viewDomains}
                <div class="flex center-flex flex-col">
                    <div class="top-text">
                        SEARCHABLE DOMAINS
                    </div>
                    {#each colourCoded(allPossibleCombinations(packJSONData)) as domain}
                    <div class="domain">
                        {@html domain}
                    </div>
                    {/each}
                </div>
                <div class="ghost"></div>
            {/if}
        </div>
    </Container>
    <div class="bottom-cling pad blur dark">
        <div class="flex center-flex flex-col">
            <Button blur on:click={() => viewDomains = !viewDomains} icon="search">View Domains</Button>
        </div>
    </div>
</div>


<style lang="scss">
    .logo-large {
        margin-bottom: 2rem;
        height: 6.5rem;
        width: 26.3519795661rem;
    }
    .top-text {
        font-size: 1rem;
        font-weight: 600;
        margin-bottom: 1rem;
        opacity: 0.5;
        letter-spacing: 2px;
        user-select: none;
    }
    .domains-wrapper {
        transition: 400ms ease;
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        top: 6rem;
        // height: 100%;
        z-index: 5;
        background: #000000a1;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        .bottom-cling {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
        }
        .domains {
            padding: 2rem;
            .domain {
                width: 100%;
                border-top: 1px solid #ffffff11;
                padding: 0.5rem 1rem;
            }
            max-height: 90svh;
            .ghost {
                height: 8rem;
            }
            overflow-y: auto;
        }
    }
    .invisible {
        background: transparent;
        pointer-events: none;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        .bottom-cling {
            pointer-events: all;
            background: #0000007c;
            // backdrop-filter: blur(10px);
            // -webkit-backdrop-filter: blur(10px);
        }
    }
</style>

<DynamicBackground></DynamicBackground>

