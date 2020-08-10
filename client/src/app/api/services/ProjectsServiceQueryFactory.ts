import {GetAllProjectsQuery} from "../project/queries/GetAllProjectsQuery";
import {ServiceApiFactory} from "./ServiceApiFactory";
import {SortingType} from "../../enums/SortingType";

export class ProjectsServiceQueryFactory extends ServiceApiFactory {
    public getAllProjectsQuery = (sortingType: SortingType): GetAllProjectsQuery => new GetAllProjectsQuery(this.restClient, sortingType);
}