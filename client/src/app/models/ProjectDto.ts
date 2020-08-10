import {ProjectState} from "../enums/ProjectState";

export class ProjectDto {
    public id: number;
    public name: string;
    public workedTime: number;
    public lastWorkedOn: string;
    public deadline: string;
    public state: ProjectState;
}