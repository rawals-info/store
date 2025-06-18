"use client";
import { ComponentProps } from "react";
import { BuilderComponent, useIsPreviewing } from "@builder.io/react"; 
import { builder } from "@builder.io/sdk";
import DefaultErrorPage from "next/error";

type BuilderPageProps = ComponentProps<typeof BuilderComponent>;

// Initialize with the environment variable
builder.init(process.env.YOUR_BUILDER_API_KEY || "38d68438e314470e9a024d29227f1e31");

export function RenderBuilderContent(props: BuilderPageProps) { 
  const isPreviewing = useIsPreviewing(); 

  return props.content || isPreviewing ? (
    <BuilderComponent {...props} />
  ) : (
    <DefaultErrorPage statusCode={404} />
  );
} 