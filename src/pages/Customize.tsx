import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Upload, Frame, Loader2, Check, RotateCw } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
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
  const [rotation, setRotation] = useState(0);
  const [isPortrait, setIsPortrait] = useState(false);
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
        setRotation(0);
        setIsPortrait(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
    const newIsPortrait = !isPortrait;
    setIsPortrait(newIsPortrait);
    
    // Get image dimensions to calculate optimal crop
    if (imgRef.current) {
      const img = imgRef.current;
      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgAspect = imgWidth / imgHeight;
      
      // Target aspect ratios
      const targetAspect = newIsPortrait ? (600 / 800) : (800 / 600); // 0.75 or 1.333
      
      let cropWidth, cropHeight;
      
      if (imgAspect > targetAspect) {
        // Image is wider than target - fit to height
        cropHeight = 90;
        cropWidth = (cropHeight * targetAspect * imgHeight) / imgWidth;
      } else {
        // Image is taller than target - fit to width
        cropWidth = 90;
        cropHeight = (cropWidth * imgWidth) / (targetAspect * imgHeight);
      }
      
      // Center the crop
      const x = (100 - cropWidth) / 2;
      const y = (100 - cropHeight) / 2;
      
      setCrop({
        unit: '%',
        width: cropWidth,
        height: cropHeight,
        x: x,
        y: y,
      });
    }
    
    setCompletedCrop(null);
  };

  const getCroppedImg = (image: HTMLImageElement, crop: PixelCrop): Promise<Blob> => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    // Set canvas dimensions based on rotation
    const outputWidth = 800;
    const outputHeight = 600;
    
    if (rotation === 90 || rotation === 270) {
      canvas.width = outputHeight;
      canvas.height = outputWidth;
    } else {
      canvas.width = outputWidth;
      canvas.height = outputHeight;
    }

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return Promise.reject(new Error('No 2d context'));
    }

    // Calculate center for rotation
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Apply rotation transformation
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw image with proper dimensions based on rotation
    let drawWidth, drawHeight, drawX, drawY;
    
    if (rotation === 90 || rotation === 270) {
      drawWidth = outputHeight;
      drawHeight = outputWidth;
    } else {
      drawWidth = outputWidth;
      drawHeight = outputHeight;
    }
    
    drawX = -drawWidth / 2;
    drawY = -drawHeight / 2;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      drawX,
      drawY,
      drawWidth,
      drawHeight
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
    <div className="h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col overflow-hidden">
      <header className="border-b bg-white/80 backdrop-blur-sm z-50 flex-shrink-0">
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

      <main className="flex-1 w-full px-4 py-6 overflow-y-auto">
        <div className="max-w-5xl mx-auto h-full">
          {step === 1 && (
            <div className="flex flex-col h-full space-y-4">
              <div className="text-center flex-shrink-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  Laden Sie Ihr Bild hoch
                </h1>
                <p className="text-sm md:text-base text-slate-600">
                  Wählen Sie den gewünschten Ausschnitt (800x600 Pixel)
                </p>
              </div>

              {!selectedImage ? (
                <Card className="border-2 border-dashed flex-1 flex items-center justify-center">
                  <CardContent className="py-12">
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
                <>
                  <Card className="flex-1 overflow-hidden">
                    <CardContent className="pt-4 h-full flex items-center justify-center">
                      <div className="max-h-full overflow-auto">
                        <ReactCrop
                          crop={crop}
                          onChange={(c) => setCrop(c)}
                          onComplete={(c) => setCompletedCrop(c)}
                          aspect={isPortrait ? 600 / 800 : 800 / 600}
                        >
                          <img
                            ref={imgRef}
                            src={selectedImage}
                            alt="Upload"
                            style={{ 
                              maxHeight: 'calc(100vh - 300px)',
                              width: 'auto'
                            }}
                          />
                        </ReactCrop>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImage(null)}
                    >
                      Neues Bild
                    </Button>
                    <Button
                      variant="outline"
                      onClick={rotateImage}
                      className="flex items-center gap-2"
                    >
                      <RotateCw className="h-4 w-4" />
                      {isPortrait ? 'Querformat' : 'Hochformat'}
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
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col h-full space-y-4">
              <div className="text-center flex-shrink-0">
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                  Wählen Sie Ihre Rahmenfarbe
                </h1>
                <p className="text-sm md:text-base text-slate-600">
                  Schwarz oder Weiß - Ihre Wahl
                </p>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                <div className="flex justify-center">
                  <img 
                    src={frameColorsImg} 
                    alt="Rahmenfarben Optionen" 
                    className="w-full max-w-2xl rounded-xl shadow-lg"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <Card
                    className={`cursor-pointer border-2 transition-all ${
                      frameColor === 'black'
                        ? 'border-slate-900 shadow-lg'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                    onClick={() => setFrameColor('black')}
                  >
                    <CardContent className="pt-6 pb-6">
                      <div className="aspect-square bg-slate-900 rounded-lg mb-3 flex items-center justify-center relative">
                        {frameColor === 'black' && (
                          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
                            <Check className="h-5 w-5 text-slate-900" />
                          </div>
                        )}
                        <Frame className="h-12 w-12 text-white" />
                      </div>
                      <h3 className="text-lg font-semibold text-center">Schwarzer Rahmen</h3>
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
                    <CardContent className="pt-6 pb-6">
                      <div className="aspect-square bg-white border-2 border-slate-200 rounded-lg mb-3 flex items-center justify-center relative">
                        {frameColor === 'white' && (
                          <div className="absolute top-2 right-2 bg-slate-900 rounded-full p-1">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                        <Frame className="h-12 w-12 text-slate-900" />
                      </div>
                      <h3 className="text-lg font-semibold text-center">Weißer Rahmen</h3>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
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
    </div>
  );
}

export default Customize;
