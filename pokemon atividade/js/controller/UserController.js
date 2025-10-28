import { UserService } from '../view/UserService.js';

export class UserController {
    constructor() {
        this.service = new UserService();
        this.offset = 0;
        this.limit = 20;
    }

    async loadNextPageOfUsers() {
        const list = await this.service.listUsers(this.offset, this.limit);
        
        const detailPromises = list.map(p => this.service.getUserDetails(p.name));
        const detailedUsers = await Promise.all(detailPromises);
        
        this.offset += this.limit;
        
        return detailedUsers.filter(p => p !== null);
    }

    async searchUser(identifier) {
        return this.service.getUserDetails(identifier);
    }
}