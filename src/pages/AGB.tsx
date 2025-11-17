import { Frame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function AGB() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Allgemeine Geschäftsbedingungen (AGB)</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">1. Geltungsbereich</h2>
              <p className="text-slate-700">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge über die Lieferung von Waren, 
                die ein Verbraucher oder Unternehmer (im Folgenden „Kunde") mit LightPicture GmbH (im Folgenden „Verkäufer") 
                über die Website lightpicture-3d.de abschließt.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">2. Vertragsschluss</h2>
              <p className="text-slate-700 mb-4">
                Die auf der Website präsentierten Produkte stellen kein rechtlich bindendes Angebot dar, sondern eine 
                unverbindliche Aufforderung an den Kunden, Waren zu bestellen.
              </p>
              <p className="text-slate-700">
                Der Kunde kann das Angebot über das in die Website integrierte Online-Bestellformular abgeben. 
                Dabei durchläuft der Kunde folgende Schritte:
              </p>
              <ol className="list-decimal list-inside text-slate-700 space-y-2 mt-2">
                <li>Upload des gewünschten Bildes</li>
                <li>Auswahl des Bildausschnitts</li>
                <li>Auswahl der Rahmenfarbe</li>
                <li>Weiterleitung zur Zahlungsabwicklung (Stripe)</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">3. Preise und Versandkosten</h2>
              <p className="text-slate-700 mb-4">
                Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer. Der Produktpreis beträgt €29,90 
                und beinhaltet die Versandkosten innerhalb Deutschlands.
              </p>
              <p className="text-slate-700">
                Für Lieferungen ins Ausland können zusätzliche Versandkosten anfallen, die vor Abschluss der Bestellung 
                angezeigt werden.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">4. Lieferung</h2>
              <p className="text-slate-700 mb-4">
                Die Lieferung erfolgt im Regelfall innerhalb von 7-14 Werktagen nach Bestelleingang. Da jedes Produkt 
                individuell auf Bestellung gefertigt wird, kann die Lieferzeit variieren.
              </p>
              <p className="text-slate-700">
                Der Kunde wird per E-Mail über den Versand und die voraussichtliche Lieferzeit informiert.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">5. Zahlung</h2>
              <p className="text-slate-700">
                Die Zahlung erfolgt über den Zahlungsdienstleister Stripe. Folgende Zahlungsmethoden werden akzeptiert:
              </p>
              <ul className="list-disc list-inside text-slate-700 space-y-2 mt-2">
                <li>Kreditkarte (Visa, Mastercard, American Express)</li>
                <li>Debitkarte</li>
                <li>Apple Pay / Google Pay</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">6. Eigentumsvorbehalt</h2>
              <p className="text-slate-700">
                Die gelieferte Ware bleibt bis zur vollständigen Bezahlung Eigentum des Verkäufers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">7. Gewährleistung</h2>
              <p className="text-slate-700">
                Es gelten die gesetzlichen Gewährleistungsrechte. Bei Mängeln kann der Kunde zunächst Nacherfüllung 
                verlangen. Schlägt die Nacherfüllung fehl, kann der Kunde nach seiner Wahl den Kaufpreis mindern oder 
                vom Vertrag zurücktreten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">8. Bildrechte</h2>
              <p className="text-slate-700 mb-4">
                Der Kunde versichert, dass er über alle notwendigen Rechte an den hochgeladenen Bildern verfügt und 
                dass durch die Verwendung keine Rechte Dritter verletzt werden.
              </p>
              <p className="text-slate-700">
                Der Verkäufer behält sich vor, Bestellungen abzulehnen, wenn Zweifel an der Rechtmäßigkeit der 
                Bildverwendung bestehen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">9. Haftung</h2>
              <p className="text-slate-700">
                Der Verkäufer haftet unbeschränkt für Vorsatz und grobe Fahrlässigkeit. Bei leichter Fahrlässigkeit 
                haftet der Verkäufer nur bei Verletzung wesentlicher Vertragspflichten (Kardinalpflichten).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">10. Streitbeilegung</h2>
              <p className="text-slate-700">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die unter 
                <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline ml-1">
                  https://ec.europa.eu/consumers/odr
                </a> erreichbar ist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">11. Schlussbestimmungen</h2>
              <p className="text-slate-700">
                Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss des UN-Kaufrechts. 
                Sollten einzelne Bestimmungen dieser AGB unwirksam sein oder werden, bleibt die Wirksamkeit der 
                übrigen Bestimmungen hiervon unberührt.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
