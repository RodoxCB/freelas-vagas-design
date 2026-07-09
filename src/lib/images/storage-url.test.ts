import { describe, expect, it } from "vitest";
import { getPhotoFromFormData, photoUploadFieldError } from "./upload-form";
import { isSupabaseStorageUrl, proxiedStorageUrl } from "./storage-url";

describe("getPhotoFromFormData", () => {
  it("accepts Blob uploads from server FormData", () => {
    const formData = new FormData();
    formData.set("foto_selected", "1");
    formData.set("foto", new Blob(["fake"], { type: "image/jpeg" }), "avatar.jpg");

    const result = getPhotoFromFormData(formData);
    expect(result.file).not.toBeNull();
    if (result.file) {
      expect(result.file.size).toBeGreaterThan(0);
      expect(result.file.type).toBe("image/jpeg");
    }
  });

  it("flags missing uploads when user selected a file", () => {
    const formData = new FormData();
    formData.set("foto_selected", "1");

    const result = getPhotoFromFormData(formData);
    expect(result.file).toBeNull();
    expect(photoUploadFieldError(result.selected)).toMatch(/não foi enviada/i);
  });
});

describe("proxiedStorageUrl", () => {
  it("proxies supabase public storage urls", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://demo.supabase.co";
    const url =
      "https://demo.supabase.co/storage/v1/object/public/avatars/user/avatar.webp";

    expect(isSupabaseStorageUrl(url)).toBe(true);
    expect(proxiedStorageUrl(url)).toBe(`/api/image?src=${encodeURIComponent(url)}`);
  });

  it("keeps external urls unchanged", () => {
    expect(proxiedStorageUrl("https://example.com/photo.jpg")).toBe(
      "https://example.com/photo.jpg"
    );
  });
});
