import { Metadata } from "next";
import { builder } from "@builder.io/sdk";
import { RenderBuilderContent } from "@modules/common/components/builder";

// Initialize Builder.io with the environment variable
builder.init(process.env.YOUR_BUILDER_API_KEY || "38d68438e314470e9a024d29227f1e31");

export const metadata: Metadata = {
  title: "Builder.io + Medusa Next.js Storefront",
  description: "A custom e-commerce storefront with Next.js and Medusa.",
};

interface BuilderPageProps {
  params: {
    page?: string[];
    countryCode: string;
  };
}

export default async function BuilderPage({ params }: BuilderPageProps) {
  const { countryCode, page = [] } = params;
  const urlPath = `/${page.join("/")}`.replace(/\/$/, "");

  const content = await builder
    .get("page", {
      userAttributes: { urlPath },
      prerender: false,
    })
    .toPromise();

  return <RenderBuilderContent content={content} model="page" />;
} 