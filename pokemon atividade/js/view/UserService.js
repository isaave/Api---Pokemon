import { UserModel } from '../model/UserModel.js';

const BASE_URL = 'https://pokeapi.co/api/v2/';

export class UserService {
    
    async listUsers(offset = 0, limit = 20) {
        try {
            const url = `${BASE_URL}pokemon?offset=${offset}&limit=${limit}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.results;
        } catch (error) {
            console.error("Erro ao buscar a lista de Pokémons:", error);
            return [];
        }
    }

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
            return UserModel.fromApi(data);

        } catch (error) {
            console.error(`Erro ao buscar detalhes do "usuário" ${identifier}:`, error);
            return null;
        }
    }

    
}