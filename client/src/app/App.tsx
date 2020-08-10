import * as React from 'react';
import Projects from './views/Projects';
import './tailwind.generated.css';
import './css/colors.css';
import './css/main.css';
import {RestClient} from "./api/RestClient";
import {ProjectsServiceCommandFactory} from "./api/services/ProjectsServiceCommandFactory";
import {ProjectsServiceQueryFactory} from "./api/services/ProjectsServiceQueryFactory";
import {ReactNode} from "react";
import Alert from "./components/Alert/Alert";

const restClient = new RestClient("http://localhost:3001/api");
export const _projectsServiceCommandFactory = new ProjectsServiceCommandFactory(restClient);
export const _projectsServiceQueryFactory = new ProjectsServiceQueryFactory(restClient);

export default class App extends React.Component<any, any> {
    public alertRef: React.RefObject<Alert>;

    constructor(props: any) {
        super(props);

        this.alertRef = React.createRef();
    }

    public render(): ReactNode {
        return (
            <>
                <header className="bg-primary-color text-white flex items-center h-12 w-full">
                    <div className="container mx-auto">
                        <a className="navbar-brand" href="/">Timelogger</a>
                    </div>
                </header>

                <main>
                    <div className="container mx-auto">
                        <Projects alertRef={this.alertRef}/>
                        <Alert ref={this.alertRef}/>
                    </div>
                </main>
            </>
        );
    }
}