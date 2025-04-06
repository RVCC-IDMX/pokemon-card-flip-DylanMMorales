/**
 * Pokemon API Service
 * This file contains functions for fetching and manipulating Pokemon data from the PokeAPI
 */

// API Base URL
const API_BASE_URL = 'https://pokeapi.co/api/v2';

// Total number of Pokemon in the API (as of Gen 9)
const TOTAL_POKEMON = 1008;

/**
 * Fetch a random Pokemon from the PokeAPI
 * @returns {Promise<Object>} Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/fetch | MDN: fetch API}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random | MDN: Math.random}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor | MDN: Math.floor}
 */
async function fetchRandomPokemon() {
  try {
    const randomId = Math.floor(Math.random() * TOTAL_POKEMON) + 1;
    const response = await fetch(`${API_BASE_URL}/pokemon/${randomId}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    const processed = processPokemonData(data);
    return processed;
  } catch (error) {
    console.error('Error fetching random Pokemon:', error);
    return null;
  }
}

/**
 * Fetch multiple random Pokemon at once
 * @param {number} count - Number of Pokemon to fetch
 * @returns {Promise<Array<Object>>} Array of Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill | MDN: Array.fill}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | MDN: Array.map}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all | MDN: Promise.all}
 */
async function fetchMultipleRandomPokemon(count) {
  try {
    const promises = []; 
    for (let i = 0; i < count; i++) {
      promises.push(fetchRandomPokemon());
    }
    const pokemonList = await Promise.all(promises);
    return pokemonList;
  } catch (error) {
    console.error('Error fetching multiple Pokemon:', error);
    return [];
  }
}

/**
 * Process the raw Pokemon data into a more usable format
 * @param {Object} data - Raw Pokemon data from the API
 * @returns {Object} Processed Pokemon data
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map | MDN: Array.map}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | MDN: Array.find}
 */
function processPokemonData(data) {
  return {
    id: data.id,
    name: capitalizeFirstLetter(data.name),
    sprite: data.sprites.other['official-artwork'].front_default || data.sprites.front_default,
    types: data.types.map(t => t.type.name),
    height: data.height / 10,
    weight: data.weight / 10,
    abilities: data.abilities.map(a => capitalizeFirstLetter(a.ability.name)),
    stats: {
      hp: findStat(data.stats, 'hp'),
      attack: findStat(data.stats, 'attack'),
      defense: findStat(data.stats, 'defense'),
      speed: findStat(data.stats, 'speed')
    },
    speciesUrl: data.species.url
  };
}

/**
 * Find a specific stat from the stats array
 * @param {Array<Object>} stats - Stats array from the API
 * @param {string} statName - Name of the stat to find
 * @returns {number} Stat value
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find | MDN: Array.find}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining | MDN: Optional chaining}
 */
function findStat(stats, statName) {
  const stat = stats.find(s => s.stat.name === statName);
  return stat?.base_stat || 0;
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - String to capitalize
 * @returns {string} Capitalized string
 *
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charAt | MDN: String.charAt}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/slice | MDN: String.slice}
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace | MDN: String.replace}
 */
function capitalizeFirstLetter(string) {
  const fixedString = string.replace(/-/g, ' ');
  return fixedString.charAt(0).toUpperCase() + fixedString.slice(1);
}

window.PokemonService = {
  fetchRandomPokemon,
  fetchMultipleRandomPokemon
};