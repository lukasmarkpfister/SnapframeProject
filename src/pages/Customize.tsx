import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Upload, Frame, Loader2, Check } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import frameColorsImg from '../static/framecolors.jpeg';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type FrameColor = 'black' | 'white';

function Customize() {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 90,
    height: 90,
    x: 5,
    y: 5,
  });
  const [completedCrop, setCompletedCrop] = useState<PixelCrop | null>(null);
  const [frameColor, setFrameColor] = useState<FrameColor>('black');
  const [loading, setLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return Promise.reject(new Error('No 2d context'));
    }

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      800,
      600
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas is empty'));
          return;
        }
        resolve(blob);
      }, 'image/jpeg', 0.95);
    });
  };

  const handleCheckout = async () => {
    if (!croppedImageBlob) {
      alert('Bitte wählen Sie zuerst ein Bild aus');
      return;
    }

    setLoading(true);
    try {
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('order-images')
        .upload(fileName, croppedImageBlob, {
          contentType: 'image/jpeg',
          cacheControl: '3600',
        });

      if (uploadError) throw uploadError;

      // Create signed URL via Edge Function (needs service role)
      const signedUrlResponse = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-signed-url`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filePath: uploadData.path,
          }),
        }
      );

      const urlData = await signedUrlResponse.json();
      
      if (!urlData.signedUrl) {
        throw new Error('Failed to create signed URL');
      }

      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          image_url: urlData.signedUrl,
          frame_color: frameColor,
          status: 'pending',
          customer_email: '',
          customer_name: null,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            origin: window.location.origin,
            orderId: orderData.id,
            imageUrl: urlData.signedUrl,
            frameColor: frameColor,
          }),
        }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Checkout fehlgeschlagen');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Fehler beim Verarbeiten. Bitte versuchen Sie es erneut.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Frame className="h-6 w-6 text-slate-900" />
            <span className="font-semibold text-lg">LightPicture</span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <span className={step === 1 ? 'font-semibold text-slate-900' : ''}>1. Bild</span>
            <span>→</span>
            <span className={step === 2 ? 'font-semibold text-slate-900' : ''}>2. Rahmen</span>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {step === 1 && (
            <div className="space-y-8 min-h-[calc(100vh-12rem)]">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Laden Sie Ihr Bild hoch
                </h1>
                <p className="text-base md:text-lg text-slate-600">
                  Wählen Sie den gewünschten Ausschnitt (800x600 Pixel)
                </p>
              </div>

              {!selectedImage ? (
                <Card className="border-2 border-dashed">
                  <CardContent className="pt-12 pb-12">
                    <label className="flex flex-col items-center gap-4 cursor-pointer">
                      <div className="h-24 w-24 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Upload className="h-12 w-12 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-slate-900">
                          Klicken Sie zum Hochladen
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          PNG, JPG bis zu 10MB
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  <Card>
                    <CardContent className="pt-6">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        onComplete={(c) => setCompletedCrop(c)}
                        aspect={800 / 600}
                      >
                        <img
                          ref={imgRef}
                          src={selectedImage}
                          alt="Upload"
                          className="max-w-full"
                        />
                      </ReactCrop>
                    </CardContent>
                  </Card>

                  <div className="flex gap-4">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImage(null)}
                      className="flex-1"
                    >
                      Neues Bild
                    </Button>
                    <Button
                      onClick={async () => {
                        if (imgRef.current && completedCrop) {
                          const blob = await getCroppedImg(imgRef.current, completedCrop);
                          setCroppedImageBlob(blob);
                          setStep(2);
                        }
                      }}
                      disabled={!completedCrop}
                      className="flex-1 bg-slate-900 hover:bg-slate-800"
                    >
                      Weiter
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 min-h-[calc(100vh-12rem)]">
              <div className="text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Wählen Sie Ihre Rahmenfarbe
                </h1>
                <p className="text-base md:text-lg text-slate-600">
                  Schwarz oder Weiß - Ihre Wahl
                </p>
              </div>

              <div className="mb-8">
                <img 
                  src={frameColorsImg} 
                  alt="Rahmenfarben Optionen" 
                  className="w-full max-w-3xl mx-auto rounded-2xl shadow-xl"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
                <Card
                  className={`cursor-pointer border-2 transition-all ${
                    frameColor === 'black'
                      ? 'border-slate-900 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setFrameColor('black')}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="aspect-square bg-slate-900 rounded-lg mb-4 flex items-center justify-center relative">
                      {frameColor === 'black' && (
                        <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                          <Check className="h-5 w-5 text-slate-900" />
                        </div>
                      )}
                      <Frame className="h-16 w-16 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Schwarzer Rahmen</h3>
                  </CardContent>
                </Card>

                <Card
                  className={`cursor-pointer border-2 transition-all ${
                    frameColor === 'white'
                      ? 'border-slate-900 shadow-lg'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => setFrameColor('white')}
                >
                  <CardContent className="pt-8 pb-8">
                    <div className="aspect-square bg-white border-2 border-slate-200 rounded-lg mb-4 flex items-center justify-center relative">
                      {frameColor === 'white' && (
                        <div className="absolute top-2 right-2 bg-slate-900 rounded-full p-1">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                      <Frame className="h-16 w-16 text-slate-900" />
                    </div>
                    <h3 className="text-xl font-semibold text-center">Weißer Rahmen</h3>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Zurück
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 text-lg py-6"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Wird verarbeitet...
                    </>
                  ) : (
                    'Zur Kasse - €29,90'
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Customize;
