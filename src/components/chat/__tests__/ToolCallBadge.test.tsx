import { test, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { getToolLabel, ToolCallBadge } from "../ToolCallBadge";

afterEach(() => {
  cleanup();
});

// getToolLabel unit tests

test("getToolLabel: str_replace_editor create", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "src/App.jsx" })).toBe("Creating App.jsx");
});

test("getToolLabel: str_replace_editor str_replace", () => {
  expect(getToolLabel("str_replace_editor", { command: "str_replace", path: "src/components/Card.tsx" })).toBe("Editing Card.tsx");
});

test("getToolLabel: str_replace_editor insert", () => {
  expect(getToolLabel("str_replace_editor", { command: "insert", path: "src/index.ts" })).toBe("Editing index.ts");
});

test("getToolLabel: str_replace_editor view", () => {
  expect(getToolLabel("str_replace_editor", { command: "view", path: "src/lib/utils.ts" })).toBe("Viewing utils.ts");
});

test("getToolLabel: str_replace_editor undo_edit", () => {
  expect(getToolLabel("str_replace_editor", { command: "undo_edit", path: "App.jsx" })).toBe("Undoing edit in App.jsx");
});

test("getToolLabel: file_manager rename", () => {
  expect(getToolLabel("file_manager", { command: "rename", path: "old.jsx" })).toBe("Renaming old.jsx");
});

test("getToolLabel: file_manager delete", () => {
  expect(getToolLabel("file_manager", { command: "delete", path: "src/dead.tsx" })).toBe("Deleting dead.tsx");
});

test("getToolLabel: unknown tool falls back to toolName", () => {
  expect(getToolLabel("some_other_tool", { command: "run", path: "foo.ts" })).toBe("some_other_tool");
});

test("getToolLabel: extracts basename from nested path", () => {
  expect(getToolLabel("str_replace_editor", { command: "create", path: "a/b/c/MyComponent.tsx" })).toBe("Creating MyComponent.tsx");
});

test("getToolLabel: handles missing path gracefully", () => {
  expect(getToolLabel("str_replace_editor", { command: "create" })).toBe("Creating ");
});

// ToolCallBadge component tests

test("ToolCallBadge shows label text", () => {
  render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="call"
    />
  );
  expect(screen.getByText("Creating App.jsx")).toBeDefined();
});

test("ToolCallBadge shows spinner when pending", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="call"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});

test("ToolCallBadge shows green dot when done", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="result"
      result="Success"
    />
  );
  expect(container.querySelector(".bg-emerald-500")).toBeDefined();
  expect(container.querySelector(".animate-spin")).toBeNull();
});

test("ToolCallBadge stays in pending state when result is missing", () => {
  const { container } = render(
    <ToolCallBadge
      toolName="str_replace_editor"
      args={{ command: "create", path: "App.jsx" }}
      state="result"
    />
  );
  expect(container.querySelector(".animate-spin")).toBeDefined();
  expect(container.querySelector(".bg-emerald-500")).toBeNull();
});
