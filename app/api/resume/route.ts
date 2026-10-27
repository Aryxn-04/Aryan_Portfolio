import { readFile } from "node:fs/promises";
import path from "node:path";
import { hero } from "@/data/site";

// Generate the PDF response at build time so downloads do not depend on
// the deployment separately serving the public file at the requested URL.
export const dynamic = "force-static";

export async function GET() {
  const pdf = await readFile(path.join(process.cwd(), "public", hero.resume.href));
  return new Response(new Uint8Array(pdf), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${hero.resume.filename}"`,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
