import { redirect } from "next/navigation";

/** Legacy route → HawkEye Intelligence Risk Desk */
export default function DealDigestRedirectPage() {
  redirect("/dashboard/risk-desk");
}
