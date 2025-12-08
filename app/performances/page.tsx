"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import RepairsTable from "@/components/repairs-table"
import RepairsFilters from "@/components/repairs-filters"
import type { Repair } from "@/types/repair"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function PerformancesPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([])
  const [filters, setFilters] = useState({
    technician: "",
    customer: "",
    dateStart: "",
    dateEnd: "",
    machineNumber: "",
    machineName:"",
  })
const [currentPage, setCurrentPage] = useState(1)
const repairsPerPage = 15
const calculateTotalHours = (items: Repair[]) => {
  let totalMinutes = 0;

  items.forEach(r => {
    const [sh, sm] = r.startTime.split(":").map(Number);
    const [eh, em] = r.endTime.split(":").map(Number);

    const start = sh * 60 + sm;
    const end = eh * 60 + em;

    totalMinutes += (end - start);
  });

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}min`;
};
const countReturnsByMachine = (items: Repair[]) => {
  const result: Record<string, number> = {};

  items.forEach(r => {
    if (!result[r.machineNumber]) result[r.machineNumber] = 0;
    result[r.machineNumber]++;
  });

  return result;
};
const indexOfLast = currentPage * repairsPerPage;
const indexOfFirst = indexOfLast - repairsPerPage;
const currentRepairs = filteredRepairs.slice(indexOfFirst, indexOfLast);

const totalPages = Math.ceil(filteredRepairs.length / repairsPerPage);

 useEffect(() => {
  fetch("https://repair-api-4.onrender.com/api/repairs")
    .then(res => res.json())
    .then(data => {
      setRepairs(data);
      setFilteredRepairs(data);
    });
}, []);

  const loadDefaultRepairs = async () => {
    try {
      const response = await fetch("/repairs-data.json")
      const data = await response.json()
      setRepairs(data.repairs)
      setFilteredRepairs(data.repairs)
    } catch (error) {
      console.error("Erreur chargement fichier JSON:", error)
    }
  }

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)

    let filtered = repairs

    if (newFilters.technician) {
      filtered = filtered.filter((r) => r.technicianName.toLowerCase().includes(newFilters.technician.toLowerCase()))
    }

    if (newFilters.customer) {
      filtered = filtered.filter((r) => r.customerName.toLowerCase().includes(newFilters.customer.toLowerCase()))
    }

    if (newFilters.dateStart) {
      filtered = filtered.filter((r) => r.date >= newFilters.dateStart)
    }

    if (newFilters.dateEnd) {
      filtered = filtered.filter((r) => r.date <= newFilters.dateEnd)
    }

    if (newFilters.machineNumber) {
      filtered = filtered.filter((r) => r.machineNumber.toLowerCase().includes(newFilters.machineNumber.toLowerCase()))
    }
    if (newFilters.machineName) {
      filtered = filtered.filter((r) => r.machineName.toLowerCase().includes(newFilters.machineName.toLowerCase()))
    }


    setFilteredRepairs(filtered)
  }

  const exportToCSV = () => {
    const data = filteredRepairs.map((r) => ({
      Date: r.date,
      Technicien: r.technicianName,
      Client: r.customerName,
      "N° Machine": r.machineNumber,
      "Nom machine": r.machineName,
      "Pièces Changées": Array.isArray(r.partsChanged) ? r.partsChanged.join("; ") : "",
      Remarques: r.remarks,
      "Heure Début": r.startTime,
      "Heure Fin": r.endTime,
      "Pièces Nécessaires": Array.isArray(r.partsTaken) ? r.partsTaken.join("; ") : "",
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Réparations")
// --- AJOUT FEUILLE RESUME ---
const totalHours = calculateTotalHours(filteredRepairs);

const techCount = Array.from(
  new Set(
    filteredRepairs
      .map(r => r.technicianName?.trim().toLowerCase())
      .filter(name => name && name.length > 0)
  )
).length;

const returnsCount = filteredRepairs.reduce((acc, r) => {
  acc[r.machineNumber] = (acc[r.machineNumber] || 0) + 1;
  return acc;
}, {} as Record<string, number>);

// Données du résumé
const resumeData = [
  { Label: "Total heures réparations", Valeur: totalHours },
  { Label: "Techniciens impliqués", Valeur: techCount },
  { Label: "", Valeur: "" }, // espace
]

const wsResume = XLSX.utils.json_to_sheet(resumeData)
XLSX.utils.book_append_sheet(wb, wsResume, "Résumé")
// --- FIN AJOUT ---

    // Générer le fichier en tant que Blob et créer un lien de téléchargement
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reparations_${new Date().toISOString().split("T")[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

const exportToPDF = async () => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()

  // 1) Total heures
  const totalHours = calculateTotalHours(filteredRepairs)

  // 2) Techniciens impliqués
  const techCount = Array.from(
    new Set(
      filteredRepairs
        .map(r => r.technicianName?.trim().toLowerCase())
        .filter(name => name && name.length > 0)
    )
  ).length

  // 3) Retours par machine
  const returnsCount = filteredRepairs.reduce((acc, r) => {
    acc[r.machineNumber] = (acc[r.machineNumber] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // --- HEADER ---
  doc.setFontSize(16)
  doc.text("Rapport de Réparations", pageWidth / 2, 15, { align: "center" })

  doc.setFontSize(10)
  doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, pageWidth / 2, 22, { align: "center" })

  // --- TABLEAU ---
  const tableData = filteredRepairs.map((r) => [
    r.date,
    r.technicianName,
    r.customerName,
    r.machineNumber,
    r.machineName,
    r.remarks,
    `${r.startTime} - ${r.endTime}`,
  ])

  autoTable(doc, {
    head: [["Date", "Technicien", "Client", "N° Machine", "NomMachine", "Remarques", "Horaires"]],
    body: tableData,
    startY: 30,
    theme: "grid",
    styles: { fontSize: 8 },
  })

  // --- PAGE RESUME ---
  doc.addPage()

  doc.setFontSize(14)
  doc.text("Résumé des Réparations", pageWidth / 2, 15, { align: "center" })

  doc.setFontSize(11)
  doc.text(`Total heures réparations : ${totalHours}`, 14, 35)
  doc.text(`Techniciens impliqués : ${techCount}`, 14, 45)

  doc.setFontSize(12)


  doc.save(`reparations_${new Date().toISOString().split("T")[0]}.pdf`)
}



  const returnsCount = filteredRepairs.reduce((acc, repair) => {
  acc[repair.machineNumber] =  1;
  return acc;
}, {} as Record<string, number>);


  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              ← Retour
            </Button>
          </Link>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Performances</h1>
              <p className="text-slate-400">Liste de toutes les réparations effectuées ({filteredRepairs.length})</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white">
                📊 Excel
              </Button>
              <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
                📄 PDF
              </Button>
            </div>
          </div>

          <RepairsFilters filters={filters} onFiltersChange={applyFilters} />
         <RepairsTable 
   repairs={currentRepairs}
   returnsCount={countReturnsByMachine(filteredRepairs)}

/>
<div className="mt-6 bg-slate-700 p-4 rounded-lg border border-slate-600">
  <h2 className="text-lg text-white font-semibold mb-2">Résumé</h2>

  <p className="text-slate-300">
    ⏱️ Total heures réparations : 
    <span className="font-bold text-white"> {calculateTotalHours(filteredRepairs)}</span>
  </p>

  <p className="text-slate-300 mt-1">
    👥 Techniciens impliqués : 
    <span className="text-white font-bold">
    {Array.from(
  new Set(
    filteredRepairs
      .map(r => r.technicianName?.trim().toLowerCase())
      .filter(name => name && name.length > 0) // enlever vides
  )
).length}
    </span>
  </p>
</div>
<div className="flex justify-center items-center gap-4 mt-6">
  <Button 
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(prev => prev - 1)}
    className="bg-slate-600 text-white"
  >
    ← Précédent
  </Button>

  <span className="text-slate-300">
    Page {currentPage} / {totalPages}
  </span>

  <Button 
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(prev => prev + 1)}
    className="bg-slate-600 text-white"
  >
    Suivant →
  </Button>
</div>

        </div>
      </div>
    </main>
  )
}



/*"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import RepairsTable from "@/components/repairs-table"
import RepairsFilters from "@/components/repairs-filters"
import type { Repair } from "@/types/repair"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"

export default function PerformancesPage() {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [filteredRepairs, setFilteredRepairs] = useState<Repair[]>([])
  const [filters, setFilters] = useState({
    technician: "",
    customer: "",
    dateStart: "",
    dateEnd: "",
    machineNumber: "",
    machineName:"",
  })

 useEffect(() => {
  fetch("https://repair-api-4.onrender.com/api/repairs")
    .then(res => res.json())
    .then(data => {
      setRepairs(data);
      setFilteredRepairs(data);
    });
}, []);

  const loadDefaultRepairs = async () => {
    try {
      const response = await fetch("/repairs-data.json")
      const data = await response.json()
      setRepairs(data.repairs)
      setFilteredRepairs(data.repairs)
    } catch (error) {
      console.error("Erreur chargement fichier JSON:", error)
    }
  }

  const applyFilters = (newFilters: typeof filters) => {
    setFilters(newFilters)

    let filtered = repairs

    if (newFilters.technician) {
      filtered = filtered.filter((r) => r.technicianName.toLowerCase().includes(newFilters.technician.toLowerCase()))
    }

    if (newFilters.customer) {
      filtered = filtered.filter((r) => r.customerName.toLowerCase().includes(newFilters.customer.toLowerCase()))
    }

    if (newFilters.dateStart) {
      filtered = filtered.filter((r) => r.date >= newFilters.dateStart)
    }

    if (newFilters.dateEnd) {
      filtered = filtered.filter((r) => r.date <= newFilters.dateEnd)
    }

    if (newFilters.machineNumber) {
      filtered = filtered.filter((r) => r.machineNumber.toLowerCase().includes(newFilters.machineNumber.toLowerCase()))
    }
    if (newFilters.machineName) {
      filtered = filtered.filter((r) => r.machineName.toLowerCase().includes(newFilters.machineName.toLowerCase()))
    }


    setFilteredRepairs(filtered)
  }

  const exportToCSV = () => {
    const data = filteredRepairs.map((r) => ({
      Date: r.date,
      Technicien: r.technicianName,
      Client: r.customerName,
      "N° Machine": r.machineNumber,
      "Nom machine": r.machineName,
      "Pièces Changées": Array.isArray(r.partsChanged) ? r.partsChanged.join("; ") : "",
      Remarques: r.remarks,
      "Heure Début": r.startTime,
      "Heure Fin": r.endTime,
      "Pièces Nécessaires": Array.isArray(r.partsTaken) ? r.partsTaken.join("; ") : "",
    }))

    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Réparations")

    // Générer le fichier en tant que Blob et créer un lien de téléchargement
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" })
    const blob = new Blob([wbout], { type: "application/octet-stream" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `reparations_${new Date().toISOString().split("T")[0]}.xlsx`
    a.click()
    URL.revokeObjectURL(url)
  }

  const exportToPDF = async () => {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()

    // Titre
    doc.setFontSize(16)
    doc.text("Rapport de Réparations", pageWidth / 2, 15, { align: "center" })

    // Date de génération
    doc.setFontSize(10)
    doc.text(`Généré le: ${new Date().toLocaleDateString("fr-FR")}`, pageWidth / 2, 22, { align: "center" })

    // Tableau
    const tableData = filteredRepairs.map((r) => [
      r.date,
      r.technicianName,
      r.customerName,
      r.machineNumber,
      r.machineName,
      r.remarks,
      `${r.startTime} - ${r.endTime}`,
    ])

    autoTable(doc, {
      head: [["Date", "Technicien", "Client", "N° Machine", "NomMachine", "Remarques", "Horaires"]],
      body: tableData,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 22 },
        2: { cellWidth: 22 },
        3: { cellWidth: 20 },
        4: { cellWidth: 25 },
        5: { cellWidth: 25 },
        6: { cellWidth: 20 },
      },
    })

    doc.save(`reparations_${new Date().toISOString().split("T")[0]}.pdf`)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-slate-300 hover:text-white">
              ← Retour
            </Button>
          </Link>
        </div>

        <div className="bg-slate-800 rounded-lg border border-slate-700 p-8 shadow-2xl">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Performances</h1>
              <p className="text-slate-400">Liste de toutes les réparations effectuées ({filteredRepairs.length})</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={exportToCSV} className="bg-green-600 hover:bg-green-700 text-white">
                📊 Excel
              </Button>
              <Button onClick={exportToPDF} className="bg-red-600 hover:bg-red-700 text-white">
                📄 PDF
              </Button>
            </div>
          </div>

          <RepairsFilters filters={filters} onFiltersChange={applyFilters} />
          <RepairsTable repairs={filteredRepairs} />
        </div>
      </div>
    </main>
  )
}*/
