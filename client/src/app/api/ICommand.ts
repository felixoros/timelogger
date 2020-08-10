export interface ICommand<T> {
    execute(showLoader: boolean): T;
}
