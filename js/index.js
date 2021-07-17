const upBtn = document.getElementById("up-btn");
const rightBtn = document.getElementById("right-btn");
const downBtn = document.getElementById("down-btn");
const leftBtn = document.getElementById("left-btn");
const tip = document.getElementById("tip");
const closeTipBtn = document.getElementById("close-tip");

const pokemonImgContainer = document.getElementById("pokemon-img-container");
const pokemonIdContainer = document.getElementById("pokemon-id");
const pokemonName = document.getElementById("pokemon-name");
const pokemonType = document.getElementById("pokemon-type");
const pokemonHeight = document.getElementById("height");
const pokemonWeight = document.getElementById("weight");
const pokemonFact = document.getElementById("pokemon-fact");
const pokemonInputSearch = document.getElementById("pokemon-input-search");

const pokemonEndpoint = "https://pokeapi.co/api/v2/pokemon/";
const pokemonSpeciesEndpoint = "https://pokeapi.co/api/v2/pokemon-species/";

let currentPokemonId = 1;
let requestId = 0;

let pokemonImprovedSearch = debounce(async function (idOrName) {
    let searchId = ++requestId;
    let pokemon;

    // validation
    idOrName = idOrName.trim();
    if (idOrName == "") return;

    try {
        pokemon = await fetchPokemon(idOrName);
    } catch (error) {
        console.log(error);
        return;
    }

    if (searchId != requestId || !pokemon) return;

    currentPokemonId = pokemon[0].id;

    fillPokemonFields(pokemon);
}, 300);

async function fetchPokemon(idOrName) {
    let responses = await Promise.all([
        fetch(pokemonEndpoint + idOrName),
        fetch(pokemonSpeciesEndpoint + idOrName)
    ]);

    if (!responses[0].ok || !responses[1].ok) return null;

    return [
        await responses[0].json(),
        await responses[1].json()
    ];
}

function fillPokemonFields(pokemon) {
    let res0 = pokemon[0];
    let res1 = pokemon[1];

    pokemonFact.scrollTop = 0;

    pokemonImgContainer.style.backgroundImage = `url(${res0.sprites.front_default})`;
    pokemonIdContainer.textContent = "No." + ("000" + res0.id).substr(-3);
    pokemonName.textContent = res0.name.toUpperCase();
    pokemonType.textContent = res0.types[0].type.name.toUpperCase();
    pokemonHeight.textContent = parseFloat(res0.height) / 10 + "M";
    pokemonWeight.textContent = parseFloat(res0.weight) / 10 + "KG";

    pokemonFact.textContent = res1.flavor_text_entries[0].flavor_text.replace(/\n|\r|\f/g, " ");

    //pokemonSearch.value = "";
};

function debounce(fn, delay) {
    let timer;

    return function (...args) {
        clearTimeout(timer);

        timer = setTimeout(function () {
            fn(...args);
        }, delay);
    };
}

upBtn.addEventListener("click", function () {
    pokemonFact.scrollBy({
        top: -20,
        behavior: "smooth"
    });
});

downBtn.addEventListener("click", function () {
    pokemonFact.scrollBy({
        top: 20,
        behavior: "smooth"
    });
});

rightBtn.addEventListener("click", async function () {
    let searchId = ++requestId;
    let pokemon;

    try {
        pokemon = await fetchPokemon(++currentPokemonId);
    } catch (error) {
        console.log(error);
        return;
    }

    if (searchId != requestId) return;

    if (!pokemon) {
        currentPokemonId--;
        return;
    }

    currentPokemonId = pokemon[0].id;

    fillPokemonFields(pokemon);
});

leftBtn.addEventListener("click", async function () {
    let searchId = ++requestId;
    let pokemon;

    try {
        pokemon = await fetchPokemon(--currentPokemonId);
    } catch (error) {
        console.log(error);
        return;
    }

    if (searchId != requestId) return;

    if (!pokemon) {
        currentPokemonId++;
        return;
    }

    currentPokemonId = pokemon[0].id;

    fillPokemonFields(pokemon);
});

pokemonInputSearch.addEventListener("input", function () {
    pokemonImprovedSearch(this.value);
});

closeTipBtn.addEventListener("click", function () {
    tip.remove();
});

fetchPokemon(currentPokemonId)
    .then(pokemon => {
        fillPokemonFields(pokemon);
    })
    .catch(error => {
        console.log(error);
    });