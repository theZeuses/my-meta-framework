export abstract class Repository<I> {
    private model: I;

    constructor (model: I) {
        this.model = model;
    }

    query() {
        return this.model;
    }
}