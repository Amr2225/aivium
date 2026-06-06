import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import type { AxiosRequestConfig as RequestOptions } from "axios"
import axios, { AxiosError } from "axios";
import https from "https";
import Handlebars from "handlebars";

Handlebars.registerHelper("json", (context: unknown) => {
    const jsonString = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonString);
});
// function resolve(template: string, ctx: object) {
//     return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (i, path) => {
//         const val = path.split(".").reduce((object: object, key: string) => object?.[key], ctx);
//         console.log(val, typeof val)
//         if (typeof val === "object") return JSON.stringify(val, null, 2);
//         else return val == null ? "" : String(val);
//     });
// }

type HttpRequestData = {
    variableName?: string;
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

    if (!data.variableName) {
        // TODO: Publish "error" state for manual trigger
        throw new NonRetriableError("HTTP Request node: no variable name configured");
    }

    if (!data.endpoint) {
        // TODO: Publish "error" state for manual trigger
        throw new NonRetriableError("HTTP Request node: no endpoint configured");
    }

    // const response = await step.fetch("http-request", data.endpoint)
    const result = await step.run("http-request", async () => {
        const method = data.method || "GET";
        const endpoint = Handlebars.compile(data.endpoint)(context)
        console.log("Endpoint", endpoint)
        const options: RequestOptions = { method }

        if (["POST", "PUT", "PATCH"].includes(method)) {
            const resolved = Handlebars.compile(data.body || "{}")(context)
            JSON.parse(resolved)

            options.data = resolved;
            options.headers = { // TODO: assess this
                "Content-Type": "application/json",
            }
        }

        // This structure mutes the error from the axios request and returns a structured error object
        // If the error is needed to be throws remove the try/catch and throw the error
        try {
            let responseData: unknown;
            const response = await api(endpoint, options)
            responseData = response.data;

            const responsePayload = {
                httpResponse: {
                    status: response.status,
                    statusText: response.statusText,
                    data: responseData,
                }
            }

            return {
                ...context,
                [data.variableName as string]: responsePayload,
            }

        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    ...context,
                    [data.variableName as string]: {
                        httpResponse: {
                            status: error.response?.status || 500,
                            statusText: error.response?.statusText || "Internal Server Error",
                            data: error.response?.data || error.message,
                            nodeData: JSON.stringify(data)
                        }
                    }
                }
            }

            throw error;
        }
    });

    // TODO: Publish "success" state for manual trigger
    return result;
}