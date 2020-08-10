import {ICommand} from "../../ICommand";
import {RestClient} from "../../RestClient";
import {AxiosResponse} from "axios";

export class StartTimeForProjectCommand implements ICommand<any> {
    private readonly restClient: RestClient;
    private readonly projectId: number;

    constructor(httpClient: RestClient, projectId: number) {
        this.restClient = httpClient;
        this.projectId = projectId;
    }

    public execute = (): Promise<AxiosResponse> =>
        this.restClient.post(`/projects/start/${this.projectId}`);
}
