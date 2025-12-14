import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">H</span>
              </div>
              <span className="font-bold text-xl">HawkEye</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Investment Decision Support Platform for retail investors in Vietnam.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Contact Us</h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Hotline:</span>{" "}
                <a href="tel:0913428077" className="text-primary hover:underline">
                  0913428077
                </a>
              </p>
              <p>
                <span className="font-medium">Email:</span>{" "}
                <a href="mailto:hawkeye.contact@gmail.com" className="text-primary hover:underline">
                  hawkeye.contact@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Policies</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/data-policy" className="text-muted-foreground hover:text-primary">
                  Data Policy
                </Link>
              </li>
              <li>
                <Link href="/operational-regulations" className="text-muted-foreground hover:text-primary">
                  Operational Regulations
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Disclaimer:</strong> HawkEye does not provide personalized investment advice. 
            All information is for educational and informational purposes only.
          </p>
          <p className="text-xs text-muted-foreground text-center mt-2">
            © {new Date().getFullYear()} HawkEye. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

