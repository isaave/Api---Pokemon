//a model ela seria a parte do banco de dados, onde vai ser armazenado e aplicado os dados

//define os atributos de cada pokemon
export class UserModel {
    constructor(id, name, type, image, stats) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.image = image;
        this.stats = stats;
    }

    static fromApi(apiData) {
        if (!apiData) return null; // limpa os dados banguçados da api e se n tiver nada para

        const types = apiData.types.map(t => t.type.name); //pega apenas nomes dos tipos
        const stats = apiData.stats.map(s => ({  //Extraímos as estatísticas, pegando apenas o nome e o valor de cada uma
            name: s.stat.name,
            value: s.base_stat
        }));
//criou e devolve um pokemon no formato normal
        return new UserModel(
            apiData.id,
            apiData.name,
            types,
            apiData.sprites.front_default,
            stats
        );
    }
}