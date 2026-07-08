import { getSiteContent } from "@/lib/site-content";
import { themeCssString } from "@/lib/site-content/theme";

export async function ThemeStyles() {
  const content = await getSiteContent();
  const css = themeCssString(content);

  return <style dangerouslySetInnerHTML={{ __html: css }} />;
}
