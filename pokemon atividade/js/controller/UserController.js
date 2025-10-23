/**
 * js/controller/usercontroller.js
 *
 * *AVISO*: Embora o nome seja 'usercontroller.js', ele coordena a
 * lógica de negócio para buscar e processar dados de Pokémons.
 */
import { UserService } from '../view/UserService.js'; // Importa do Service

export class UserController { // Mantendo o nome UserController
    constructor() {
        this.service = new UserService();
        this.offset = 0;
        this.limit = 20;
    }

    /**
     * Carrega a próxima página de Pokémons/Usuários.
     */
    async loadNextPageOfUsers() {
        // Usa listUsers do Service, que busca Pokémons
        const list = await this.service.listUsers(this.offset, this.limit);
        
        // Pega os detalhes de cada Pokémon (Usuário)
        const detailPromises = list.map(p => this.service.getUserDetails(p.name));
        const detailedUsers = await Promise.all(detailPromises);
        
        // Atualiza o offset
        this.offset += this.limit;
        
        return detailedUsers.filter(p => p !== null);
    }

    /**
     * Busca um Pokémon/Usuário específico.
     */
    async searchUser(identifier) {
        // Usa getUserDetails do Service, que busca detalhes do Pokémon
        return this.service.getUserDetails(identifier);
    }
}