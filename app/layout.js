import "@fontsource/dm-mono"; // Defaults to weight 400
import "./globals.css";
export const metadata = {
  title: "Tracktie",
  description: "Sync you input's BPMs",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
        {children}
    </html>
  );
}
