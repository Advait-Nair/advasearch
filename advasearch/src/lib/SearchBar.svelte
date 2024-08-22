<script lang="ts">
	import {createEventDispatcher, onMount} from 'svelte';
    import type {DomainObject} from 'fn';
    import {processInput, colourCoded, allPossibleCombinations} from 'fn';

    const dispatch = createEventDispatcher();
    export let svalue = '';
    export let packJSONData:DomainObject;
    let value = svalue;
    let input: any;

    export let placeholder = 'Search';
    export let icon = 'search';
    let conflict = false;


    let processedInput = value;
    let richOutput;
    let generatedURI = '';
    let suggestions:string[] = (allPossibleCombinations(packJSONData));
    let suggestionsFormatted:string[] = colourCoded(allPossibleCombinations(packJSONData));

    let v:string;

    function valueChanged(e:any) {
        v = v.replaceAll('  ', ' ').replaceAll('. ', ' ');
        value = e.target.value.replaceAll('  ', ' ').replaceAll('. ', ' ');
        richOutput = processInput(packJSONData, value);
        generatedURI = richOutput.generatedURI;
        suggestions = richOutput.autocomplete;
        suggestionsFormatted = richOutput.autocompleteFormatted;
        conflict = richOutput.conflict
        // console.log(suggestions)
        // console.log(generatedURI, richOutput);
        processedInput = richOutput.processedInput;
        dispatch('val', value);
    }

    let pointerActive = true;
    let suggestionActive = true;
    // export let viewDomains = false;

    // focus on input asap
    onMount(() => {
        input.focus();
    });

    function suggestionClick (i:number) {
        v = suggestions[i];
        valueChanged({target: {value: suggestions[i]}});
        suggestionActive = false;
    }

    function decideSuggestionVisibility (e:any) {
        // if the target is not the suggestions div, hide suggestions
        if (!e.relatedTarget || !e.relatedTarget.classList.contains('suggestion')) {
            suggestionActive = false;
        }

    }

    let searchBegun = false;
    let timeout = false;

    function searchInitiated(e:any) {
        e.preventDefault();
        // if (!conflict)
        searchBegun = true;
        suggestionActive = false;
        let currentURI = location.href
        location.href = (generatedURI)
        
        setTimeout(() => {
            searchBegun = false;
            suggestionActive = true;
            timeout = true;
            location.assign(currentURI)
            setTimeout(
                () => timeout = false, 5000
            )
        }, 5000)
    }

</script>

<!-- <input spellcheck="false" autocapitalize="false" autocorrect="off" on:keypress={() => dispatch('val', value)} bind:value> -->

<!-- An invisible input will listen for keyboard input, while a span will render with color data -->

<div class="search-aspect">
    <div class="wrap">
        <form on:submit={searchInitiated}>
            <input on:blur={(e) => {pointerActive = true; decideSuggestionVisibility(e)}} bind:value={v} bind:this={input} class:pointerActive on:focus={() => {pointerActive = false; suggestionActive = true;}}  class="flex center-flex flex-col left-align" spellcheck="false" autocapitalize="false" autocorrect="off" autocomplete="off" on:input={valueChanged}>
        </form>
            <div class="render-point flex center-flex center-align left-flex">
                <div class="whitespace-allower">
                {@html processedInput}
                </div>
            </div>
            <div class="conflict flex center-flex top-pad center-align fw" class:warning-invisible={!conflict}>
                <span class="material-symbols-outlined">
                    warning
                </span>
                Search syntax is incomplete. Submitting this search triggers Google.
                <!-- {generatedURI} -->
            </div>
            <div class="conflict flex center-flex top-pad center-align fw" class:warning-invisible={!timeout}>
                <span class="material-symbols-outlined">
                    warning
                </span>
                Search timed out at 5000ms.
                <!-- {generatedURI} -->
            </div>
        <div class="placeholder flex center-flex" class:placeholder-visible={processedInput.trim() == '' && pointerActive}>
            <span class="material-symbols-outlined">
                {icon}
            </span>
            {placeholder}
        </div>
    </div>
    <div class="suggestions" class:invisible={!suggestionActive}>
        {#key suggestionsFormatted}
            {#each suggestionsFormatted as suggestionFormatted, i}
                <div
                on:click={() => suggestionClick(i)}
                on:keydown={() => suggestionClick(i)}
                role="button"
                tabindex="0"
                class="flex center-flex center-align left-flex suggestion">
                    {@html suggestionFormatted}
                </div>
            {/each}
        {/key}
    </div>
</div>

<div class="telewrap flex center-align center-flex" class:invisible={!searchBegun}>

</div>

<style lang="scss">
    .telewrap {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        transition: all 300ms ease;
        // z-index: 100;
    }
.invisible {
    opacity: 0;
    pointer-events: none;
    backdrop-filter: blur(0);
    -webkit-backdrop-filter: blur(0);
}
.search-aspect {
    position: relative;
}

.warning-invisible {
    pointer-events: none;
    opacity: 0;
}

.conflict {
    transition: 200ms ease;
    font-size: 1rem;
    gap: 1rem;
    position: absolute;
    top: -3.5rem;
    user-select: none;
    background: rgba(181, 77, 12, 0.472);
    padding-top: 0.25rem;
    padding-bottom: 4.25rem;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    bottom: 0;
    border-radius: 2rem;
    color: #ffdbcfe0;
}


.suggestions {
    transition: 200ms ease;
    position: absolute;
    top: 140%;
    left: 0;
    width:100%;
    background: #11111155;
    --webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    color: #ffffffc8;
    z-index: 4;
    border-radius: 1rem;
    max-height: 15rem;
    overflow-y: auto;
    .suggestion {
        padding: 1rem 2.5rem;
        font-size: 1rem;
        cursor: pointer;
        transition: 200ms ease all;
        border-top: solid 1px #ffffff24;
        &:first-child {
            border-top: none;
        }
        &:hover {
            background: #11111183;
        }
        gap: .5rem;
    }
}

    .wrap {
        width: 100%;
        width: 45rem;
        height: calc(4rem + 2px);
        font-size: 2rem;
        position: relative;
    }
    .render-point {
        pointer-events: none;
        z-index: 1;

        background: #11111155;
        --webkit-backdrop-filter: blur(10px);
        backdrop-filter: blur(10px);
        
        color: #ffffffc8;
        
    }

    .pointerActive {
        cursor: pointer;
    }

    .placeholder {
        color: rgba(255, 255, 255, 0.608);
        text-align: center;
        z-index: 3;
        gap: .6rem;
        span {
            font-size: 2rem;
        }
        pointer-events: none;
        opacity: 0;
    }

    .placeholder-visible {
        opacity: 1;
    }

    input:focus + .render-point {
        background: #11111183;
        color: #fff;
    }
    input {
        z-index: 2;
        border: 2px solid transparent;
        color: transparent;
        background: transparent;
        // only caret is visible
        caret-color: #ffffffc8;
    }


	input, .render-point, .placeholder {
        position: absolute;
        top: 0;
        left: 0;

        letter-spacing: 0px;
        
        max-width: 100%;
        width: 45rem;
        height: 4rem;
        font-size: 2rem;
        font-family: 'Inter', sans-serif;
        padding: 2rem 2.3rem;
        border-radius: 5rem;
        outline: none;
        transition: 200ms ease all;
        border: solid 2px transparent;
    }
</style>
