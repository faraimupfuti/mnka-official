import './globals.css';
import { Bricolage_Grotesque, Figtree } from 'next/font/google';
const display = Bricolage_Grotesque({ subsets: ['latin'], variable: '--display' });
const body = Figtree({ subsets: ['latin'], variable: '--body' });
export const metadata = {
  title: 'Mnka Cleaning Services | Clean spaces. Happy places.',
  description: 'Book home, office and laundry cleaning online and pay securely. Mnka Cleaning Services.',
  icons: { icon: '/logo.png' },
};
export default function Layout({ children }) {
  return (<html lang="en"><body className={`${display.variable} ${body.variable}`}>{children}</body></html>);
}
