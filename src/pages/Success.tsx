import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { CheckCircle2, Frame, Home } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-xl">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-3xl font-bold text-slate-900">
            Bestellung bestätigt!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <div className="space-y-2">
            <p className="text-lg text-slate-700">
              Vielen Dank für Ihren Kauf!
            </p>
            <p className="text-slate-600">
              Ihr beleuchteter Bilderrahmen ist unterwegs. Sie erhalten in Kürze eine Bestätigungs-E-Mail mit Tracking-Details.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-slate-700">
              <Frame className="h-5 w-5" />
              <span className="font-semibold">LightPicture</span>
            </div>
            <p className="text-sm text-slate-600">€29.90</p>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              size="lg"
              className="w-full bg-slate-900 hover:bg-slate-800"
              onClick={() => navigate('/')}
            >
              <Home className="h-4 w-4 mr-2" />
              Zur Startseite
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            Fragen? Kontaktieren Sie uns unter support@lightpicture-3d.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
