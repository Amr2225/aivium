"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "@/components/ui/button";

import { json } from "@codemirror/lang-json";
import CodeMirror from "@uiw/react-codemirror";
import { customTagHighlighter } from "./custom-tag-highlighter";

const formSchema = z.object({
  variableName: z
    .string()
    .min(1, "Variable name is required")
    .regex(
      /^[A-Za-z_$][A-Za-z0-9_$]*$/,
      "Variable name must start with a letter, underscore, or dollar sign and contain only letters, numbers, underscores, or dollar signs",
    ),
  endpoint: z.url("Please enter a valid URL"),
  method: z.enum(["GET", "POST", "PUT", "DELETE", "PATCH"]),
  body: z.string().optional(),
});
export type HttpRequestFormType = z.infer<typeof formSchema>;

interface HttpRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: HttpRequestFormType) => void;
  defaultValues?: Partial<HttpRequestFormType>;
}
export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: HttpRequestDialogProps) => {
  const form = useForm<HttpRequestFormType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  const watchVariableName = form.watch("variableName") || "myApiCall";
  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);
  const handleSubmit = (data: HttpRequestFormType) => {
    onSubmit(data);
    onOpenChange(false);
  };

  // Resets form values when dialog is opened with new defaults
  useEffect(() => {
    form.reset({
      variableName: defaultValues.variableName || "",
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    });
  }, [defaultValues, form, open]);

  function escapeHtml(s: string) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function highlight(text: string) {
    const escaped = escapeHtml(text);
    // wrap {{ ... }} including the braces
    const html = escaped.replace(
      /(\{\{)([^}]*?)(\}\})/g,
      `<span class="tpl-brace">$1</span><span class="tpl-path">$2</span><span class="tpl-brace">$3</span>`,
    );
    // append a trailing space so a final newline renders
    return html + "\n";
  }
  function syncScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    const ta = e.currentTarget;
    const hl = ta.previousElementSibling as HTMLElement;
    hl.scrollTop = ta.scrollTop;
    hl.scrollLeft = ta.scrollLeft;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>Configure the settings for the HTTP request node</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-8 mt-4'>
            <FormField
              control={form.control}
              name='variableName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variable Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='myApiCall' />
                  </FormControl>

                  <FormDescription>
                    Use this name to reference the result in other nodes:{" "}
                    {`{{${watchVariableName}.httpResponse.data}}`}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='method'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a method' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='GET'>GET</SelectItem>
                      <SelectItem value='POST'>POST</SelectItem>
                      <SelectItem value='PUT'>PUT</SelectItem>
                      <SelectItem value='PATCH'>PATCH</SelectItem>
                      <SelectItem value='DELETE'>DELETE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>The HTTP method to use for this request.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='endpoint'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endpoint URL</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder='https://api.example.com/users/{{httpResponse.data.id}}'
                    />
                  </FormControl>

                  <FormDescription>
                    Static URL or use {"{{variables}}"} for simple values or {"{{json variable}}"}{" "}
                    to stringify JSON objects.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {showBodyField && (
              <FormField
                control={form.control}
                name='body'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Body</FormLabel>
                    <FormControl>
                      <div>
                        <style>
                          {`
                          .cm-custom-json-tag {
                            color: #ffffff !important;
                            background-color: #007bff;
                            padding: 2px 6px;
                            border-radius: 4px;
                            font-weight: bold;
                          }
                        `}
                        </style>
                        <CodeMirror
                          value={field.value || ""}
                          onChange={field.onChange}
                          extensions={[customTagHighlighter, json()]}
                          theme='light'
                          className='min-h-[120px] max-h-[250px] overflow-y-auto font-mono text-sm border-none outline-none'
                          basicSetup={{
                            autocompletion: true,
                            lineNumbers: false,
                            highlightSpecialChars: true,
                            dropCursor: false,
                            foldGutter: false,
                            searchKeymap: false,
                            tabSize: 2,
                          }}
                          minHeight='120px'
                          maxHeight='250px'
                          placeholder={
                            '{\n "userId: "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}",\n "items": "{{httpResponse.data.items}}"\n}'
                          }
                        />
                      </div>
                      {/* <Textarea
                        {...field}
                        placeholder={
                          '{\n "userId: "{{httpResponse.data.id}}",\n "name": "{{httpResponse.data.name}}",\n "items": "{{httpResponse.data.items}}"\n}'
                        }
                        className='min-h-[120px] font-mono text-sm'
                        spellCheck={false}
                        onScroll={syncScroll}
                      /> */}
                    </FormControl>
                    <FormDescription>
                      JSON with template variables. use {"{{variables}}"} for simple values or{" "}
                      {"{{json variable}}"} to stringify JSON objects.
                    </FormDescription>
                  </FormItem>
                )}
              />
            )}
            <DialogFooter className='mt-4'>
              <Button type='submit'>Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
