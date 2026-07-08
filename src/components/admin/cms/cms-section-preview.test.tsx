import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CmsSectionPreview } from "@/components/admin/cms/cms-section-preview";
import { SITE_CONTENT_DEFAULTS } from "@/lib/site-content/defaults";

describe("CmsSectionPreview", () => {
  it("renders home preview with hero title", () => {
    render(
      <CmsSectionPreview sectionId="home" content={{ ...SITE_CONTENT_DEFAULTS }} />
    );
    expect(
      screen.getByRole("heading", { name: SITE_CONTENT_DEFAULTS["home.hero.title"] })
    ).toBeTruthy();
  });

  it("renders tema preview", () => {
    render(
      <CmsSectionPreview sectionId="tema" content={{ ...SITE_CONTENT_DEFAULTS }} />
    );
    expect(screen.getByText("Exemplo de interface")).toBeTruthy();
  });
});
