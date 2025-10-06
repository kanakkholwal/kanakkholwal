"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Cal, { getCalApi } from "@calcom/embed-react";
import { useTheme } from "next-themes";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  email: z.email({ message: "Invalid email address" }),
  message: z
    .string()
    .min(5, { message: "Message must be at least 5 characters long" })
    .max(1000, { message: "Message must be at most 1000 characters long" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

async function sendForm(values: ContactFormValues) {
  console.log("Form submitted:", values);
  // Example: await fetch("/api/contact", { method: "POST", body: JSON.stringify(values) })
}
export function ContactForm() {
  const form = useForm<ContactFormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    await sendForm(values);
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto flex max-w-2xl flex-col gap-y-4"
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="your.email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What would you like to discuss?"
                  rows={6}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full mt-2">
          Send Message
        </Button>
      </form>
    </Form>
  );
}
export function BookACallForm() {
  const { resolvedTheme } = useTheme();
  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "book-a-call" });
      cal("ui", { hideEventTypeDetails: false, layout: "month_view" });
    })();
  }, []);
  return (
    <Cal
      namespace="book-a-call"
      calLink="kanakkholwal/book-a-call"
      style={{ width: "100%", height: "100%", overflow: "scroll" }}
      config={{
        theme: resolvedTheme === "dark" ? "dark" : "light",
        layout: "month_view",
      }}
    />
  );
}
