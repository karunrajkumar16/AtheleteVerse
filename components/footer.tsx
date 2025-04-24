import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-gray-900 text-white">
      <div className="container flex flex-col gap-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">AthleteVerse</h3>
            <p className="text-sm text-gray-400">
              Connecting local athletes to play sports and build communities.
            </p>
            
            <div className="flex gap-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-sm text-gray-400 hover:text-white">
                Home
              </Link>
              <Link href="/events" className="text-sm text-gray-400 hover:text-white">
                Events
              </Link>
              <Link href="/players" className="text-sm text-gray-400 hover:text-white">
                Players
              </Link>
              <Link href="/esports" className="text-sm text-gray-400 hover:text-white">
                eSports
              </Link>
              <Link href="/profile" className="text-sm text-gray-400 hover:text-white">
                Profile
              </Link>
            </nav>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold">Resources</h3>
            <nav className="flex flex-col gap-2">
              <Link href="/about" className="text-sm text-gray-400 hover:text-white">
                About Us
              </Link>
              <Link href="/contact" className="text-sm text-gray-400 hover:text-white">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-t border-gray-700 pt-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} AthleteVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

