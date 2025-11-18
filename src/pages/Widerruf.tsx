import { Frame } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function Widerruf() {
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Widerrufsbelehrung</h1>
          
          <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Widerrufsrecht</h2>
              <p className="text-slate-700 mb-4">
                Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
              </p>
              <p className="text-slate-700 mb-4">
                Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter, 
                der nicht der Beförderer ist, die Waren in Besitz genommen haben bzw. hat.
              </p>
              <p className="text-slate-700">
                Um Ihr Widerrufsrecht auszuüben, müssen Sie uns:
              </p>
              <div className="bg-slate-50 p-4 rounded-lg mt-4 mb-4">
                <p className="text-slate-700">
                  <strong>LightPictures Lukas Pfister</strong><br />
                  Ingeborg-Bachmann-Straße 43<br />
                  89134 Blaustein<br />
                  Deutschland<br />
                  E-Mail: versandhandellukaspfister@gmail.com
                </p>
              </div>
              <p className="text-slate-700">
                mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren 
                Entschluss, diesen Vertrag zu widerrufen, informieren.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Folgen des Widerrufs</h2>
              <p className="text-slate-700 mb-4">
                Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, 
                einschließlich der Lieferkosten (mit Ausnahme der zusätzlichen Kosten, die sich daraus ergeben, dass 
                Sie eine andere Art der Lieferung als die von uns angebotene günstigste Standardlieferung gewählt haben), 
                unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über 
                Ihren Widerruf dieses Vertrags bei uns eingegangen ist.
              </p>
              <p className="text-slate-700 mb-4">
                Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion 
                eingesetzt haben, es sei denn, mit Ihnen wurde ausdrücklich etwas anderes vereinbart; in keinem Fall 
                werden Ihnen wegen dieser Rückzahlung Entgelte berechnet.
              </p>
              <p className="text-slate-700">
                Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben oder bis Sie den 
                Nachweis erbracht haben, dass Sie die Waren zurückgesandt haben, je nachdem, welches der frühere 
                Zeitpunkt ist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Rücksendung der Waren</h2>
              <p className="text-slate-700 mb-4">
                Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen vierzehn Tagen ab dem Tag, an dem 
                Sie uns über den Widerruf dieses Vertrags unterrichten, an uns zurückzusenden oder zu übergeben. Die 
                Frist ist gewahrt, wenn Sie die Waren vor Ablauf der Frist von vierzehn Tagen absenden.
              </p>
              <p className="text-slate-700 mb-4">
                Sie tragen die unmittelbaren Kosten der Rücksendung der Waren.
              </p>
              <p className="text-slate-700">
                Sie müssen für einen etwaigen Wertverlust der Waren nur aufkommen, wenn dieser Wertverlust auf einen 
                zur Prüfung der Beschaffenheit, Eigenschaften und Funktionsweise der Waren nicht notwendigen Umgang 
                mit ihnen zurückzuführen ist.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Besondere Hinweise</h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-slate-700 font-semibold mb-2">
                  Wichtiger Hinweis zu individualisierten Produkten:
                </p>
                <p className="text-slate-700">
                  Da unsere Produkte nach Kundenwünschen angefertigt und individualisiert werden (Verwendung Ihres 
                  persönlichen Bildes), besteht gemäß § 312g Abs. 2 Nr. 1 BGB kein Widerrufsrecht für die Lieferung 
                  von Waren, die nach Kundenspezifikation angefertigt werden oder eindeutig auf die persönlichen 
                  Bedürfnisse zugeschnitten sind.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-900 mb-4">Muster-Widerrufsformular</h2>
              <div className="bg-slate-50 p-6 rounded-lg">
                <p className="text-slate-700 mb-4">
                  Wenn Sie den Vertrag widerrufen wollen, können Sie dieses Formular verwenden:
                </p>
                <div className="border border-slate-300 p-4 text-slate-700 space-y-2 font-mono text-sm">
                  <p>An LightPictures Lukas Pfister</p>
                  <p>Ingeborg-Bachmann-Straße 43</p>
                  <p>89134 Blaustein</p>
                  <p>E-Mail: versandhandellukaspfister@gmail.com</p>
                  <p className="mt-4">Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)</p>
                  <p className="mt-4">- Bestellt am (*)/erhalten am (*)</p>
                  <p>- Name des/der Verbraucher(s)</p>
                  <p>- Anschrift des/der Verbraucher(s)</p>
                  <p>- Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</p>
                  <p>- Datum</p>
                  <p className="mt-4 text-xs">(*) Unzutreffendes streichen.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
