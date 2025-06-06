"use client";

import * as z from "zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, Loader2, Search, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { analyzeURLReputation, type AnalyzeURLReputationOutput } from "@/ai/flows/analyze-url-reputation";

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
});

type UrlAnalyzerFormValues = z.infer<typeof formSchema>;

export default function UrlAnalyzer() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeURLReputationOutput | null>(null);
  const { toast } = useToast();

  const form = useForm<UrlAnalyzerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  async function onSubmit(values: UrlAnalyzerFormValues) {
    setIsLoading(true);
    setResult(null);
    try {
      const analysisResult = await analyzeURLReputation({ url: values.url });
      setResult(analysisResult);
      if (analysisResult.isMalicious) {
        toast({
          variant: "destructive",
          title: "Malicious URL Detected!",
          description: `The URL ${values.url.substring(0,30)}... is potentially harmful. Score: ${analysisResult.reputationScore}/100.`,
        });
      } else {
         toast({
          title: "URL Scan Complete",
          description: `The URL appears to be safe. Score: ${analysisResult.reputationScore}/100.`,
        });
      }
    } catch (error) {
      console.error("Error analyzing URL:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not analyze the URL. Please try again.",
      });
    }
    setIsLoading(false);
  }

  return (
    <Card className="shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Search className="h-6 w-6 text-primary" />
          URL Reputation Checker
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter URL to analyze</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Scan URL
                </>
              )}
            </Button>
          </form>
        </Form>

        {isLoading && !result && (
          <div className="mt-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
            <p className="mt-2 text-muted-foreground">Analyzing URL, please wait...</p>
          </div>
        )}

        {result && (
          <Card className="mt-6 bg-muted/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline text-xl">
                {result.isMalicious ? (
                  <AlertTriangle className="text-destructive h-5 w-5" />
                ) : (
                  <ShieldCheck className="text-primary h-5 w-5" />
                )}
                Scan Result
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                <span className="font-medium">Status:</span>
                <Badge variant={result.isMalicious ? 'destructive' : 'secondary'} className={!result.isMalicious ? 'bg-primary/10 text-primary border-primary/30' : ''}>
                  {result.isMalicious ? 'Malicious' : 'Safe'}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-background rounded-md border">
                <span className="font-medium">Reputation Score:</span>
                <span className={`font-semibold text-base ${result.reputationScore < 50 ? 'text-destructive' : 'text-primary'}`}>
                  {result.reputationScore}/100
                </span>
              </div>
              <div className="p-3 bg-background rounded-md border">
                <p className="font-medium mb-1">Explanation:</p>
                <p className="text-muted-foreground">{result.explanation}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
