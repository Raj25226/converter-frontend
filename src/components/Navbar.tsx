"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Moon, Sun, LogOut, User, Menu, X, ArrowUpRight } from "lucide-react";
import { getUser, logout, User as UserType } from "@/lib/auth";
import { getInitialTheme, applyTheme, Theme } from "@/lib/theme";
import { useRouter, usePathname } from "next/navigation";
import { useQuota } from "@/lib/quota-store";
import Logo from "@/components/Logo";

export default function Navbar() {
  const router = useRouter(); const pathname = usePathname();
  const [user, setUser] = useState<UserType | null>(null);
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const { quota } = useQuota();
  useEffect(() => {
    const syncUser = () => setUser(getUser());
    syncUser(); const initial = getInitialTheme(); setTheme(initial); applyTheme(initial);
    window.addEventListener("storage", syncUser);
    window.addEventListener("conversion-quota-changed", syncUser);
    return () => { window.removeEventListener("storage", syncUser); window.removeEventListener("conversion-quota-changed", syncUser); };
  }, []);
  const toggleTheme = () => { const next = theme === "light" ? "dark" : "light"; setTheme(next); applyTheme(next); };
  const handleLogout = () => { logout(); setUser(null); setMenuOpen(false); router.push("/"); window.dispatchEvent(new Event("conversion-quota-changed")); };
  const links = [{ href: "/", label: "Tools", active: pathname === "/" || toolsPage(pathname) }, { href: "/dashboard", label: "History", active: pathname === "/dashboard" }, { href: "/blog", label: "Guides", active: pathname.startsWith("/blog") }];
  return <header className="sticky top-0 z-50 border-b" style={{ background: "rgb(var(--card))", borderColor: "rgb(var(--card-border))" }}>
    <nav className="app-container" aria-label="Main navigation"><div className="h-[68px] flex items-center justify-between gap-5">
      <div className="flex items-center gap-10"><Link href="/" aria-label="Unimorpher home"><Logo /></Link><div className="hidden lg:flex items-center gap-6">{links.map(link => <Link key={link.href} href={link.href} aria-current={link.active ? "page" : undefined} className={`nav-link ${link.active ? "active" : ""}`}>{link.label}</Link>)}{user?.role === "admin" && <Link className={`nav-link ${pathname === "/admin" ? "active" : ""}`} href="/admin">Admin</Link>}</div></div>
      <div className="flex items-center gap-2 sm:gap-3">
        {quota && <span className="hidden lg:flex items-center gap-2 text-xs muted mr-3"><span className="inline-block h-1 w-1 rounded-full" style={{ background: "rgb(var(--muted))" }} />{quota.remaining} of {quota.limit} left today</span>}
        <button onClick={toggleTheme} className="icon-button" aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}>{theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}</button>
        <div className="hidden lg:flex items-center gap-3 border-l pl-4" style={{ borderColor: "rgb(var(--card-border))" }}>{user ? <><Link href="/profile" className="flex items-center gap-2 text-sm font-medium">{user.picture ? <Image unoptimized width={28} height={28} src={user.picture} alt="" className="rounded-full h-7 w-7 object-cover" /> : <span className="icon-tile h-7 w-7"><User size={15} /></span>}<span className="max-w-[100px] truncate">{user.firstName}</span></Link><button className="icon-button" onClick={handleLogout} aria-label="Sign out"><LogOut size={16} /></button></> : <><Link className="nav-link px-1" href="/login">Sign in</Link><Link className="btn btn-primary px-4" href="/signup">Create account <ArrowUpRight size={14} /></Link></>}</div>
        <button className="icon-button lg:hidden" aria-label={menuOpen ? "Close navigation" : "Open navigation"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </div>
    {menuOpen && <div id="mobile-navigation" className="lg:hidden border-t py-4" style={{ borderColor: "rgb(var(--card-border))" }}><div className="flex flex-col gap-1">{links.map(link => <Link key={link.href} className="category-link" aria-current={link.active ? "page" : undefined} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</Link>)}{user?.role === "admin" && <Link className="category-link" href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}{quota && <p className="text-xs muted px-3 py-3">{quota.remaining} of {quota.limit} conversions left today</p>}<div className="flex items-center gap-3 px-3 pt-3 border-t" style={{ borderColor: "rgb(var(--card-border))" }}>{user ? <><Link className="btn btn-secondary px-4" href="/profile" onClick={() => setMenuOpen(false)}>Account settings</Link><button className="nav-link" onClick={handleLogout}>Sign out</button></> : <><Link href="/signup" className="btn btn-primary px-4" onClick={() => setMenuOpen(false)}>Create account</Link><Link href="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Sign in</Link></>}</div></div></div>}
    </nav>
  </header>;
}
function toolsPage(path: string) { return /-to-|^\/(file-compress|zip-extract)$/.test(path); }
