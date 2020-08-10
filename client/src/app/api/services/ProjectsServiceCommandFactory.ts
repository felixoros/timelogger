import {AddNewProjectCommand} from "../project/commands/AddNewProjectCommand";
import {ServiceApiFactory} from "./ServiceApiFactory";
import {StartTimeForProjectCommand} from "../project/commands/StartTimeForProjectCommand";
import {StopTimeForProjectCommand} from "../project/commands/StopTimerForProjectCommand";

export class ProjectsServiceCommandFactory extends ServiceApiFactory {
    public addNewProjectCommand = (name: string, deadline: Date): AddNewProjectCommand => new AddNewProjectCommand(this.restClient, name, deadline.toUTCString());
    public startTimerForProjectCommand = (projectId: number): StartTimeForProjectCommand => new StartTimeForProjectCommand(this.restClient, projectId);
    public stopTimerForProjectCommand = (projectId: number): StopTimeForProjectCommand => new StopTimeForProjectCommand(this.restClient, projectId);
}