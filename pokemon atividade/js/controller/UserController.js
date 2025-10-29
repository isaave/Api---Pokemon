//a user controle ela é  acorde adora que recebe comando da interface e decide qual service vai chamar
import { UserService } from '../view/UserService.js';

//o contructor chamado dps de criar o usercontroler
export class UserController {
    constructor() {
        this.service = new UserService(); //armazenando o objeto
        this.offset = 0; // posicao 0 no inicio
        this.limit = 20; // maximo de itens
    }

//operacao assincrona para esperar a resposta da api
    async loadNextPageOfUsers() {
        const list = await this.service.listUsers(this.offset, this.limit); //vai chamar o service para buscar os 20 pokemons e o await pausa a execucao ate retornar a lista
        const detailPromises = list.map(p => this.service.getUserDetails(p.name)); // transforma a lista em um array que busca detalhes 
        const detailedUsers = await Promise.all(detailPromises); // armazena os pokemons com seus dados completos, promise.all executa todas as promessas ao mesmo tempo
        
        this.offset += this.limit; // muda  a posiçao inicial do offset para proxima busca
        
        return detailedUsers.filter(p => p !== null); //retorna os dados em um array final e null em caso de erro 
    }
//va retornar vai retornar o service
    async searchUser(identifier) {
        return this.service.getUserDetails(identifier);
    }
}