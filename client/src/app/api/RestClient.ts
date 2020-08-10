import axios, { AxiosResponse } from "axios";

export class RestClient {
	private readonly url: string;
	public static requestQueue: number = 0;

	constructor(url: string) {
		this.url = url;
	}

	public post(endpoint: string, data?: any): Promise<AxiosResponse> {
		RestClient.requestQueue++;
		return axios.post(this.url + endpoint, data).finally(() => { RestClient.requestQueue--; });
	}

	public get (endpoint: string): Promise<AxiosResponse> {
		RestClient.requestQueue++;
		return axios.get(this.url + endpoint).finally(() => { RestClient.requestQueue--; });
	}
}
