"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import RepairForm from "@/components/repair-form"

export default function FormulairePage() {
  const [submissions, setSubmissions] = useState(0)

  useEffect(() => {
    // Charger le nombre de soumissions pour afficher un message de succès
    const saved = localStorage.getItem("repairSubmissions")
    if (saved) {
      setSubmissions(Number.parseInt(saved))
    }
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              ← Retour
            </Button>
          </Link>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold text-white mb-2">Nouvelle Réparation</h1>
          <p className="text-slate-400 mb-8">Complétez le formulaire ci-dessous pour enregistrer une intervention</p>

          <RepairForm />

          {submissions > 0 && (
            <div className="mt-6 p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
              <p className="text-green-400">✓ {submissions} réparation(s) enregistrée(s) avec succès</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
