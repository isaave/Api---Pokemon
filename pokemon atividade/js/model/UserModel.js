/**
 * js/model/user.model.js
 *
 * *AVISO*: Embora o nome seja 'user.model.js', ele está sendo usado como
 * a estrutura de dados (Model) para um Pokémon, conforme o escopo do projeto.
 */
export class UserModel {
    constructor(id, name, type, image, stats) {
        this.id = id;
        this.name = name;
        this.type = type; // Array de tipos (e.g., ['fire', 'flying'])
        this.image = image; // URL da imagem
        this.stats = stats; // Array de objetos {name: string, value: number}
    }

    // Método estático para converter o formato da PokéAPI para o nosso Model
    static fromApi(apiData) {
        if (!apiData) return null;

        const types = apiData.types.map(t => t.type.name);
        const stats = apiData.stats.map(s => ({
            name: s.stat.name,
            value: s.base_stat
        }));

        return new UserModel(
            apiData.id,
            apiData.name,
            types,
            apiData.sprites.front_default, // Imagem padrão
            stats
        );
    }
}