import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { XCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Cancel() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-slate-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            Bestellung abgebrochen
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-slate-700">
              Ihre Bestellung wurde nicht abgeschlossen.
            </p>
            <p className="text-slate-600">
              Es wurden keine Beträge von Ihrem Konto abgebucht. Versuchen Sie es gerne erneut, wenn Sie bereit sind.
            </p>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800"
              onClick={() => navigate('/customize')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Erneut versuchen
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Zur Startseite
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            Benötigen Sie Hilfe? Kontaktieren Sie uns unter support@lightpicture-3d.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
