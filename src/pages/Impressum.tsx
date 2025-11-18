import { Frame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Impressum() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Frame className="h-6 w-6 text-slate-900" />
            <span className="font-semibold text-lg">LightPicture</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Impressum</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Angaben gemäß § 5 TMG</h2>
              <p className="text-slate-700">
                LightPictures Lukas Pfister<br />
                Ingeborg-Bachmann-Straße 43<br />
                89134 Blaustein<br />
                Deutschland
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Kontakt</h2>
              <p className="text-slate-700">
                E-Mail: info@lightpicture-3d.de
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Kleinunternehmer gemäß § 19 UStG</h2>
              <p className="text-slate-700">
                Als Kleinunternehmer im Sinne von § 19 Abs. 1 UStG wird keine Umsatzsteuer berechnet.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Verantwortlich für den Inhalt</h2>
              <p className="text-slate-700">
                Lukas Pfister<br />
                [Ihre Straße und Hausnummer]<br />
                [Ihre PLZ und Stadt]
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">EU-Streitschlichtung</h2>
              <p className="text-slate-700">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:<br />
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  https://ec.europa.eu/consumers/odr
                </a><br />
                Unsere E-Mail-Adresse finden Sie oben im Impressum.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
