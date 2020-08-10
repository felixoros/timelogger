import React, {FormEvent, ReactNode} from "react";
import DatePicker from "react-datepicker";
import {ProjectsServiceCommandFactory} from "../../api/services/ProjectsServiceCommandFactory";
import {_projectsServiceCommandFactory} from "../../App";
import Alert from "../Alert/Alert";

export class AddNewProjectForm extends React.Component<any, any> {
    public alertRef: React.RefObject<Alert>;

    private submitCallback: Function;
    private readonly alphanumericRegex = "^[a-zA-Z0-9_]*$";
    private readonly projectsCommandFactory: ProjectsServiceCommandFactory = _projectsServiceCommandFactory;

    constructor(props: any) {
        super(props);

        if (props.alertRef) {
            this.alertRef = props.alertRef;
        }

        if (props.submitCallback) {
            this.submitCallback = props.submitCallback;
        }

        this.state = { projectName: '', isProjectNameInvalid: false, startDate: new Date(), isBlocked: false };

        this.changeProjectName = this.changeProjectName.bind(this);
        this.changeDatepickerDate = this.changeDatepickerDate.bind(this);
        this.isFormValid = this.isFormValid.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    public changeProjectName(event: React.ChangeEvent<HTMLInputElement>): void {
        const projectName = event.target.value.trim();

        this.setState({projectName: projectName});
        if (projectName && projectName.match(this.alphanumericRegex)) {
            this.setState({isProjectNameInvalid: false});
        } else {
            this.setState({isProjectNameInvalid: true});
        }
    };

    public changeDatepickerDate(date: Date | [Date, Date] | null): void {
        this.setState({startDate: date});
    };

    public isFormValid(): boolean {
        return !!(this.state.projectName && this.state.projectName.match(this.alphanumericRegex));
    }

    public onFormSubmit(formEvent: FormEvent<HTMLFormElement>): void {
        formEvent.preventDefault();

        if (!this.isFormValid() || this.projectsCommandFactory.hasOngoingRequests())
            return;

        this.setState(
            {isBlocked: true},
            () => {
                this.alertRef.current?.show("info", "Info", "Creating new project please wait");

                this.projectsCommandFactory
                    .addNewProjectCommand(this.state.projectName, this.state.startDate)
                    .execute()
                    .then((response: any) => {
                        if (response.data) {
                            this.alertRef.current?.show("success", "Success", "New project was created successfully");

                            if(this.submitCallback)
                                this.submitCallback();
                        }
                    })
                    .finally(() => {
                        this.setState({isBlocked: false});
                    });
            }
        );

    }

    public render(): ReactNode {
        return (
            <form className="add-new-project-dialog" onSubmit={this.onFormSubmit}>
                <div className={"form-group "+ (this.state.isProjectNameInvalid ? "is-invalid" : "")}>
                    <label className="" htmlFor="projectName">Project Name</label>
                    <input type="text" placeholder="Please enter new project name" onChange={this.changeProjectName}/>
                    <div className="invalid-message">Invalid project name, it should contain only alphanumerics</div>
                </div>

                <div className="form-group">
                    <label className="" htmlFor="deadline">Project Deadline</label>
                    <DatePicker
                        minDate={new Date()}
                        selected={this.state.startDate}
                        onChange={this.changeDatepickerDate}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>

                <div className="submit-button-wrapper">
                    <button className="primary-button" disabled={!this.isFormValid() || this.state.isBlocked}>
                        Create New Project
                    </button>
                </div>

            </form>
        );
    }
}