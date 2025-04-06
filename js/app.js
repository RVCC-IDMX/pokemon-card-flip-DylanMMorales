/**
 * Main Application Logic - Simplified Version
 * This file contains the main functionality for the Pokemon Card Flip App
 */

// DOM Elements
const cardGrid = document.getElementById('card-grid');
const loadingSpinner = document.getElementById('loading-spinner');

// Constants
const CARD_COUNT = 12;

// Application State
const cards = [];

// Debug flag - set to true to simulate slower loading
const DEBUG_SHOW_SPINNER = true;
const LOADING_DELAY = 4000; // 4 seconds delay

/**
 * Initialize the application
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function | MDN: async function}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event | MDN: DOMContentLoaded}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/classList | MDN: classList}
 */
async function initApp() {
  showLoading();
  cardGrid.classList.add('hidden');
  createCardElements();
  await fetchAndAssignPokemon();
  setupEventListeners();
  hideLoading();
  cardGrid.classList.remove('hidden');
}

/**
 * Create card elements in the grid
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/createElement | MDN: createElement}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/innerHTML | MDN: innerHTML}
 */
function createCardElements() {
  cardGrid.innerHTML = '';
  cards.length = 0;

  for (let i = 0; i < CARD_COUNT; i++) {
    const card = createCardElement(i);
    cardGrid.appendChild(card);
    cards.push(card);
  }
}

/**
 * Create a single card element
 * @param {number} index - Card index
 * @returns {HTMLElement} Card element
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dataset | MDN: dataset}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/appendChild | MDN: appendChild}
 */
function createCardElement(index) {
  const card = document.createElement('div');
  card.className = 'card';
  card.dataset.index = index;

  const cardInner = document.createElement('div');
  cardInner.className = 'card-inner';

  const cardFront = document.createElement('div');
  cardFront.className = 'card-front';

  const cardBack = document.createElement('div');
  cardBack.className = 'card-back';

  const img = document.createElement('img');
  img.src = 'assets/pokeball.png';
  img.alt = 'Pokéball';
  img.className = 'pokemon-img';

  cardFront.appendChild(img);
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);

  return card;
}

/**
 * Fetch and assign Pokemon to cards
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/try...catch | MDN: try...catch}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise | MDN: Promise}
 */
async function fetchAndAssignPokemon() {
  try {
    const pokemonList = await PokemonService.fetchMultipleRandomPokemon(CARD_COUNT);
    if (DEBUG_SHOW_SPINNER) {
      await new Promise(resolve => setTimeout(resolve, LOADING_DELAY));
    }
    for (let i = 0; i < cards.length; i++) {
      assignPokemonToCard(cards[i], pokemonList[i]);
    }
  } catch (error) {
    console.error('Error fetching Pokémon:', error);
  }
}
/**
 * Assign a Pokemon to a card
 * @param {HTMLElement} card - Card element
 * @param {Object} pokemon - Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify | MDN: JSON.stringify}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector | MDN: querySelector}
 */
function assignPokemonToCard(card, pokemon) {
  if (!card || !pokemon) return;

  card.dataset.pokemon = JSON.stringify(pokemon);

  const cardBack = card.querySelector('.card-back');
  cardBack.innerHTML = '';

  const imgWrapper = document.createElement('div');
  imgWrapper.style.width = '100%';
  imgWrapper.style.display = 'flex';
  imgWrapper.style.justifyContent = 'center';

  const img = document.createElement('img');
  img.src = pokemon.sprite;
  img.alt = pokemon.name;
  img.className = 'pokemon-img';

  imgWrapper.appendChild(img);
  cardBack.appendChild(imgWrapper);

  const name = document.createElement('h2');
  name.textContent = pokemon.name;
  cardBack.appendChild(name);

  const typesDiv = document.createElement('div');
  typesDiv.className = 'pokemon-types';

  pokemon.types.forEach(type => {
    const typeBadge = document.createElement('span');
    typeBadge.className = 'type-badge';
    typeBadge.textContent = type;
    typesDiv.appendChild(typeBadge);
  });

  cardBack.appendChild(typesDiv);

  const statsText = document.createElement('p');
  statsText.textContent = `Height: ${pokemon.height}m | Weight: ${pokemon.weight}kg | Abilities: ${pokemon.abilities.length}`;
  cardBack.appendChild(statsText);
}
/**
 * Handle card click
 * @param {Event} event - Click event
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Event | MDN: Event}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function handleCardClick(event) {
  let element = event.target;
  while (element && !element.classList.contains('card')) {
    element = element.parentElement;
  }
  if (!element) return;
  element.classList.toggle('flipped');
}
/**
 * Set up event listeners
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener | MDN: addEventListener}
 */
function setupEventListeners() {
  cardGrid.addEventListener('click', handleCardClick);
}
/**
 * Show loading spinner
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function showLoading() {
    loadingSpinner.classList.remove('hidden');
  }
/**
 * Hide loading spinner
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Element/classList | MDN: classList}
 */
function hideLoading() {
    loadingSpinner.classList.add('hidden');
  }
  document.addEventListener('DOMContentLoaded', initApp);