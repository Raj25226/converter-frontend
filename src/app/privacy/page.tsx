import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy Policy | FileConvert Pro", description: "Learn how FileConvert Pro handles your data and protects your privacy." };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen py-16" style={{ background: "rgb(var(--bg))" }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-2" style={{ fontFamily: "Syne, sans-serif" }}>Privacy Policy</h1>
          <p className="mb-10 text-sm" style={{ color: "rgb(var(--muted))" }}>Last updated: January 1, 2026</p>

          <div className="space-y-8">
            {[
              { title: "1. Information We Collect", content: "We collect minimal information necessary to provide our service. For registered users, we store your name and email address. For all users, we temporarily process uploaded files to perform conversions. We may collect anonymous usage analytics such as page views and conversion counts." },
              { title: "2. File Handling", content: "Uploaded files are processed in memory and on temporary storage. All files are automatically and permanently deleted from our servers within 30 minutes of upload, regardless of whether conversion is complete. We do not read, analyze, or use your files for any purpose other than performing the requested conversion." },
              { title: "3. Cookies and Tracking", content: "We use essential cookies to maintain your session and remember your preferences (such as dark/light theme). We do not use third-party tracking cookies. Anonymous analytics data is collected to improve our service." },
              { title: "4. Data Security", content: "All data transmission is encrypted using SSL/TLS. We implement security best practices to protect stored data. Passwords are hashed using bcrypt and are never stored in plain text." },
              { title: "5. Third-Party Services", content: "We may display Google AdSense ads. Google's use of advertising cookies enables it to serve ads based on your visit to our site. You can opt out of personalized advertising at Google's Ad Settings. We use analytics services for anonymous usage statistics." },
              { title: "6. Your Rights (GDPR)", content: "If you are in the EU, you have the right to access, correct, or delete your personal data. You may request account deletion by emailing support@fileconvert.pro. We will process deletion requests within 30 days." },
              { title: "7. Contact", content: "If you have privacy concerns, please contact us at support@fileconvert.pro." },
            ].map((section) => (
              <div key={section.title}>
                <h2 className="text-xl font-bold mb-3" style={{ fontFamily: "Syne, sans-serif" }}>{section.title}</h2>
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
