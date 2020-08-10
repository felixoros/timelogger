import React, {ReactNode} from "react";
import "./Loader.css";

export default class Loader extends React.Component<any, any> {
    constructor(props: any) {
        super(props);

        this.state = { isLoading: false };
    }

    public componentDidMount(): void {
        if (this.props.isLoading) {
            this.setState({ isLoading: true })
        }
    }

    // @ts-ignore
    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any): void {
        if (this.state.isLoading !== prevState.isLoading || this.props.isLoading !== prevProps.isLoading) {
            this.setState({isLoading: this.props.isLoading});
        }
    }

    public render(): ReactNode {
        return (
            <>
                <div className={"loader-wrapper " + (this.state.isLoading === false ? "is-hidden" : "")}>
                    <div className="lds-roller">
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                        <div/>
                    </div>
                </div>
            </>
        );
    }
}