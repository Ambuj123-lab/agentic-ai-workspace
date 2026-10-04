import "./globals.css";

export const metadata = {
  metadataBase: new URL('https://agentic-ai-workspace.onrender.com'),
  title: "Ambuj Kumar Tripathi's Agentic Chatbot | M8ven Verified FastMCP Servers",
  description: "Production-grade FastMCP server suite independently audited on M8ven Trust Index (Score: 89/100, Grade B). Features 20 live tools, LangGraph ReAct orchestration, Python AST math sandboxing, and Human-in-the-Loop governance.",
  icons: {
    icon: "/icon.jpg",
    apple: "/icon.jpg",
  },
  openGraph: {
    title: "Ambuj Kumar Tripathi | M8ven Code-Audited 2× FastMCP Servers",
    description: "Production-grade FastMCP server suite independently audited on M8ven Trust Index (Score: 89/100, Grade B). Features 20 live tools, LangGraph ReAct orchestration, and Python AST math sandboxing.",
    siteName: "Ambuj Kumar Tripathi's Workspace",
    url: 'https://agentic-ai-workspace.onrender.com',
    type: 'website',
    images: [
      {
        url: "/og_m8ven_verified.png",
        width: 1200,
        height: 630,
        alt: "M8ven Code-Audited 2× FastMCP Servers - Ambuj Kumar Tripathi",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ambuj Kumar Tripathi | M8ven Code-Audited 2× FastMCP Servers",
    description: "Production-grade FastMCP server suite independently audited on M8ven Trust Index (Score: 89/100, Grade B).",
    images: ["/og_m8ven_verified.png"],
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
