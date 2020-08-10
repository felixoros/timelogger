import {RestClient} from "../RestClient";

export class ServiceApiFactory {
    protected readonly restClient: RestClient;

    constructor(restClient: RestClient) {
        this.restClient = restClient;
    }

    public hasOngoingRequests(): boolean {
        return RestClient.requestQueue > 0;
    }
}