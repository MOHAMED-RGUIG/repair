import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image";
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8">
              <div className="space-y-4">
 <Image
  src="/logo.jpg"
  alt="Logo"
  width={200}
  height={200}
  className="mx-auto"
  priority
/>
    </div>
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white">Gestion des Réparations</h1>
            <p className="text-xl text-slate-300">Suivi professionnel de vos interventions techniques</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/formulaire">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                Nouvelle Réparation
              </Button>
            </Link>
            <Link href="/performances">
              <Button
                size="lg"
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                Voir les Performances
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
