"use client";

import {
  BoldIcon,
  Copy,
  ItalicIcon,
  TriangleAlertIcon,
  UnderlineIcon,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface EditorProps {
  text: string;
  id: string;
  name: string
}

const TextEditor = ({ text = "", id = "", name="" }: EditorProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [reportName, setReportName] = useState("");
  const [documentText, setDocumentText] = useState("");
  const printRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setReportName(name)
  }, [])

  const applyStyle = (style: string) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);

    const span = document.createElement("span");
    span.style.cssText = style;

    // Extract the selected contents and append them to the span
    span.appendChild(range.extractContents());
    // Insert the span back in the range position
    range.insertNode(span);

    // Deselect the selected range
    selection.removeAllRanges();
    // Create a new range to select the span
    const newRange = document.createRange();
    newRange.selectNodeContents(span);
    selection.addRange(newRange);
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;

    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print</title>
          </head>
          <body>
            ${content}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  const handleDownloadTxt = () => {
    const content = contentRef.current;
    if (!content) return;
    const blob = new Blob([content.innerText]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "untitled.txt";
    link.click();
  };

  const handleSave = async () => {
    try {
      let reportText = "";
      if (documentText.length === 0) {
        reportText = text;
      } else {
        reportText = documentText;
      }
      const response = await axios.post("/api/update_report", {
        reportText: reportText,
        reportId: id,
      });
      console.log(response.data);
      toast({
        variant: "default",
        title: "Success",
        description: "Report updated Successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failure",
        description: String(error),
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Unable to copy to clipboard:", error);
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      setDocumentText(contentRef.current.innerText);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-white rounded-lg shadow">
      <div className="mb-4 flex flex-wrap items-center gap-x-4">
        <p className="font-semibold text-md">Name: {name}</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-sky-500 drop-shadow-md">Update File</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription className="mt-2">
                This is an AI Generated report. Before saving file make sure the
                generated report is correct.
                <br />
                If you have made changes and the report is correct. Please click
                on save button to save file.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                className="bg-sky-500 drop-shadow-md"
                onClick={handleSave}
              >
                Update File
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Button
          className="bg-sky-500 drop-shadow-md"
          onClick={handleDownloadTxt}
        >
          Download File
        </Button>
        <Button className="bg-sky-500 drop-shadow-md" onClick={handlePrint}>
          Print
        </Button>
      </div>
      <div className="flex gap-x-2 mb-4">
        <Button
          onClick={() => applyStyle("font-weight: bold;")}
          className="border p-2 rounded bg-sky-500 drop-shadow-md"
        >
          <BoldIcon />
        </Button>
        <Button
          onClick={() => applyStyle("font-style: italic;")}
          className="border p-2 rounded bg-sky-500 drop-shadow-md"
        >
          <ItalicIcon />
        </Button>
        <Button
          onClick={() => applyStyle("text-decoration: underline;")}
          className="border p-2 rounded bg-sky-500 drop-shadow-md"
        >
          <UnderlineIcon />
        </Button>
      </div>
      <div ref={printRef}>
        <div
          ref={contentRef}
          contentEditable
          className="border-4 p-4 rounded min-h-[200px] whitespace-pre-wrap"
          onInput={handleInput}
        >
          {" "}
          <pre className="whitespace-pre-wrap">{text}</pre>
        </div>
      </div>

      <Button
        className="flex items-center gap-x-2 mt-2 bg-sky-500 drop-shadow-md"
        onClick={handleCopy}
      >
        <Copy className="h-5 w-5" /> Copy Text
      </Button>

      <Alert className="mt-2 items-center">
        <TriangleAlertIcon className="h-5 w-5" />
        <AlertTitle>Be Careful!</AlertTitle>
        <AlertDescription>
          All the changes will be saved in filing cabinet!
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default TextEditor;
