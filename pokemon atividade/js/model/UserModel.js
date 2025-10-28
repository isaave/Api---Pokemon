export class UserModel {
    constructor(id, name, type, image, stats) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.image = image;
        this.stats = stats;
    }

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
            apiData.sprites.front_default,
            stats
        );
    }
}