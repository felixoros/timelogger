import {ICommand} from "../../ICommand";
import {RestClient} from "../../RestClient";
import {AxiosResponse} from "axios";
import {EnumerateProjectsDto} from "../../../models/EnumerateProjectsDto";
import {SortingType} from "../../../enums/SortingType";

export class GetAllProjectsQuery implements ICommand<any> {
    private readonly restClient: RestClient;
    private readonly sortingType: SortingType;

    constructor(restClient: RestClient, sortingType: SortingType) {
        this.restClient = restClient;
        this.sortingType = sortingType;
    }

    public execute = (): Promise<AxiosResponse<EnumerateProjectsDto>> =>
        this.restClient.get(`/projects/${this.sortingType}`);
}
