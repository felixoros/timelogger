import {ICommand} from "../../ICommand";
import {RestClient} from "../../RestClient";
import {AxiosResponse} from "axios";

export class AddNewProjectCommand implements ICommand<any> {
    private readonly restClient: RestClient;
    private readonly name: string;
    private readonly deadline: string;

    constructor(httpClient: RestClient, name: string, deadline: string) {
        this.restClient = httpClient;
        this.name = name;
        this.deadline = deadline;
    }

    public execute = (): Promise<AxiosResponse> =>
        this.restClient.post(`/projects/new/${this.name}/${this.deadline}`);
}
