import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, FileText, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = "privacy" | "terms";

const LAST_UPDATED = "April 28, 2026";

const privacySections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly, including your name, email address, and social media account details when you connect platforms like TikTok. We also automatically collect usage data such as device information, IP address, browser type, and interaction patterns within the app.`,
  },
  {
    title: "2. How We Use Your Information",
    content: `We use your information to provide and improve ViralCut's services, including video optimization, content scheduling, and analytics. Your connected social media tokens are used solely to publish content and retrieve performance metrics on your behalf. We do not sell your personal data to third parties.`,
  },
  {
    title: "3. Data Storage & Security",
    content: `Your data is stored on secure, encrypted servers. Social media access tokens are stored server-side with row-level security policies, ensuring only you can access your own credentials. We use industry-standard encryption for data in transit and at rest.`,
  },
  {
    title: "4. Third-Party Services",
    content: `ViralCut integrates with third-party platforms (TikTok, YouTube, etc.) via their official APIs. When you connect an account, you authorize ViralCut to access specific data as outlined during the OAuth consent flow. Each platform's own privacy policy governs how they handle your data.`,
  },
  {
    title: "5. Data Retention",
    content: `We retain your account data for as long as your account is active. You can disconnect social media accounts at any time, which revokes our access tokens. Upon account deletion, all associated data is permanently removed within 30 days.`,
  },
  {
    title: "6. Your Rights",
    content: `You have the right to access, correct, or delete your personal data at any time. You can export your data, revoke social media connections, or request full account deletion by contacting our support team. We comply with applicable data protection regulations including GDPR and CCPA.`,
  },
  {
    title: "7. Cookies & Tracking",
    content: `We use essential cookies to maintain your session and preferences. We do not use third-party advertising trackers. Analytics cookies are used in aggregate to improve the platform and can be opted out of in your account settings.`,
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of any material changes via email or an in-app notification. Continued use of ViralCut after changes constitutes acceptance of the updated policy.`,
  },
];

const termsSections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using ViralCut, you agree to be bound by these Terms of Service. If you do not agree, you may not use the platform. These terms apply to all users, including free and paid subscribers.`,
  },
  {
    title: "2. Account Responsibilities",
    content: `You are responsible for maintaining the security of your account credentials. You must provide accurate information during registration. You are solely responsible for all content uploaded, edited, or published through ViralCut.`,
  },
  {
    title: "3. Permitted Use",
    content: `ViralCut is provided for lawful content creation and social media management. You may not use the platform to create, distribute, or promote content that is illegal, harmful, harassing, defamatory, or violates any third-party rights including intellectual property.`,
  },
  {
    title: "4. Content Ownership",
    content: `You retain full ownership of all content you upload to ViralCut. By using our optimization tools, you grant ViralCut a limited, non-exclusive license to process your content solely for the purpose of delivering our services. We do not claim any rights to your original content.`,
  },
  {
    title: "5. AI-Powered Features",
    content: `ViralCut uses AI to generate suggestions for hooks, captions, hashtags, and audio. These are recommendations only. You are responsible for reviewing and approving all AI-generated content before publishing. ViralCut is not liable for the performance or reception of AI-suggested content.`,
  },
  {
    title: "6. Platform Integrations",
    content: `ViralCut connects to third-party social media platforms via their official APIs. We are not responsible for changes to third-party APIs, platform policies, or service disruptions that may affect ViralCut's functionality. You must comply with each platform's terms of service when publishing content.`,
  },
  {
    title: "7. Service Availability",
    content: `We strive to maintain 99.9% uptime but do not guarantee uninterrupted service. Scheduled maintenance, updates, and unforeseen technical issues may temporarily affect availability. We will provide advance notice for planned downtime when possible.`,
  },
  {
    title: "8. Limitation of Liability",
    content: `ViralCut is provided "as is" without warranties of any kind. We are not liable for any indirect, incidental, or consequential damages arising from your use of the platform, including but not limited to lost revenue, content removal by third-party platforms, or account suspensions.`,
  },
  {
    title: "9. Termination",
    content: `We reserve the right to suspend or terminate accounts that violate these terms. You may cancel your account at any time. Upon termination, your data will be handled in accordance with our Privacy Policy.`,
  },
  {
    title: "10. Contact",
    content: `For questions about these Terms of Service, please contact us at support@viralcut.app.`,
  },
];

export default function Policy() {
  const [activeTab, setActiveTab] = useState<Tab>("privacy");

  const sections = activeTab === "privacy" ? privacySections : termsSections;

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background effects */}
      <div className="absolute left-1/4 top-20 size-[300px] rounded-full bg-[hsl(263_70%_50%/0.04)] blur-[100px]" />
      <div className="absolute bottom-40 right-1/4 size-[250px] rounded-full bg-[hsl(38_92%_50%/0.03)] blur-[80px]" />

      <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">
        {/* Back link */}
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to app
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-foreground">
            <span className="bg-gradient-to-r from-primary via-violet-400 to-cyan-400 bg-clip-text text-transparent">
              ViralCut
            </span>{" "}
            Legal
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Last updated: {LAST_UPDATED}
          </p>
        </motion.div>

        {/* Tab switcher */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="mb-8 flex gap-2 rounded-xl border border-border bg-secondary/40 p-1"
        >
          <button
            onClick={() => setActiveTab("privacy")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
              activeTab === "privacy"
                ? "bg-primary text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Shield className="size-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={cn(
              "flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all",
              activeTab === "terms"
                ? "bg-primary text-white shadow-md"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <FileText className="size-4" />
            Terms of Service
          </button>
        </motion.div>

        {/* Content sections */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col gap-6"
        >
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className="spotlight-card rounded-xl p-6"
            >
              <h2 className="mb-3 text-base font-bold text-foreground">
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {section.content}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <div className="mt-12 border-t border-border pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            Questions? Contact us at{" "}
            <a
              href="mailto:support@viralcut.app"
              className="font-medium text-primary transition-colors hover:text-primary/80"
            >
              support@viralcut.app
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
