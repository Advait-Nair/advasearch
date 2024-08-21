<script lang="ts">
	import {createEventDispatcher, onMount} from 'svelte';
    import type {DomainObject} from 'fn';
    import {processInput} from 'fn';

    const dispatch = createEventDispatcher();
    export let svalue = '';
    export let packJSONData:DomainObject;
    let value = svalue;
    let input: any;

    export let placeholder = 'Search';
    export let icon = 'search';


    let processedInput = value;
    let richOutput;

    let v:string;

    function valueChanged(e:any) {
        v = v.replaceAll('  ', ' ').replaceAll('. ', ' ');
        value = e.target.value.replaceAll('  ', ' ').replaceAll('. ', ' ');
        richOutput = processInput(packJSONData, value);
        processedInput = richOutput.processedInput;
        dispatch('val', value);
    }

    let pointerActive = true;

    // focus on input asap
    onMount(() => {
        input.focus();
    });

    

</script>

<!-- <input spellcheck="false" autocapitalize="false" autocorrect="off" on:keypress={() => dispatch('val', value)} bind:value> -->

<!-- An invisible input will listen for keyboard input, while a span will render with color data -->

<div class="wrap">

    <input bind:value={v} bind:this={input} class:pointerActive on:focus={() => pointerActive = false} on:blur={() => pointerActive = true} class="flex center-flex flex-col left-align" spellcheck="false" autocapitalize="false" autocorrect="off" autocomplete="off" on:input={valueChanged}>
    <div class="render-point flex center-flex center-align left-flex">
        <div class="whitespace-allower">
            {@html processedInput}
        </div>
    </div>
    <div class="placeholder flex center-flex" class:placeholder-visible={processedInput.trim() == '' && pointerActive}>
        <span class="material-symbols-outlined">
            {icon}
        </span>
        {placeholder}
    </div>
</div>

<style lang="scss">
    .wrap {
        max-width: 90%;
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
