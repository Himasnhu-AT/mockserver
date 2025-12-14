import { templates } from "../utils/template.js";

describe("Templates Utility", () => {
  it('should return default template when "default" is requested', () => {
    const template = templates.get("default");
    expect(template).not.toBeNull();
    expect(template?.auth?.enabled).toBe(true);
    expect(template?.resources.find((r) => r.id === "users")).toBeDefined();
    // Verify default template specific field
    const users = template?.resources.find((r) => r.id === "users");
    expect(users?.fields.password).toBeDefined();
  });

  it('should return social template when "social" is requested', () => {
    const template = templates.get("social");
    expect(template).not.toBeNull();
    // Social template logic check
    expect(template?.resources.find((r) => r.id === "posts")).toBeDefined();
  });

  it("should return null for unknown template", () => {
    const template = templates.get("unknown-template");
    expect(template).toBeNull();
  });
});
