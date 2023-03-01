import Navbar from '@/components/Header';
import GlobalProvider from '@/context/GlobalContext';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GlobalProvider>
      <Navbar />
      <Component {...pageProps} />
    </GlobalProvider>
  );
}
