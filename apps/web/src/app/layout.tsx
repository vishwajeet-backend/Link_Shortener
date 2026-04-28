import "./globals.css";

export const metadata = {
  title: "Role-Based URL Shortener",
  description: "Production SaaS URL management platform"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
