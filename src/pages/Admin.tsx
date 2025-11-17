import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Frame, Download, Package, Truck, CheckCircle2, Clock, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface Order {
  id: string;
  image_url: string;
  frame_color: string;
  status: string;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  stripe_session_id: string | null;
}

export default function Admin() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [trackingNumbers, setTrackingNumbers] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simple password protection (in production use proper auth)
  const ADMIN_PASSWORD = 'LightPicture2025!'; // Change this!

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      loadOrders();
    } else {
      alert('Falsches Passwort');
    }
  };

  useEffect(() => {
    filterOrders();
  }, [orders, statusFilter, searchQuery]);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading orders:', error);
      alert('Fehler beim Laden: ' + error.message);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(query) ||
        order.tracking_number?.toLowerCase().includes(query) ||
        order.frame_color.toLowerCase().includes(query)
      );
    }

    setFilteredOrders(filtered);
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          orderId,
          status: newStatus
        })
      });

      if (!response.ok) {
        throw new Error('Update fehlgeschlagen');
      }

      loadOrders();
    } catch (error) {
      alert('Fehler beim Aktualisieren: ' + error);
      console.error(error);
    }
  };

  const updateTrackingNumber = async (orderId: string) => {
    const trackingNumber = trackingNumbers[orderId];
    if (!trackingNumber) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/update-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
        },
        body: JSON.stringify({
          orderId,
          trackingNumber,
          status: 'shipped'
        })
      });

      if (!response.ok) {
        throw new Error('Update fehlgeschlagen');
      }

      setTrackingNumbers({ ...trackingNumbers, [orderId]: '' });
      loadOrders();
    } catch (error) {
      alert('Fehler beim Aktualisieren: ' + error);
      console.error(error);
    }
  };

  const downloadImage = async (imageUrl: string, orderId: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `order-${orderId}.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      alert('Fehler beim Download: ' + error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-amber-500" />;
      case 'paid': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'processing': return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Ausstehend',
      paid: 'Bezahlt',
      processing: 'In Bearbeitung',
      shipped: 'Versendet',
      completed: 'Abgeschlossen',
    };
    return labels[status] || status;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2 mb-4">
              <Frame className="h-6 w-6 text-slate-900" />
              <span className="font-semibold text-lg">LightPicture Admin</span>
            </div>
            <CardTitle>Admin-Bereich</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Passwort"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
            <Button onClick={handleLogin} className="w-full bg-slate-900 hover:bg-slate-800">
              Anmelden
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Frame className="h-6 w-6 text-slate-900" />
            <span className="font-semibold text-lg">LightPicture Admin</span>
          </Link>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Abmelden
          </Button>
        </div>
      </header>

      <main className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Bestellungen</h1>
            <Button onClick={loadOrders} variant="outline">
              Aktualisieren
            </Button>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4 text-slate-600" />
                  <span className="text-sm font-medium">Filter:</span>
                </div>
                
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Status</SelectItem>
                    <SelectItem value="pending">Ausstehend</SelectItem>
                    <SelectItem value="paid">Bezahlt</SelectItem>
                    <SelectItem value="processing">In Bearbeitung</SelectItem>
                    <SelectItem value="shipped">Versendet</SelectItem>
                    <SelectItem value="completed">Abgeschlossen</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Suche nach ID, Tracking-Nr..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="max-w-xs"
                />

                <div className="ml-auto text-sm text-slate-600">
                  {filteredOrders.length} von {orders.length} Bestellungen
                </div>
              </div>
            </CardContent>
          </Card>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Lade Bestellungen...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-5 gap-6">
                      {/* Order Image */}
                      <div className="md:col-span-1">
                        <img
                          src={order.image_url}
                          alt="Bestellung"
                          className="w-full aspect-square object-cover rounded-lg"
                        />
                        <Button
                          onClick={() => downloadImage(order.image_url, order.id)}
                          variant="outline"
                          size="sm"
                          className="w-full mt-2"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>

                      {/* Order Details */}
                      <div className="md:col-span-2 space-y-2">
                        <p className="text-sm text-slate-500">Bestellung #{order.id.slice(0, 8)}</p>
                        <p className="font-semibold">
                          Rahmenfarbe: {order.frame_color === 'black' ? 'Schwarz' : 'Weiß'}
                        </p>
                        <p className="text-sm text-slate-600">
                          Erstellt: {new Date(order.created_at).toLocaleString('de-DE')}
                        </p>
                        {order.updated_at !== order.created_at && (
                          <p className="text-sm text-slate-600">
                            Aktualisiert: {new Date(order.updated_at).toLocaleString('de-DE')}
                          </p>
                        )}
                      </div>

                      {/* Status & Actions */}
                      <div className="md:col-span-2 space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Status</label>
                          <Select
                            value={order.status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(order.status)}
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Ausstehend</SelectItem>
                              <SelectItem value="paid">Bezahlt</SelectItem>
                              <SelectItem value="processing">In Bearbeitung</SelectItem>
                              <SelectItem value="shipped">Versendet</SelectItem>
                              <SelectItem value="completed">Abgeschlossen</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Sendungsnummer</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder={order.tracking_number || 'Tracking-Nummer'}
                              value={trackingNumbers[order.id] || ''}
                              onChange={(e) =>
                                setTrackingNumbers({
                                  ...trackingNumbers,
                                  [order.id]: e.target.value,
                                })
                              }
                            />
                            <Button
                              onClick={() => updateTrackingNumber(order.id)}
                              disabled={!trackingNumbers[order.id]}
                            >
                              Speichern
                            </Button>
                          </div>
                          {order.tracking_number && (
                            <p className="text-sm text-slate-600 mt-1">
                              Aktuell: {order.tracking_number}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredOrders.length === 0 && orders.length > 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600">Keine Bestellungen gefunden</p>
                  <Button 
                    onClick={() => { setStatusFilter('all'); setSearchQuery(''); }} 
                    variant="outline" 
                    className="mt-4"
                  >
                    Filter zurücksetzen
                  </Button>
                </div>
              )}

              {orders.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-600">Keine Bestellungen vorhanden</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
