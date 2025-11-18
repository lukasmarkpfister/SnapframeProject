import { Frame, Facebook, Instagram, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white border-t">
      <div className="w-full px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Frame className="h-6 w-6 text-slate-900" />
              <span className="font-semibold text-lg">LightPicture</span>
            </div>
            <p className="text-sm text-slate-600">
              Kunst, die zum Leben erwacht mit natürlichem Licht
            </p>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Rechtliches</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/impressum" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Impressum
                </Link>
              </li>
              <li>
                <Link to="/datenschutz" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Datenschutz
                </Link>
              </li>
              <li>
                <Link to="/agb" className="text-slate-600 hover:text-slate-900 transition-colors">
                  AGB
                </Link>
              </li>
              <li>
                <Link to="/widerruf" className="text-slate-600 hover:text-slate-900 transition-colors">
                  Widerrufsrecht
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Kontakt</h3>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a href="mailto:versandhandellukaspfister@gmail.com" className="hover:text-slate-900 transition-colors">
                  versandhandellukaspfister@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-4">Folgen Sie uns</h3>
            <div className="flex gap-4">
              <a
                href="https://facebook.com/lightpicture3d"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com/lightpicture3d"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com/lightpicture3d"
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 w-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 hover:text-slate-900 transition-all"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 text-center">
          <p className="text-sm text-slate-600">
            &copy; {new Date().getFullYear()} LightPicture. Alle Rechte vorbehalten.
          </p>
          <p className="text-xs text-slate-500 mt-2">
            lightpicture-3d.de
          </p>
        </div>
      </div>
    </footer>
  );
}
