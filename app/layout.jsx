import { Barlow_Condensed, IBM_Plex_Sans, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';

// Display: condensed athletic caps — the register of a team sheet, a kit
// number, a scoreboard.
const display = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

// Body: a workhorse with more grain than the usual UI grotesque.
const body = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

// Data: reps, durations, calories and splits are numbers you scan and compare,
// so they get a real monospace rather than being set as prose.
const mono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
});

export const metadata = {
  title: 'Train Like A Trainer — Position-specific drills, coached properly',
  description:
    'A drill library organised the way coaches actually think: by sport, by position, by what you are trying to fix. Every drill has a setup, an execution, the cues that matter and the mistakes to avoid.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${display.variable} ${body.variable} ${mono.variable} min-h-screen flex flex-col antialiased`}
      >
        <Providers>
          <Navbar />
          {/* min-h-screen keeps the footer below the fold while a client page
              is still fetching. Without it, a short loading state left the
              footer sitting mid-screen and then jumping down once data
              arrived. */}
          <main className="flex-grow min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
