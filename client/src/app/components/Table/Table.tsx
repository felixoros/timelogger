import React, {ReactNode} from 'react';
import './Table.css';
import {ProjectState} from "../../enums/ProjectState";
import {DateHelper} from "../../helpers/DateHelper";
import {ProjectsServiceCommandFactory} from "../../api/services/ProjectsServiceCommandFactory";
import {_projectsServiceCommandFactory} from "../../App";
import Alert from "../Alert/Alert";
import {ProjectDto} from "../../models/ProjectDto";

export default class Table extends React.Component<any, any> {
	public alertRef: React.RefObject<Alert>;

	private submitCallback: Function;

	private readonly activityIntervalEveryMinute = 60000;
	private readonly projectsCommandFactory: ProjectsServiceCommandFactory = _projectsServiceCommandFactory;

	private timerIntervalMap: Map<number, NodeJS.Timeout | null> = new Map<number, NodeJS.Timeout | null>();
	private timerMap: Map<number, number> = new Map<number, number>();
	private totalTimeSpentTimerMap: Map<number, number> = new Map<number, number>();

	constructor(props: any) {
		super(props);

		if (props.alertRef) {
			this.alertRef = props.alertRef;
		}

		if (props.submitCallback) {
			this.submitCallback = props.submitCallback;
		}

		if (props.projects) {
			this.state = { isHidden: false, projects: props.projects, isBlocked: false };
		} else {
			this.state = { isHidden: false, projects: [], isBlocked: false };
		}

		this.tryStartTimer = this.tryStartTimer.bind(this);
		this.getProjectStateName = this.getProjectStateName.bind(this);
		this.isProjectActive = this.isProjectActive.bind(this);
		this.getTimeSpent = this.getTimeSpent.bind(this);
		this.getActiveTime = this.getActiveTime.bind(this);
		this.isStopButtonDisabled = this.isStopButtonDisabled.bind(this);
	}

	// @ts-ignore
	public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
		if (this.state.isHidden !== prevState.isHidden || this.props.isHidden !== prevProps.isHidden) {
			this.setState({isHidden: this.props.isHidden});
		}

		if (this.state.projects !== prevState.projects || this.props.projects !== prevProps.projects) {
			this.setState({projects: this.props.projects});
		}
	}

	public tryStartTimer (project: any): void {
		if (!this.timerIntervalMap.get(project.id)) {
			this.timerIntervalMap.set(project.id,
				setInterval(() => {
					if (project.state === ProjectState.Active) {
						this.timerMap.set(project.id, DateHelper.computeTimeDifferenceFromNow(project.lastWorkedOn));
						this.totalTimeSpentTimerMap.set(project.id, project.workedTime + DateHelper.computeTimeDifferenceFromNow(project.lastWorkedOn));
						this.forceUpdate();
					} else {
						if (this.timerIntervalMap.get(project.id)) {
							const timerIntervalMapTimeout = this.timerIntervalMap.get(project.id);
							if (timerIntervalMapTimeout) {
								clearInterval(timerIntervalMapTimeout);
							}
							this.timerIntervalMap.delete(project.id);
						}

						if (this.timerMap.get(project.id)) {
							const timerMapTimeout = this.timerMap.get(project.id);
							if (timerMapTimeout) {
								clearInterval(timerMapTimeout);
							}
							this.timerMap.delete(project.id);
						}

						this.totalTimeSpentTimerMap.delete(project.id);
					}
				}, this.activityIntervalEveryMinute)
			);
		}
	}

	public getProjectStateName(state: ProjectState): string {
		switch (state) {
			case ProjectState.NotStarted: return 'Not Started';
			case ProjectState.Ongoing: return 'Ongoing';
			case ProjectState.Active: return 'Active';
			case ProjectState.Finished: return 'Finished';
		}
	}

	public getTimeSpent(project: ProjectDto): number {
		const totalTimeSpentFromMap = this.totalTimeSpentTimerMap.get(project.id);
		if (totalTimeSpentFromMap) {
			return totalTimeSpentFromMap;
		}
		return project.workedTime;
	}

	public getActiveTime(project: ProjectDto): number {
		const activeTime = this.timerMap.get(project.id);
		if (activeTime) {
			return activeTime;
		}

		return DateHelper.computeTimeDifferenceFromNow(project.lastWorkedOn);
	}

	public isProjectActive(state: ProjectState): boolean {
		return state === ProjectState.Active;
	}

	public isProjectFinished(state: ProjectState): boolean {
		return state === ProjectState.Finished;
	}

	public isStopButtonDisabled(project: ProjectDto): boolean {
		if (project.state === ProjectState.Active) {
			const activeTime = this.getActiveTime(project);
			if (activeTime >= 30)
				return false;
		}
		return true;
	}

	public startWorkingOnProject (project: ProjectDto) {
		this.setState(
			{isBlocked: true},
			() => {
				this.alertRef.current?.show("info", "Info", "Starting timer for " + project.name + " ... Please wait");

				this.projectsCommandFactory
					.startTimerForProjectCommand(project.id)
					.execute()
					.then((response: any) => {
						if (response.data) {
							this.alertRef.current?.show("success", "Success", "Timer for project " + project.name + " was successfully started");

							if (this.submitCallback)
								this.submitCallback();
						}
					})
					.finally(() => {
						this.setState({isBlocked: false});
					});
			}
		);
	}

	public stopWorkingOnProject (project: any) {
		this.setState(
			{isBlocked: true},
			() => {
				this.alertRef.current?.show("info", "Info", "Stopping timer for " + project.name + " ... Please wait");

				this.projectsCommandFactory
					.stopTimerForProjectCommand(project.id)
					.execute()
					.then((response: any) => {
						if (response.data) {
							this.alertRef.current?.show("success", "Success", "Timer for project " + project.name + " was successfully stopped");

							if (this.submitCallback)
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
		const rows = [];
		for (let i = 0; i < this.state.projects.length; i++) {
			const project = this.state.projects[i];
			this.tryStartTimer(project);

			rows.push(
				<tr key={i} className={(this.isProjectActive(project.state) ? "is-active" : "") + (this.isProjectFinished(project.state)? " is-finished" : "")}>
					<td className="border px-4 py-2 w-12">{i + 1}</td>
					<td className="border px-4 py-2 w-12">{project.name}</td>
					<td className="border px-4 py-2 w-12">{this.getTimeSpent(project)} Minutes</td>
					<td className="border px-4 py-2 w-12">{DateHelper.beautifyDate(project.deadline)}</td>
					<td className="border px-4 py-2 w-12 activity-cell">
						<div>{this.getProjectStateName(project.state)}</div>
						<div className="timer">({this.getActiveTime(project)} Minutes)</div>

						<div>
							<button
								className="primary-button"
								onClick={() => {this.startWorkingOnProject(project)}}>
								Start
							</button>

							<button
								className="red-button"
								disabled={this.isStopButtonDisabled(project)}
								onClick={() => {this.stopWorkingOnProject(project)}}>
								Stop
							</button>
						</div>
					</td>
				</tr>);
		}

		return (
			<table className={"table-fixed w-full " + (this.state.isHidden ? "is-hidden" : "")}>
				<thead className="bg-gray-200">
				<tr>
					<th className="border px-4 py-2 w-12">No.</th>
					<th className="border px-4 py-2">Project Name</th>
					<th className="border px-4 py-2">Total Time Spent</th>
					<th className="border px-4 py-2">Deadline</th>
					<th className="border px-4 py-2">Activity</th>
				</tr>
				</thead>
				<tbody>
					{rows}
				</tbody>
			</table>
		);
	}
}