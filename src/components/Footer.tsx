import Link from "next/link";
import Logo from "@/components/Logo";
export default function Footer() {
  return <footer className="border-t mt-auto" style={{ borderColor: "rgb(var(--card-border))", background: "rgb(var(--card))" }}><div className="app-container py-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5"><div className="flex items-center gap-3"><Logo size={23} showWordmark={false} /><p className="text-xs muted">© {new Date().getFullYear()} Unimorpher</p></div><nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-xs muted"><Link href="/about" className="hover:text-[rgb(var(--fg))]">About</Link><Link href="/privacy" className="hover:text-[rgb(var(--fg))]">Privacy</Link><Link href="/terms" className="hover:text-[rgb(var(--fg))]">Terms</Link><a href="mailto:support@unimorpher.com" className="hover:text-[rgb(var(--fg))]">Contact support</a></nav></div></footer>;
}
