import DocumentationPage from "./documentationPage";

export const DOCS_CONFIG = [
  {
    title: "Getting Started",
    items: [
      { topic: "Introduction", fileAddr: "/docs/intro.md" },
      { topic: "Installation", fileAddr: "/docs/installation.md" },
      { topic: "CLI Commands", fileAddr: "/docs/cli-commands.md" },
    ],
  },
  {
    title: "Configuration",
    items: [
      { topic: "Schema Setup", fileAddr: "/docs/schema-setup.md" }, // Everything related to schema
      { topic: "Auth & Network", fileAddr: "/docs/auth-network.md" }, // Covers CORS, Auth, Delay
      { topic: "Chaos Engineering", fileAddr: "/docs/chaos-engineering.md" }, // errors and how to define it
    ],
  },
  {
    title: "Data Generation",
    items: [
      { topic: "Defining Resources", fileAddr: "/docs/defining-resources.md" },
      { topic: "Field Types", fileAddr: "/docs/field-types.md" }, // types
      { topic: "Relationships", fileAddr: "/docs/relationships.md" },
    ],
  },
  {
    title: "Reference",
    items: [
      { topic: "Templates", fileAddr: "/docs/templates.md" }, // Few template schemas
    ],
  },
];

export default function Page() {
  return <DocumentationPage config={DOCS_CONFIG} brandName="MockServer" />;
}
