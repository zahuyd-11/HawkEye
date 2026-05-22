import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.04] bg-gradient-to-b from-hawkeye-charcoal/80 via-hawkeye-navy/60 to-hawkeye-obsidian">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <BrandLogo href="/" size={48} />
            <p className="text-sm text-zinc-500 leading-relaxed">
              AI Investment Companion cho nhà đầu tư cá nhân Việt Nam — phân tích định lượng,
              quản trị rủi ro.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">Liên hệ</h3>
            <div className="space-y-2 text-sm text-zinc-500">
              <p>
                <span className="font-medium text-zinc-400">Hotline:</span>{" "}
                <a href="tel:0913428077" className="text-hawkeye-glow hover:text-hawkeye-glow-bright transition-colors">
                  0913428077
                </a>
              </p>
              <p>
                <span className="font-medium text-zinc-400">Email:</span>{" "}
                <a
                  href="mailto:hawkeye.contact@gmail.com"
                  className="text-hawkeye-glow hover:text-hawkeye-glow-bright transition-colors"
                >
                  hawkeye.contact@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">Chính sách</h3>
            <ul className="space-y-2 text-sm">
              {[
                ["/terms", "Terms of Use"],
                ["/privacy", "Privacy Policy"],
                ["/data-policy", "Data Policy"],
                ["/operational-regulations", "Operational Regulations"],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link href={href} className="text-zinc-500 hover:text-hawkeye-glow-bright transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-zinc-200">Hỗ trợ</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-zinc-500 hover:text-hawkeye-glow-bright transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-zinc-500 hover:text-hawkeye-glow-bright transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/[0.04]">
          <p className="text-xs text-zinc-600 text-center leading-relaxed">
            <strong className="text-zinc-500">Disclaimer:</strong> HawkEye không cung cấp khuyến nghị
            đầu tư cá nhân. Thông tin chỉ mang tính giáo dục và tham khảo.
          </p>
          <p className="text-xs text-zinc-600 text-center mt-2">
            © {new Date().getFullYear()} HawkEye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
