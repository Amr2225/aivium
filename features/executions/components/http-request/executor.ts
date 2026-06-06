import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import type { AxiosResponse, AxiosRequestConfig as RequestOptions } from "axios"
import axios from "axios";
import https from "https";

type HttpRequestData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: string;
}
const api = axios.create({
    httpsAgent: new https.Agent({
        keepAlive: false,
        // rejectUnauthorized: false // Bypasses SSL verification
    }),
    httpAgent: new https.Agent({
        keepAlive: false,
    })
});
export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({ data, nodeId, context, step }) => {
    // TODO: Publish "loading" state for manual trigger

    if (!data.endpoint) {
        // TODO: Publish "error" state for manual trigger
        throw new NonRetriableError("HTTP Request node: no endpoint configured");
    }

    // const response = await step.fetch("http-request", data.endpoint)
    const result = await step.run("http-request", async () => {
        const method = data.method || "GET";
        const endpoint = data.endpoint!;
        const options: RequestOptions = { method }
        if (["POST", "PUT", "PATCH"].includes(method)) {
            options.data = data.body
        }

        let responseData: unknown;

        // const response = await axios(endpoint, options)
        const response = await api(endpoint, options)
        responseData = response.data;

        // const contentType = response?.headers['Content-Type']
        // if (typeof contentType === "string" && contentType?.includes('application/json'))
        // try {
        // } catch (error) {
        //     responseData = error;
        // }

        return {
            ...context,
            httpResponse: {
                status: response.status,
                statusText: response.statusText,
                data: responseData,
            }
        }
    });

    // TODO: Publish "success" state for manual trigger

    return result;
}