/**
 * js/view/app.js
 */
import { UserController } from '../controller/UserController.js';

const POKEMON_LIST_EL = document.getElementById('pokemon-list');
const LOAD_MORE_BTN = document.getElementById('load-more-btn');
const SEARCH_FORM = document.getElementById('search-form');
const SEARCH_INPUT = document.getElementById('search-input');
const POKEMON_DETAILS_EL = document.getElementById('pokemon-details');
const TYPE_FILTER_CONTAINER_EL = document.getElementById('type-filter-buttons-container');

const controller = new UserController();

const createPokemonCard = (pokemon) => {
    const card = document.createElement('div');
    card.classList.add('pokemon-card', ...pokemon.type);
    card.dataset.pokemonName = pokemon.name; 

    const title = document.createElement('h3');
    title.textContent = `#${pokemon.id} ${pokemon.name.toUpperCase()}`;

    const image = document.createElement('img');
    image.src = pokemon.image;
    image.alt = pokemon.name;
    image.classList.add('pokemon-img');

    const typesContainer = document.createElement('div');
    pokemon.type.forEach(type => {
        const span = document.createElement('span');
        span.classList.add('pokemon-type', type);
        span.textContent = type.toUpperCase();
        typesContainer.appendChild(span);
    });

    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(typesContainer);

    card.addEventListener('click', () => renderUserDetails(pokemon));

    return card;
}

const renderUserList = (users, append = true) => {
    if (!append) POKEMON_LIST_EL.innerHTML = '';
    
    users.forEach(user => {
        const card = createPokemonCard(user);
        POKEMON_LIST_EL.appendChild(card);
    });
}

const renderUserDetails = (user) => {
    POKEMON_DETAILS_EL.innerHTML = '';
    
    if (!user) {
        POKEMON_DETAILS_EL.innerHTML = '<p class="error-message">Pokémon/Usuário não encontrado.</p>';
        return;
    }

    const container = document.createElement('div');
    container.classList.add('details-container');

    const header = document.createElement('h2');
    header.textContent = `#${user.id} ${user.name.toUpperCase()}`;
    
    const image = document.createElement('img');
    image.src = user.image;
    image.alt = user.name;
    image.classList.add('pokemon-img', 'large-img'); 

    container.appendChild(header);
    container.appendChild(image);

    POKEMON_DETAILS_EL.appendChild(container);
    POKEMON_DETAILS_EL.scrollIntoView({ behavior: 'smooth' });
}

const handleLoadMore = async () => {
    LOAD_MORE_BTN.disabled = true;
    LOAD_MORE_BTN.textContent = 'Carregando...';
    
    const newUsers = await controller.loadNextPageOfUsers();
    renderUserList(newUsers, true);
    
    LOAD_MORE_BTN.textContent = 'Carregar Mais';
    LOAD_MORE_BTN.disabled = false;
}

const handleSearch = async (event) => {
    event.preventDefault();
    const identifier = SEARCH_INPUT.value.trim().toLowerCase();
    if (!identifier) return;

    POKEMON_LIST_EL.innerHTML = ''; 
    LOAD_MORE_BTN.style.display = 'none';
    
    document.querySelectorAll('.type-filter-btn').forEach(btn => btn.classList.remove('active'));

    const user = await controller.searchUser(identifier);
    
    if (user) {
        renderUserList([user], false);
        renderUserDetails(user);
    } else {
        POKEMON_LIST_EL.innerHTML = '<p class="error-message">Nenhum Pokémon encontrado com este nome/ID.</p>';
        POKEMON_DETAILS_EL.innerHTML = '';
    }
}

const handleTypeFilter = (event) => {
    const button = event.target.closest('.type-filter-btn');
    if (!button) return;
    
    const filterType = button.dataset.filterType;
    
    document.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    if (filterType === 'all') {
        LOAD_MORE_BTN.style.display = 'block'; 
    } else {
        LOAD_MORE_BTN.style.display = 'none';
    }

    const cards = POKEMON_LIST_EL.querySelectorAll('.pokemon-card');

    cards.forEach(card => {
        const cardClassList = card.className.toLowerCase(); 
        
        if (filterType === 'all' || cardClassList.includes(filterType)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    POKEMON_LIST_EL.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.addEventListener('DOMContentLoaded', () => {
    handleLoadMore(); 
    
    const allButton = document.querySelector('.type-filter-btn[data-filter-type="all"]');
    if (allButton) allButton.classList.add('active');

    LOAD_MORE_BTN.addEventListener('click', handleLoadMore);
    SEARCH_FORM.addEventListener('submit', handleSearch);
    
    TYPE_FILTER_CONTAINER_EL.addEventListener('click', handleTypeFilter);
});