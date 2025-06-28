import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "public",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          {
            type: "string",
            name: "title",
            label: "Title",
            isTitle: true,
            required: true,
          },
          {
            type: "rich-text",
            name: "body",
            label: "Body",
            isBody: true,
          },
        ],
        ui: {
          // This is an DEMO router. You can remove this to fit your site
          router: ({ document }) => `/demo/blog/${document._sys.filename}`,
        },
      },
      {
        name: "site",
        label: "Site Settings",
        path: "content/site",
        format: "json",
        ui: {
          // don't let editors accidentally create or delete docs here for now
          allowedActions: {
            create: false,
            delete: false,
          },
          // show in the "Site" section instead of "Collections"
          global: true,
        },
        fields: [
          {
            // discriminator so we can have multiple docs (header.json, footer.json, later home.json …)
            type: "string",
            name: "type",
            label: "Document Type",
            required: true,
            ui: {
              component: "hidden",
            },
            options: [
              { label: "Header", value: "header" },
              { label: "Footer", value: "footer" },
              { label: "Home", value: "home" },
            ],
          },
          {
            type: "object",
            name: "header",
            label: "Header",
            list: false,
            ui: {
              component: "group",
            },
            fields: [
              { type: "image", name: "logo", label: "Logo" },
              {
                type: "object",
                name: "links",
                label: "Main Navigation Links",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
              {
                type: "object",
                name: "rightLinks",
                label: "Right-side Links",
                list: true,
                fields: [
                  { type: "string", name: "label", label: "Label" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "footer",
            label: "Footer",
            list: false,
            ui: {
              component: "group",
            },
            fields: [
              { type: "string", name: "company", label: "Company Name" },
              { type: "string", name: "description", label: "Description", ui: { component: "textarea" } },
              {
                type: "object",
                name: "social",
                label: "Social Links",
                list: true,
                fields: [
                  { type: "string", name: "platform", label: "Platform" },
                  { type: "string", name: "href", label: "URL" },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
