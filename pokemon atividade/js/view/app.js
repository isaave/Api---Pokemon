// O App é responsável por inicializar os outros módulos e é o ponto de partida da lógica.
import { UserController } from '../controller/UserController.js';

// --- Seleção de Elementos HTML ---

// 'Consts' que guardam referências para os elementos da página (a nossa "View").
const POKEMON_LIST_EL = document.getElementById('pokemon-list');
const LOAD_MORE_BTN = document.getElementById('load-more-btn');
const SEARCH_FORM = document.getElementById('search-form');
const SEARCH_INPUT = document.getElementById('search-input');
const POKEMON_DETAILS_EL = document.getElementById('pokemon-details');
const TYPE_FILTER_CONTAINER_EL = document.getElementById('type-filter-buttons-container');

// Inicializa o nosso Coordenador de Lógica (o Controller).
const controller = new UserController();

// --- Funções de Renderização (Desenhar na Tela) ---

// Função que constrói um cartão visual (Card) para um Pokémon.
const createPokemonCard = (pokemon) => {
    const card = document.createElement('div');
    // Adiciona classes para estilo, incluindo o(s) tipo(s) do Pokémon.
    card.classList.add('pokemon-card', ...pokemon.type);
    card.dataset.pokemonName = pokemon.name; 

    const title = document.createElement('h3');
    title.textContent = `#${pokemon.id} ${pokemon.name.toUpperCase()}`;

    const image = document.createElement('img');
    image.src = pokemon.image;
    image.alt = pokemon.name;
    image.classList.add('pokemon-img');

    const typesContainer = document.createElement('div');
    // Cria um 'span' para cada tipo (Ex: Fogo, Água).
    pokemon.type.forEach(type => {
        const span = document.createElement('span');
        span.classList.add('pokemon-type', type);
        span.textContent = type.toUpperCase();
        typesContainer.appendChild(span);
    });

    // Monta o cartão com título, imagem e tipos.
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(typesContainer);

    // Adiciona um "ouvido" ao cartão: quando clicar, mostra os detalhes.
    card.addEventListener('click', () => renderUserDetails(pokemon));

    return card;
}

// Função que coloca os cartões na lista principal da tela.
const renderUserList = (users, append = true) => {
    // Se 'append' for falso (como em uma busca), limpa a lista antes de adicionar.
    if (!append) POKEMON_LIST_EL.innerHTML = '';
    
    // Para cada Pokémon/Usuário, cria o cartão e o insere na lista.
    users.forEach(user => {
        const card = createPokemonCard(user);
        POKEMON_LIST_EL.appendChild(card);
    });
}

// Função que exibe o Pokémon selecionado na área de detalhes.
const renderUserDetails = (user) => {
    POKEMON_DETAILS_EL.innerHTML = ''; // Limpa a área de detalhes anterior.
    
    if (!user) {
        POKEMON_DETAILS_EL.innerHTML = '<p class="error-message">Pokémon/Usuário não encontrado.</p>';
        return;
    }

    // Cria os elementos básicos para mostrar o nome, ID e imagem grande.
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
    // Faz a tela rolar suavemente até a área de detalhes.
    POKEMON_DETAILS_EL.scrollIntoView({ behavior: 'smooth' });
}

// --- Funções de Evento (Interação) ---

// O que acontece quando o botão "Carregar Mais" é clicado.
const handleLoadMore = async () => {
    LOAD_MORE_BTN.disabled = true; // Desabilita o botão para evitar cliques duplicados.
    LOAD_MORE_BTN.textContent = 'Carregando...'; // Muda o texto para dar feedback.
    
    // Pede ao Controller a próxima página de dados (aqui o Controller chama o Service).
    const newUsers = await controller.loadNextPageOfUsers();
    // Renderiza a nova lista, adicionando ao final da lista existente.
    renderUserList(newUsers, true);
    
    // Restaura o botão ao normal.
    LOAD_MORE_BTN.textContent = 'Carregar Mais';
    LOAD_MORE_BTN.disabled = false;
}

// O que acontece quando o formulário de busca é enviado.
const handleSearch = async (event) => {
    event.preventDefault(); // Impede o recarregamento da página.
    const identifier = SEARCH_INPUT.value.trim().toLowerCase();
    if (!identifier) return;

    POKEMON_LIST_EL.innerHTML = ''; // Limpa a lista existente.
    LOAD_MORE_BTN.style.display = 'none'; // Esconde o botão de carregar mais.
    
    // Remove o destaque de qualquer botão de filtro de tipo.
    document.querySelectorAll('.type-filter-btn').forEach(btn => btn.classList.remove('active'));

    // Pede ao Controller para buscar um Pokémon específico.
    const user = await controller.searchUser(identifier);
    
    if (user) {
        // Se achou, mostra o Pokémon na lista e nos detalhes.
        renderUserList([user], false);
        renderUserDetails(user);
    } else {
        // Se não achou, mostra uma mensagem de erro na lista e limpa os detalhes.
        POKEMON_LIST_EL.innerHTML = '<p class="error-message">Nenhum Pokémon encontrado com este nome/ID.</p>';
        POKEMON_DETAILS_EL.innerHTML = '';
    }
}

// O que acontece quando um botão de filtro de tipo é clicado.
const handleTypeFilter = (event) => {
    const button = event.target.closest('.type-filter-btn');
    if (!button) return; // Garante que só continua se clicou num botão.
    
    const filterType = button.dataset.filterType;
    
    // Remove o destaque de todos os botões e destaca o botão clicado.
    document.querySelectorAll('.type-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');

    // Mostra ou esconde o botão de Carregar Mais dependendo do filtro.
    if (filterType === 'all') {
        LOAD_MORE_BTN.style.display = 'block'; 
    } else {
        LOAD_MORE_BTN.style.display = 'none';
    }

    const cards = POKEMON_LIST_EL.querySelectorAll('.pokemon-card');

    // Itera por todos os cartões para mostrar/esconder de acordo com o filtro.
    cards.forEach(card => {
        const cardClassList = card.className.toLowerCase(); 
        
        // Se for filtro 'all' ou o cartão tiver a classe do tipo, mostra o cartão.
        if (filterType === 'all' || cardClassList.includes(filterType)) {
            card.style.display = 'block';
        } else {
            // Caso contrário, esconde o cartão.
            card.style.display = 'none';
        }
    });
    
    // Rola a tela para o topo da lista.
    POKEMON_LIST_EL.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- Inicialização (Acontece quando a página carrega) ---

// O Listener principal que garante que o JavaScript só roda quando o HTML está pronto.
document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicia o carregamento da primeira página de Pokémons.
    handleLoadMore(); 
    
    // 2. Garante que o botão "Todos" (all) esteja selecionado no início.
    const allButton = document.querySelector('.type-filter-btn[data-filter-type="all"]');
    if (allButton) allButton.classList.add('active');

    // 3. Adiciona os "ouvidos" aos botões principais da página para reagir às ações do usuário.
    LOAD_MORE_BTN.addEventListener('click', handleLoadMore);
    SEARCH_FORM.addEventListener('submit', handleSearch);
    
    TYPE_FILTER_CONTAINER_EL.addEventListener('click', handleTypeFilter);
});