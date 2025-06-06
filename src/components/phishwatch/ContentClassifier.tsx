"use client";

import type * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, FileText, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeEmailContent, type AnalyzeEmailContentOutput } from "@/ai/flows/analyze-email-content";

const formSchema = z.object({
  emailContent: z.string().min(50, { message: "Email content must be at least 50 characters long." }),
});

type ContentClassifierFormValues = z.infer<typeof formSchema>;

export default function ContentClassifier() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeEmailContentOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<ContentClassifierFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailContent: "",
    },
  });

  async function onSubmit(values: ContentClassifierFormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeEmailContent({ emailContent: values.emailContent });
      setResult(analysisResult);
      if (analysisResult.isPhishing) {
        toast({
          variant: "destructive",
          title: "Phishing Email Detected!",
          description: `The email content is likely a phishing attempt. Confidence: ${(analysisResult.confidenceScore * 100).toFixed(0)}%.`,
        });
      } else {
        toast({
          title: "Email Scan Complete",
          description: `The email content appears to be legitimate. Confidence: ${(analysisResult.confidenceScore * 100).toFixed(0)}%.`,
        });
      }
    } catch (error) {
      console.error("Error analyzing email content:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the email content. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Email Content Scanner
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="emailContent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Paste email content here</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter the full email body..."
                      className="min-h-[150px] resize-y"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Scan Email Content
                </>
              )}
            </Button>
          </form>
        </Form>

        {isLoading && !result && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing email, please wait...</p>
          </div>
        )}

        {result && (
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                {result.isPhishing ? (
                   <AlertTriangle className="text-destructive h-5 w-5" />
                ) : (
                  <ShieldCheck className="text-primary h-5 w-5" />
                )}
                Analysis Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                <span className="font-medium">Classification:</span>
                <Badge variant={result.isPhishing ? 'destructive' : 'secondary'} className={!result.isPhishing ? 'bg-primary/10 text-primary border-primary/30' : ''}>
                  {result.isPhishing ? 'Phishing' : 'Legitimate'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                <span className="font-medium">Confidence Score:</span>
                <span className={`font-semibold text-base ${result.isPhishing ? 'text-destructive' : 'text-primary'}`}>
                  {(result.confidenceScore * 100).toFixed(0)}%
                </span>
              </div>
              <div className="p-3 bg-background rounded-md border">
                <p className="font-medium mb-1">Reason:</p>
                <p className="text-muted-foreground">{result.reason}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
