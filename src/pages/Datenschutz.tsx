import { Frame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Datenschutz() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Datenschutzerklärung</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Datenschutz auf einen Blick</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Allgemeine Hinweise</h3>
              <p className="text-slate-700 mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Datenerfassung auf dieser Website</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Wer ist verantwortlich für die Datenerfassung?</h3>
              <p className="text-slate-700 mb-4">
                Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                können Sie dem Impressum dieser Website entnehmen.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">Wie erfassen wir Ihre Daten?</h3>
              <p className="text-slate-700 mb-4">
                Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z.B. 
                um Daten handeln, die Sie in ein Kontaktformular eingeben oder Bilder, die Sie für die Gestaltung 
                Ihres Produkts hochladen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Hosting und Content Delivery Networks</h2>
              <p className="text-slate-700 mb-4">
                Diese Website wird bei einem externen Dienstleister gehostet (Hoster). Die personenbezogenen Daten, 
                die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Zahlungsdienstleister</h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Stripe</h3>
              <p className="text-slate-700 mb-4">
                Wir verwenden auf dieser Website den Zahlungsdienstleister Stripe. Anbieter ist die Stripe Inc., 
                510 Townsend Street, San Francisco, CA 94103, USA. Wenn Sie mit Stripe bezahlen, werden Ihre 
                Zahlungsdaten an Stripe übermittelt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Datenverarbeitung bei Bestellungen</h2>
              <p className="text-slate-700 mb-4">
                Zur Abwicklung Ihrer Bestellung verarbeiten wir folgende Daten:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mb-4">
                <li>Hochgeladene Bilder für die Produkterstellung</li>
                <li>Ausgewählte Produktoptionen (Rahmenfarbe)</li>
                <li>Zahlungsinformationen (über Stripe verarbeitet)</li>
                <li>E-Mail-Adresse für die Bestellbestätigung</li>
              </ul>
              <p className="text-slate-700">
                Diese Daten werden ausschließlich zur Erfüllung des Vertrags verwendet und nach Ablauf der 
                gesetzlichen Aufbewahrungsfristen gelöscht.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Ihre Rechte</h2>
              <p className="text-slate-700 mb-4">
                Sie haben jederzeit das Recht:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2">
                <li>Auskunft über Ihre bei uns gespeicherten Daten zu erhalten</li>
                <li>Berichtigung unrichtiger personenbezogener Daten zu verlangen</li>
                <li>Löschung Ihrer bei uns gespeicherten Daten zu verlangen</li>
                <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                <li>Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen</li>
                <li>Datenübertragbarkeit zu verlangen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Kontakt</h2>
              <p className="text-slate-700">
                Bei Fragen zum Datenschutz können Sie sich jederzeit an uns wenden:<br />
                E-Mail: datenschutz@lightpicture-3d.com
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
