"use client";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const faqVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut" as const,
    },
  },
};

export default function OffersPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="relative px-6 pt-24 pb-12"
      >
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div
            variants={itemVariants}
            className="backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 p-4 inline-flex items-center gap-3 mb-8"
          >
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-white/60 text-sm">Limited availability — 2 spots remaining this month</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent"
          >
            Profit Intelligence
            <br />
            <span className="text-white/40">for growing brands</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-white/60 max-w-2xl mx-auto leading-relaxed"
          >
            Choose the solution that fits your stage. Start with Looker Studio for rapid deployment,
            or go custom for a white-labeled experience.
          </motion.p>
        </div>
      </motion.section>

      {/* Pricing Tiers */}
      <section className="relative px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Tier 1: Looker Studio */}
            <motion.div
              variants={cardVariants}
              className="relative p-8 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300 group"
            >
              {/* Most Popular Badge */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-medium text-white shadow-lg shadow-blue-500/25">
                  Most Popular
                </div>
              </div>

              <div className="mt-4">
                <h3 className="text-2xl font-bold mb-2">Looker Studio</h3>
                <p className="text-white/50 text-sm mb-6">Best for brands ready to see true profit within 48 hours</p>

                <div className="mb-6">
                  <div className="text-white/50 text-sm mb-1">Monthly</div>
                  <div className="text-4xl font-bold">$1,500–$2,000</div>
                  <div className="text-white/40 text-sm mt-1">/month</div>
                </div>

                <div className="mb-8 pb-8 border-b border-white/10">
                  <div className="text-white/50 text-sm mb-1">Setup</div>
                  <div className="text-2xl font-semibold text-white/80">$2,500–$4,000</div>
                  <div className="text-white/40 text-xs mt-1">One-time</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "4-page live dashboard (Product, Platform, Executive, Alerts)",
                    "Daily automated email reports",
                    "Weekly strategy call",
                    "Discord/Slack real-time alerts",
                    "24–48 hour setup time",
                    "BigQuery data warehouse",
                    "Shopify + all ad platform connectors",
                    "90 days historical data backfill",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-start gap-3 text-white/70"
                    >
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="https://calendly.com/thomas-rior/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full py-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-xl font-medium text-center hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
                >
                  Book a Call
                </motion.a>
              </div>
            </motion.div>

            {/* Tier 2: Custom Webapp */}
            <motion.div
              variants={cardVariants}
              className="relative p-8 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
            >
              <div>
                <h3 className="text-2xl font-bold mb-2">Custom Webapp</h3>
                <p className="text-white/50 text-sm mb-6">For brands wanting a branded, fully-custom experience</p>

                <div className="mb-6">
                  <div className="text-white/50 text-sm mb-1">Monthly</div>
                  <div className="text-4xl font-bold">$3,000–$4,000</div>
                  <div className="text-white/40 text-sm mt-1">/month</div>
                </div>

                <div className="mb-8 pb-8 border-b border-white/10">
                  <div className="text-white/50 text-sm mb-1">Setup</div>
                  <div className="text-2xl font-semibold text-white/80">$5,000–$8,000</div>
                  <div className="text-white/40 text-xs mt-1">One-time</div>
                </div>

                <ul className="space-y-4 mb-8">
                  {[
                    "Everything in Looker Studio, plus:",
                    "White-labeled branded dashboard",
                    "Custom features & integrations",
                    "Custom domain hosting",
                    "Priority support (same-day response)",
                    "1–2 week setup time",
                    "Unlimited users & seats",
                    "Quarterly business reviews",
                  ].map((item, i) => (
                    <motion.li
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05 }}
                      className={`flex items-start gap-3 ${i === 0 ? "text-white/90 font-medium" : "text-white/70"}`}
                    >
                      <span className="text-purple-400 mt-0.5">{i === 0 ? "→" : "✓"}</span>
                      <span className="text-sm">{item}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.a
                  href="https://calendly.com/thomas-rior/30min"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block w-full py-4 backdrop-blur-xl bg-white/10 border border-white/20 rounded-xl font-medium text-center hover:bg-white/15 transition-all duration-300"
                >
                  Book a Call
                </motion.a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-3xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={containerVariants}
            className="space-y-4"
          >
            {[
              {
                q: "How long does setup actually take?",
                a: "Looker Studio dashboards are live within 24–48 hours of our kickoff call. Custom webapps typically take 1–2 weeks depending on feature complexity and design requirements.",
              },
              {
                q: "What platforms do you integrate with?",
                a: "We connect to Shopify, Meta Ads (Facebook/Instagram), Google Ads, TikTok Ads, Klaviyo, and more. If you have a custom data source, we can likely build a connector for it.",
              },
              {
                q: "Can I switch from Looker Studio to Custom later?",
                a: "Absolutely. Many clients start with Looker Studio to validate the data model, then upgrade to a custom webapp once they're ready for a branded experience. We'll credit your setup fee toward the upgrade.",
              },
              {
                q: "What's included in the monthly fee?",
                a: "Daily data refresh, automated email reports, real-time alerts, monthly strategy calls, unlimited support, and ongoing dashboard maintenance. No hidden fees or surprise charges.",
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                variants={faqVariants}
                className="p-6 backdrop-blur-xl bg-white/5 rounded-2xl border border-white/10 hover:border-white/15 transition-colors duration-300"
              >
                <h3 className="font-semibold mb-3 text-white/90">{faq.q}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="p-12 backdrop-blur-xl bg-gradient-to-br from-white/5 to-white/[0.02] rounded-3xl border border-white/10">
            <h2 className="text-3xl font-bold mb-4">Ready to see your true profit?</h2>
            <p className="text-white/50 mb-8 max-w-xl mx-auto">
              Book a 20-minute call to discuss your setup and get a custom quote based on your data complexity.
            </p>
            <motion.a
              href="https://calendly.com/thomas-rior/30min"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-block px-10 py-5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-xl border border-white/20 rounded-xl font-medium hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300"
            >
              Book Your Call Now
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 backdrop-blur-xl bg-white/5 border-t border-white/10">
        <div className="max-w-5xl mx-auto flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="font-bold">rior.systems</span>
            <span className="text-white/40 ml-4">Profit Intelligence for Shopify</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="/" className="text-white/40 hover:text-white transition">Home</a>
            <a href="/builds" className="text-white/40 hover:text-white transition">Build log</a>
            <a href="/privacy" className="text-white/40 hover:text-white transition">Privacy</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
