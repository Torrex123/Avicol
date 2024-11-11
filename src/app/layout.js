import "./globals.css";


export const metadata = {
  title: "Avicol",
  description: "Birdwatching in Colombia",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
