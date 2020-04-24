<script>

	import { onMount, beforeUpdate } from 'svelte';

	export let float = 'left|top';

	export let title = 'Untitled ESX Menu';

	export let items  = [];
	export let _items = [];

	window.addEventListener('message', e => {

		const msg = e.data;
	
		switch(msg.action) {

			case 'set' : {
				
				float = msg.data.float || 'left|top';
				title = msg.data.title || 'Untitled ESX Menu';
				items = msg.data.items || [];
				
				break;
			}

			case 'set_item' : {

				items[msg.index][msg.prop] = msg.val;
				items = [...items];

				break;
			}

			default: break;
		}

	});

	onMount(() => {
		window.parent.postMessage({action: 'ready'}, '*');
	});

	beforeUpdate(() => {

		_items.length = 0;

    for(let i=0; i<items.length; i++) {

      ((i) => {

        _items[i] = new Proxy(items[i], {

          get: (obj, prop) => {
            return obj[prop];
          },

          set: (obj, prop, val) => {
            obj[prop] = val;
            window.parent.postMessage({action: 'item.change', index: i, prop, val}, '*');
            return true;
          },

          has: (obj, prop) => {
            return obj[prop] !== undefined;
          },

          ownKeys: (obj) => {
            return Object.keys(obj);
          }

        });

      })(i);

		}

		_items = [..._items];

	});

</script>

<main class="{float.split('|').map(e => 'float-' + e).join(' ')}">
	<main-wrap>

		<item class="title">{title}</item>

		{#each _items as item, i}
			
			{#if item.type === undefined || item.type === 'default' || item.type === 'button'}
				<item class="{item.type === 'button' ? 'button' : ''}">{item.label}</item>
			{/if}

			{#if item.type === 'slider'}
				<item class="slider">
					<div>{item.label}</div>
					<div><input type="range" bind:value={item.value}/></div>
				</item>
			{/if}

			{#if item.type === 'check'}
				<item class="check" on:click={e => {item.value = !item.value}} >
					{item.label} <input type="checkbox" bind:checked={item.value}/>
				</item>
			{/if}

			{#if item.type === 'text'}
				<item class="text">
					<div>{item.label}</div>
					<div><input type="text" bind:value={item.value} autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"/></div>
				</item>
			{/if}

		{/each}
	</main-wrap>
</main>

<style>

	main > main-wrap {
		display: flex;
		position: absolute;
		border-left: 0;
		background-color: rgba(0, 0, 0, 0.8);
		padding: 15px 10px;
		font-size: 1.1em;
		user-select: none;
		flex-direction: column;
		border-radius: 10px;
	}

	main.float-left > main-wrap {
		left: 10px;
	}

	main.float-top > main-wrap {
		top: 10px;
	}

	item {
		padding: 14px;
		border-radius: 10px;
		cursor: pointer;
		color: rgba(255, 255, 255, 0.6);
		text-align: left;
	}

	item input:focus {
		outline: none;
	}

	item > div {
		padding-bottom: 5px;
	}

	item:hover {
		background-color: rgba(255, 255, 255, 0.07);
	}

	item.title {
    text-align: center;
    border-bottom: 1px solid rgba(109, 109, 109, 0.25);
    border-radius: 0;
    padding-bottom: 30px;
    margin-bottom: 20px;
	}

	item.title:hover {
		background-color: unset;
		cursor: default;
	}

	item.button {
		text-decoration: underline;
		text-align: center;
	}

	item.slider {
		width: calc(100% - 30px);
	}

	item.slider input {
		width: calc(100% - 10px);
		background-color: rgba(0, 0, 0, 0.25);
		-webkit-appearance: none;
	}

	item.slider > div:nth-child(1) {
		text-align: center;
	}

	item.slider input::-webkit-slider-thumb {
		-webkit-appearance: none;
		appearance: none;
		width: 16px;
		height: 16px;
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.411);
		cursor: pointer;
	}

	item.check {
		display: flex;
    flex-direction: row;
		justify-content: space-between;
    align-items: center;
	}

	item.check input {
		-webkit-appearance: none;
    border-radius: 4px;
    height: 24px;
    width: 24px;
    background: rgba(0, 0, 0, 0.25);
    border: 1px solid rgba(255, 255, 255, 0.25);
    cursor: pointer;
	}

	item.check input:checked::after {
		display: block;
    content: 'x';
    font-weight: bold;
    font-size: 1.75em;
    text-align: center;
    margin-top: -4px;
    color: rgba(255, 255, 255, 0.79);
	}

	item.text input {
		width: calc(100% - 5px);
    height: 1em;
    padding: 5px;
    font-size: 1em;
    background-color: rgba(0, 0, 0, 0.59);
    border: 1px solid rgba(210, 210, 210, 0.25);
		color: rgba(191, 191, 191, 0.75);
	}

	item.text > div:nth-child(1) {
		text-align: center;
	}

</style>