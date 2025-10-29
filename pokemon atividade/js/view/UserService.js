// O Service é o responsável pela comunicação com a API.
// Ele é o único lugar do nosso código que "sabe" como falar com a PokéAPI.
import { UserModel } from '../model/UserModel.js';

// Endereço base da API que vamos consultar.
const BASE_URL = 'https://pokeapi.co/api/v2/';

export class UserService {
    
    // Este método busca uma lista paginada de Pokémons.
    async listUsers(offset = 0, limit = 20) {
        // Tentamos fazer a requisição de rede (por ser algo que pode falhar).
        try {
            // Monta a URL para pedir a lista, respeitando o limite e o ponto de partida (offset).
            const url = `${BASE_URL}pokemon?offset=${offset}&limit=${limit}`;
            const response = await fetch(url);

            // Verifica se a resposta foi bem-sucedida (status 200). Se não, lança um erro.
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Converte a resposta bruta em um objeto JavaScript.
            const data = await response.json();
            // Retorna apenas o array de resultados (nomes e URLs) para o Controller.
            return data.results;
        } catch (error) {
            // Em caso de falha de rede ou API, registra o erro e retorna uma lista vazia.
            console.error("Erro ao buscar a lista de Pokémons:", error);
            return [];
        }
    }

    // Este método busca os dados completos de um único Pokémon/Usuário.
    async getUserDetails(identifier) {
        if (!identifier) return null; // Se não tem identificador, não faz nada.
        
        // Tentamos fazer a requisição novamente.
        try {
            // Monta a URL para buscar o item específico (ID ou nome).
            const url = `${BASE_URL}pokemon/${String(identifier).toLowerCase()}`;
            const response = await fetch(url);

            // Tratamento de Erros:
            if (!response.ok) {
                // Se o erro for 404 (Não Encontrado), retornamos 'null' de forma limpa.
                if (response.status === 404) return null;
                // Para outros erros HTTP, lançamos a exceção.
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Missão cumprida do Service: Pega os dados brutos e os transforma
            // no formato de objeto que o nosso UserModel entende.
            return UserModel.fromApi(data);

        } catch (error) {
            // Se algo deu muito errado na rede, registra o erro e retorna null.
            console.error(`Erro ao buscar detalhes do "usuário" ${identifier}:`, error);
            return null;
        }
    }

    
}