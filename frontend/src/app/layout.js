import "./globals.css";

export const metadata = {
  title: "Ambuj Kumar Tripathi's Agentic Chatbot",
  description: "An enterprise-grade Agentic AI Workspace built by Ambuj Kumar Tripathi, featuring Human-in-the-Loop orchestration and live MCP tool integrations.",
  icons: {
    icon: "/icon.jpg",
  },
  openGraph: {
    title: "Ambuj Kumar Tripathi's Agentic Chatbot",
    description: "An enterprise-grade Agentic AI Workspace built by Ambuj Kumar Tripathi, featuring Human-in-the-Loop orchestration and live MCP tool integrations.",
    siteName: "Ambuj Kumar Tripathi's Workspace",
    images: [
      {
        url: "/icon.jpg", 
        width: 256,
        height: 256,
        alt: "Ambuj Kumar Tripathi's Agentic Workspace",
      }
    ],
  },
};

import Providers from "../components/Providers";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
