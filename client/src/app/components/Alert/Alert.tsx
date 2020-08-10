import React, {ReactNode} from "react";
import "./Alert.css";

export default class Alert extends React.Component<any, any> {
    private readonly dismissTimer: number = 5000;

    constructor(props: any) {
        super(props);

        this.state = {
            isVisible: false,
            alertType: "info",
            alertTitle: "",
            alertText: "",
        };

        this.shouldShowAlertBar = this.shouldShowAlertBar.bind(this);
        this.dismiss = this.dismiss.bind(this);
        this.show = this.show.bind(this);
        this.getAlertClasses = this.getAlertClasses.bind(this);
    }

    public shouldShowAlertBar (): boolean {
        if (this.state.isVisible && this.state.alertTitle && this.state.alertText)
            return true;
        return false;
    }

    private dismiss(): void {
        this.setState({isVisible: false});
    }

    public show(type: string, title: string, message: string): void {
        this.setState(
            {isVisible: true, alertType: type, alertTitle: title, alertText: message},
            () => {
                setTimeout(this.dismiss, this.dismissTimer);
            });
    }

    public getAlertClasses(): string[] {
        let alertClasses = ["bg-blue-500", "border-blue-400", "bg-blue-100", "text-blue-700"];

        if (this.state.alertType === "error") {
            alertClasses = ["bg-red-500", "border-red-400", "bg-red-100", " text-red-700"];
        }

        if (this.state.alertType === "success") {
            alertClasses = ["bg-green-500", "border-green-400", "bg-green-100", " text-green-700"];
        }

        return alertClasses;
    }

    public render(): ReactNode {
        const alertClasses = this.getAlertClasses();

        return (
            <div className={"alert-wrapper " + (this.shouldShowAlertBar() ? "show" : "")}>
                <div role="alert">
                    <div className={"text-white font-bold rounded-t px-4 py-2 " + alertClasses[0]}>
                        {this.state.alertTitle}
                    </div>
                    <div className={"border border-t-0 rounded-b px-4 py-3 " + alertClasses[1] + " " + alertClasses[2] + " " + alertClasses[3]}>
                        <p>{this.state.alertText}</p>
                    </div>
                </div>
            </div>
        );
    }
}