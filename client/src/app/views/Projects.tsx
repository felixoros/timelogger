import React, {ReactNode} from 'react';
import Table from "../components/Table/Table";
import { Dialog } from "../components/Dialog/Dialog";
import Loader from "../components/Loader/Loader";
import {ProjectsServiceQueryFactory} from "../api/services/ProjectsServiceQueryFactory";
import {_projectsServiceQueryFactory} from "../App";
import {EnumerateProjectsDto} from "../models/EnumerateProjectsDto";
import {AxiosResponse} from "axios";
import Alert from "../components/Alert/Alert";
import {SortingType} from "../enums/SortingType";
import "./Projects.css";

export default class Projects extends React.Component<any, any> {
	public dialogRef: React.RefObject<Dialog>;
	public alertRef: React.RefObject<Alert>;

	private readonly projectsServiceQueryFactory: ProjectsServiceQueryFactory = _projectsServiceQueryFactory;

	constructor(props: any) {
		super(props);

		this.dialogRef = React.createRef();

		if(props.alertRef) {
			this.alertRef = props.alertRef;
		}

		this.state = {isLoading: false, projects: [], sortingType: SortingType.Normal};

		this.getAllProjects = this.getAllProjects.bind(this);
		this.refresh = this.refresh.bind(this);
		this.openAddNewProjectDialog = this.openAddNewProjectDialog.bind(this);
		this.toggleSoringType = this.toggleSoringType.bind(this);
	}

	public componentDidMount(): void {
		this.getAllProjects();
	}

	public refresh(): void {
		this.getAllProjects();
	}

	public toggleSoringType(): void {
		if (this.state.sortingType === SortingType.Normal)
			this.setState({sortingType: SortingType.AscendingByDeadline}, () => {this.refresh()});
		else
			this.setState({sortingType: SortingType.Normal},() => {this.refresh()});
	}

	public getAllProjects (): void {
		this.setState(
			{isLoading: true},
			() => {
				this.projectsServiceQueryFactory
					.getAllProjectsQuery(this.state.sortingType)
					.execute()
					.then((response: AxiosResponse<EnumerateProjectsDto>) => {
						if (response.data) {
							this.setState({projects: response.data.entries})
							this.alertRef.current?.show("success", "Success", "Projects were successfully retrieved");
						}
					})
					.finally(() => {
						this.setState({isLoading: false});
					});
			});
	}

	public openAddNewProjectDialog(): void {
		if (this.dialogRef.current) {
			this.dialogRef.current.openModal();
		}
	}

	public render(): ReactNode {
		return (
			<>
				<div className="flex items-center my-6">
					<div className="w-1/2">
						<button
							className="primary-button"
							onClick={this.openAddNewProjectDialog}>
							Add New Project
						</button>
					</div>

					<div className="w-1/2 flex justify-end">
						<button
							className={"primary-button toggle-sorting-button " + (this.state.sortingType === SortingType.AscendingByDeadline ? "is-active" : "")}
							onClick={this.toggleSoringType}
							disabled={this.state.isLoading}>
							Sort Ascending By Deadline
						</button>

					</div>
				</div>

				<Table submitCallback={this.refresh} alertRef={this.alertRef} isHidden={this.state.isLoading} projects={this.state.projects}/>
				<Dialog closeCallback={this.refresh} alertRef={this.alertRef} ref={this.dialogRef} />
				<Loader isLoading={this.state.isLoading} />
			</>
		);
	}
}