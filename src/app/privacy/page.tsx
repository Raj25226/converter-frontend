import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy Policy | unimorpher", description: "Learn how unimorpher handles your data and protects your privacy." };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "inherit" }}>Privacy Policy</h1>
          <p className="mb-10 text-sm" style={{ color: "rgb(var(--muted))" }}>Last updated: October 14, 2026</p>

          <div className="space-y-8">
            {[
              { title: "1. Account and usage data", content: "Accounts store your name, email address, password hash, and optional Google profile image. Conversion history records filenames, tool, size, timestamps, and client IP. Quotas and aggregate usage statistics support service operation." },
              { title: "2. Temporary files", content: "Files are processed in memory and temporary storage. Converted download links expire after 30 minutes by default. A scheduled job removes expired outputs, normally within one minute while the service is running. Orphaned work files are swept periodically. Conversion metadata is retained for approximately 30 days after expiry." },
              { title: "3. Browser storage", content: "The browser stores your sign-in token, account details, and theme preference in localStorage. Google sign-in uses Google's identity service when configured. Signing out removes the stored account and token." },
              { title: "4. Security", content: "Passwords are hashed with bcrypt. Download links allow anyone possessing the link to access the converted file before expiry, so treat them as private. Use the service over HTTPS for encrypted transfers." },
              { title: "5. Service providers", content: "Google verifies Google sign-in credentials. The configured email provider delivers verification and password-recovery messages. Hosting and database providers process data according to the service operator's configuration." },
              { title: "6. Account details", content: "You can edit your profile after signing in. Contact the service operator for account deletion or questions about retained data." },
              { title: "7. Contact", content: "For privacy questions, contact support@unimorpher.com." },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "inherit" }}>{section.title}</h2>
                <p className="leading-relaxed" style={{ color: "rgb(var(--muted))" }}>{section.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
