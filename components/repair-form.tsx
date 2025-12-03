"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { Repair } from "@/types/repair"

export default function RepairForm() {
  const [formData, setFormData] = useState({
    technicianName: "",
    machineNumber: "",
    machineName : "",
    customerName: "",
    remarks: "",
    partsChanged: [""],
    partsNeeded: [""],
    startTime: "",
    endTime: "",
  })

  const [submitted, setSubmitted] = useState(false)

  const today = new Date().toISOString().split("T")[0]

  const calculateDuration = (start: string, end: string): string => {
    if (!start || !end) return ""

    const [startH, startM] = start.split(":").map(Number)
    const [endH, endM] = end.split(":").map(Number)

    const startMinutes = startH * 60 + startM
    const endMinutes = endH * 60 + endM
    const diffMinutes = endMinutes - startMinutes

    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60

    if (hours === 0) return `${minutes}m`
    if (minutes === 0) return `${hours}h`
    return `${hours}h ${minutes}m`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const repair: Repair = {
      id: Date.now().toString(),
      technicianName: formData.technicianName,
      machineNumber: formData.machineNumber,
      machineName : formData.machineName,
      customerName: formData.customerName,
      remarks: formData.remarks,
      partsChanged: formData.partsChanged.filter((p) => p.trim() !== ""),
      partsNeeded: formData.partsNeeded.filter((p) => p.trim() !== ""),
      startTime: formData.startTime,
      endTime: formData.endTime,
      date: today,
      duration: calculateDuration(formData.startTime, formData.endTime),
    }

 await fetch("http://localhost:5000/api/repairs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(repair),
  });

    // Incrémenter le compteur
    const count = Number.parseInt(localStorage.getItem("repairSubmissions") || "0")
    localStorage.setItem("repairSubmissions", (count + 1).toString())

    setSubmitted(true)
    setFormData({
      technicianName: "",
      machineNumber: "",
      machineName:"",
      customerName: "",
      remarks: "",
      partsChanged: [""],
      partsNeeded: [""],
      startTime: "",
      endTime: "",
    })

    setTimeout(() => setSubmitted(false), 3000)
  }

  const handlePartsChange = (index: number, value: string, field: "partsChanged" | "partsNeeded") => {
    const newParts = [...formData[field]]
    newParts[index] = value
    setFormData({ ...formData, [field]: newParts })
  }

  const addPartField = (field: "partsChanged" | "partsNeeded") => {
    setFormData({
      ...formData,
      [field]: [...formData[field], ""],
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Nom du Technicien *</label>
          <Input
            type="text"
            required
            value={formData.technicianName}
            onChange={(e) => setFormData({ ...formData, technicianName: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            placeholder="Jean Dupont"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">N° Machine à réparer *</label>
          <Input
            type="text"
            required
            value={formData.machineNumber}
            onChange={(e) => setFormData({ ...formData, machineNumber: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            placeholder="M-001"
          />
        </div>
           <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Nom de la Machine </label>
          <Input
            type="text"
            required
            value={formData.machineName}
            onChange={(e) => setFormData({ ...formData, machineName: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            placeholder="M-001"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Nom du Client *</label>
          <Input
            type="text"
            required
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Date (automatique)</label>
          <Input type="date"  value={today} disabled className="bg-slate-700 border-slate-600 text-slate-300" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">Remarques</label>
        <textarea
          value={formData.remarks}
          onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
          className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Détails supplémentaires..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">Pièces Changées</label>
        <div className="space-y-2">
          {formData.partsChanged.map((part, idx) => (
            <Input
              key={idx}
              type="text"
              value={part}
              onChange={(e) => handlePartsChange(idx, e.target.value, "partsChanged")}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              placeholder={`Pièce ${idx + 1}`}
            />
          ))}
        </div>
        <Button
          type="button"
          onClick={() => addPartField("partsChanged")}
          variant="outline"
          className="mt-2 text-slate-300 border-slate-600 hover:bg-slate-700"
          size="sm"
        >
          + Ajouter pièce
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-3">Pièces Nécessaires</label>
        <div className="space-y-2">
          {formData.partsNeeded.map((part, idx) => (
            <Input
              key={idx}
              type="text"
              value={part}
              onChange={(e) => handlePartsChange(idx, e.target.value, "partsNeeded")}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              placeholder={`Pièce ${idx + 1}`}
            />
          ))}
        </div>
        <Button
          type="button"
          onClick={() => addPartField("partsNeeded")}
          variant="outline"
          className="mt-2 text-slate-300 border-slate-600 hover:bg-slate-700"
          size="sm"
        >
          + Ajouter pièce
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Heure Début *</label>
          <Input
            type="time"
            required
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Heure Fin *</label>
          <Input
            type="time"
            required
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            className="bg-slate-700 border-slate-600 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-200 mb-2">Durée</label>
          <div className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-slate-300">
            {calculateDuration(formData.startTime, formData.endTime) || "-"}
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2">
        Enregistrer la Réparation
      </Button>

      {submitted && (
        <div className="p-4 bg-green-900/20 border border-green-600/30 rounded-lg">
          <p className="text-green-400 text-center">✓ Réparation enregistrée avec succès!</p>
        </div>
      )}
    </form>
  )
}
