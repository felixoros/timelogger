import React, { ReactNode } from 'react';
import Modal from 'react-modal';
import './Dialog.css';
import { AiOutlineClose } from 'react-icons/ai';
import "react-datepicker/dist/react-datepicker.css";
import { AddNewProjectForm } from "../AddNewProjectForm/AddNewProjectForm";
import Alert from "../Alert/Alert";

const customStyles = {
    content: {
        'top': '50%',
        'left': '50%',
        'right': 'auto',
        'bottom': 'auto',
        'marginRight': '-50%',
        'transform': 'translate(-50%, -50%)',
        'borderRadius': '2px',
        'overflow': 'visible'
    }
};

Modal.setAppElement('#root')

export class Dialog extends React.Component<any, any> {
    public alertRef: React.RefObject<Alert>;
    public subtitle: HTMLHeadingElement | null;

    private readonly closeCallback: Function;

    constructor(props: any) {
        super(props);

        if (props.alertRef) {
            this.alertRef = props.alertRef;
        }

        if (props.closeCallback) {
            this.closeCallback = props.closeCallback;
        }

        this.state = { IsOpen: false };

        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.closeModalWithCallback = this.closeModalWithCallback.bind(this);

        this.render = this.render.bind(this);
    }

    public openModal(): void {
        this.setState({ IsOpen: true });
    }

    private afterOpenModal(): void {
        if (this.subtitle) {
            this.subtitle.style.color = '#ff0000';
        }
    }

    public closeModal(): void {
        this.setState({ IsOpen: false });
    }

    public closeModalWithCallback(): void {
        this.setState({ IsOpen: false });

        if (this.closeCallback)
            this.closeCallback();
    }

    public render(): ReactNode {
        return (
            <div>
                <Modal
                    isOpen={this.state.IsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Add New Project Dialog"
                    closeTimeoutMS={200}
                >
                    <div className="dialog-wrapper">
                        <div className="dialog-header">
                            <h2 ref={_subtitle => (this.subtitle = _subtitle)} className="primary-color">Add New Project</h2>
                            <AiOutlineClose
                                className="close-dialog"
                                onClick={this.closeModal}
                            />
                        </div>

                        <div className="dialog-content">
                           <AddNewProjectForm
                               alertRef={this.alertRef}
                               submitCallback={this.closeModalWithCallback}/>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}
//