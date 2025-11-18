import { useState, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Upload, Frame, Loader2, Check, RotateCw } from 'lucide-react';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { createClient } from '@supabase/supabase-js';
import { Link } from 'react-router-dom';
import frameColorsImg from '../static/framecolors.webp';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

type FrameColor = 'black' | 'white';

function Customize() {
  const [step, setStep] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [croppedImageBlob, setCroppedImageBlob] = useState<Blob | null>(null);
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
        const img = new Image();
        img.onload = () => {
          // Auto-detect orientation based on image dimensions
          const detectedIsPortrait = img.height > img.width;
          setIsPortrait(detectedIsPortrait);
          setSelectedImage(reader.result as string);
          
          // Set initial crop based on detected orientation
          const targetAspect = detectedIsPortrait ? (600 / 800) : (800 / 600);
          const imgAspect = img.width / img.height;
          
          let cropWidth, cropHeight;
          
          if (imgAspect > targetAspect) {
            // Image is wider than target - fit to height
            cropHeight = 90;
            cropWidth = (cropHeight * targetAspect * img.height) / img.width;
          } else {
            // Image is taller than target - fit to width
            cropWidth = 90;
            cropHeight = (cropWidth * img.width) / (targetAspect * img.height);
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
          setCompletedCrop(null);
        };
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const rotateImage = () => {
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

    // Set canvas dimensions based on portrait/landscape orientation
    // Portrait: 600x800, Landscape: 800x600
    const outputWidth = isPortrait ? 600 : 800;
    const outputHeight = isPortrait ? 800 : 600;
    
    canvas.width = outputWidth;
    canvas.height = outputHeight;

    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return Promise.reject(new Error('No 2d context'));
    }

    // No rotation applied - the image is already in the correct orientation
    // based on isPortrait. We just crop and resize.
    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
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

      <main className="flex-1 w-full px-2 md:px-4 py-3 md:py-6 overflow-hidden">
        <div className="max-w-5xl mx-auto h-full overflow-hidden">
          {step === 1 && (
            <div className="flex flex-col h-full space-y-3 md:space-y-4 overflow-hidden">
              <div className="text-center flex-shrink-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 md:mb-2">
                  Laden Sie Ihr Bild hoch
                </h1>
                <p className="text-xs md:text-sm lg:text-base text-slate-600">
                  Wählen Sie den gewünschten Ausschnitt ({isPortrait ? '600x800' : '800x600'} Pixel)
                </p>
              </div>

              {!selectedImage ? (
                <Card className="border-2 border-dashed flex-1 flex items-center justify-center">
                  <CardContent className="py-8 md:py-12">
                    <label className="flex flex-col items-center gap-3 md:gap-4 cursor-pointer">
                      <div className="h-16 w-16 md:h-24 md:w-24 rounded-2xl bg-slate-100 flex items-center justify-center">
                        <Upload className="h-8 w-8 md:h-12 md:w-12 text-slate-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-base md:text-lg font-semibold text-slate-900">
                          Klicken Sie zum Hochladen
                        </p>
                        <p className="text-xs md:text-sm text-slate-500 mt-1">
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
                    <CardContent className="pt-2 md:pt-4 h-full flex items-center justify-center overflow-hidden">
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
                            maxHeight: 'calc(100vh - 250px)',
                            width: 'auto',
                            touchAction: 'none'
                          }}
                        />
                      </ReactCrop>
                    </CardContent>
                  </Card>

                  <div className="flex gap-2 md:gap-3 flex-shrink-0 flex-wrap">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedImage(null)}
                      className="text-base md:text-sm px-5 py-3 md:py-2"
                    >
                      Neues Bild
                    </Button>
                    <Button
                      variant="outline"
                      onClick={rotateImage}
                      className="flex items-center gap-2 text-base md:text-sm px-5 py-3 md:py-2"
                    >
                      <RotateCw className="h-5 w-5 md:h-4 md:w-4" />
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
                      className="flex-1 min-w-[120px] bg-slate-900 hover:bg-slate-800 text-base md:text-sm px-5 py-3 md:py-2"
                    >
                      Weiter
                    </Button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col h-full space-y-4 md:space-y-6 overflow-hidden">
              <div className="text-center flex-shrink-0">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 md:mb-2">
                  Wählen Sie Ihre Rahmenfarbe
                </h1>
                <p className="text-xs md:text-sm lg:text-base text-slate-600">
                  Schwarz oder Weiß - Ihre Wahl
                </p>
              </div>

              <div className="flex-1 flex items-center justify-center overflow-hidden py-2 md:py-4">
                <div className="w-full max-w-5xl mx-auto px-2 md:px-4">
                  <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
                    {/* Rahmenbild auf allen Geräten */}
                    <div className="flex justify-center">
                      <img 
                        src={frameColorsImg} 
                        alt="Rahmenfarben Beispiel" 
                        className="w-full rounded-2xl shadow-xl"
                      />
                    </div>

                    {/* Rahmenfarben Auswahl */}
                    <div className="space-y-3">
                      <button
                        className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all ${
                          frameColor === 'black'
                            ? 'border-slate-900 bg-slate-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-md'
                        }`}
                        onClick={() => setFrameColor('black')}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <Frame className="h-6 w-6 md:h-8 md:w-8 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-base md:text-lg font-semibold text-slate-900">Schwarzer Rahmen</h3>
                            <p className="text-xs md:text-sm text-slate-600">Klassisch und elegant</p>
                          </div>
                          {frameColor === 'black' && (
                            <div className="bg-slate-900 rounded-full p-1.5 flex-shrink-0">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>

                      <button
                        className={`w-full p-4 md:p-5 rounded-xl border-2 transition-all ${
                          frameColor === 'white'
                            ? 'border-slate-900 bg-slate-50 shadow-lg'
                            : 'border-slate-200 bg-white hover:border-slate-400 hover:shadow-md'
                        }`}
                        onClick={() => setFrameColor('white')}
                      >
                        <div className="flex items-center gap-3 md:gap-4">
                          <div className="w-12 h-12 md:w-16 md:h-16 bg-white border-2 border-slate-300 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
                            <Frame className="h-6 w-6 md:h-8 md:w-8 text-slate-900" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-base md:text-lg font-semibold text-slate-900">Weißer Rahmen</h3>
                            <p className="text-xs md:text-sm text-slate-600">Modern und hell</p>
                          </div>
                          {frameColor === 'white' && (
                            <div className="bg-slate-900 rounded-full p-1.5 flex-shrink-0">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 md:gap-3 flex-shrink-0">
                <Button
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="px-5 md:px-6 text-base md:text-sm py-3 md:py-3"
                >
                  Zurück
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="flex-1 bg-slate-900 hover:bg-slate-800 py-3 md:py-3 text-base md:text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-5 w-5 md:h-4 md:w-4 mr-2 animate-spin" />
                      <span>Wird verarbeitet...</span>
                    </>
                  ) : (
                    <>
                      <span className="font-semibold">Zur Kasse</span>
                      <span className="mx-2">·</span>
                      <span>€29,90</span>
                    </>
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
