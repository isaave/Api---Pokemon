/**
 * js/view/user.service.js
 *
 * *AVISO*: Embora o nome e a localização sejam atípicos para um Service,
 * ele lida com a comunicação com a PokéAPI, conforme a funcionalidade Service.
 */
import { UserModel } from '../model/UserModel.js';

const BASE_URL = 'https://pokeapi.co/api/v2/';

export class UserService { // Mantendo o nome UserService para atender à sua estrutura
    
    /**
     * Busca uma lista paginada de Pokémons.
     */
    async listUsers(offset = 0, limit = 20) {
        try {
            const url = `${BASE_URL}pokemon?offset=${offset}&limit=${limit}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results; // Retorna a lista simples {name, url}
        } catch (error) {
            console.error("Erro ao buscar a lista de Pokémons:", error);
            return [];
        }
    }

    /**
     * Busca os detalhes de um Pokémon (identificado como "usuário" nesta camada).
     */
    async getUserDetails(identifier) {
        if (!identifier) return null;
        try {
            const url = `${BASE_URL}pokemon/${String(identifier).toLowerCase()}`;
            const response = await fetch(url);

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            // Converte os dados da API para o UserModel (que representa o Pokémon)
            return UserModel.fromApi(data);

        } catch (error) {
            console.error(`Erro ao buscar detalhes do "usuário" ${identifier}:`, error);
            return null;
        }
    }

    
}
