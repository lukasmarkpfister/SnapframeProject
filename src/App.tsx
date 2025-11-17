import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';
import { Card, CardContent } from './components/ui/card';
import { Sun, Frame, Eye, Sparkles } from 'lucide-react';
import Footer from './components/Footer';
import productVisibleImg from './static/productpicvisible.webp';
import productInvisibleImg from './static/productpicinvisible.webp';
import productStackedImg from './static/productblackframestacked.webp';
import productStacked2Img from './static/productblackframestacked2.webp';
import frameColorsImg from './static/framecolors.webp';

function App() {
  const navigate = useNavigate();

  const handleCustomize = () => {
    navigate('/customize');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer bg-transparent border-0 p-0">
            <Frame className="h-6 w-6 text-slate-900" />
            <span className="font-semibold text-lg">LightPicture</span>
          </button>
          <Button onClick={handleCustomize} className="bg-slate-900 hover:bg-slate-800">
            Jetzt gestalten
          </Button>
        </div>
      </header>

      <main className="w-full">
        <section className="w-full px-4 py-16 md:py-24 lg:py-32">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 text-white text-sm mb-6">
              <Sparkles className="h-4 w-4" />
              <span>Einzigartiges 3D-gedrucktes Design</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
              Kunst, die zum Leben erwacht
              <br />
              <span className="text-slate-600">Mit natürlichem Licht</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Erleben Sie einen revolutionären Bilderrahmen, bei dem Ihre Fotos verborgen bleiben,
              bis sie von natürlichem Licht oder einer Lampe von hinten beleuchtet werden.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-slate-900 hover:bg-slate-800"
                onClick={handleCustomize}
              >
                Jetzt gestalten für €29,90
              </Button>
              <p className="text-sm text-slate-500">Begrenzte Stückzahl verfügbar</p>
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-12 md:py-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={productVisibleImg} 
                  alt="LightPicture Rahmen - sichtbar bei Hintergrundbeleuchtung" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src={productInvisibleImg} 
                  alt="LightPicture Rahmen - unsichtbar ohne Beleuchtung" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-4 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
                So funktioniert es
              </h2>
              <p className="text-lg md:text-xl text-slate-600">
                Eine perfekte Mischung aus Technologie und Kunst
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 md:gap-8 mb-12">
              <Card className="border-2 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                    <Frame className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">3D-gedruckter Einsatz</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Präzisionsgefertigter Einsatz mit Mikro-Perforationen, die ein einzigartiges Lichtfiltermuster erzeugen.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                    <Sun className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">Hintergrundbeleuchtung</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Platzieren Sie es in der Nähe eines Fensters oder einer Lampe. Das Licht scheint durch und enthüllt Ihr Bild in atemberaubenden Details.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 hover:border-slate-300 transition-all duration-300 hover:shadow-lg">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 flex items-center justify-center mx-auto mb-6">
                    <Eye className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-slate-900">Verborgene Schönheit</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Von vorne erscheint es als dezente Textur. Die Magie passiert, wenn Licht von hinten scheint.
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={productStackedImg} 
                  alt="Gestapelte LightPicture Rahmen" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-2xl overflow-hidden shadow-xl">
                <img 
                  src={frameColorsImg} 
                  alt="LightPicture Rahmenfarben" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full bg-slate-900 text-white py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                Verwandeln Sie Ihren Raum noch heute
              </h2>
              <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl mx-auto">
                Jeder Rahmen wird sorgfältig gefertigt, um Ihrem Zuhause einen Hauch von Wunder zu verleihen.
                Perfekt für Geschenke oder persönliche Sammlungen.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-lg px-8 py-6 h-auto bg-white text-slate-900 hover:bg-slate-100"
                  onClick={handleCustomize}
                >
                  Jetzt bestellen - €29,90
                </Button>
              </div>
              <p className="text-slate-400 text-sm mt-6">Sichere Bezahlung über Stripe</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default App;
