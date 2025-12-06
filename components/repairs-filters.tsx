"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RepairsFiltersProps {
  filters: {
    technician: string
    customer: string
    dateStart: string
    dateEnd: string
    machineNumber: string
  }
  onFiltersChange: (filters: any) => void
}

export default function RepairsFilters({ filters, onFiltersChange }: RepairsFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      technician: "",
      customer: "",
      dateStart: "",
      dateEnd: "",
      machineNumber: "",
    })
  }

  return (
    <div className="bg-slate-700 p-6 rounded-lg border border-slate-600 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Filtres</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Technicien</label>
          <Input
            type="text"
            placeholder="Chercher..."
            value={filters.technician}
            onChange={(e) => onFiltersChange({ ...filters, technician: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Client</label>
          <Input
            type="text"
            placeholder="Chercher..."
            value={filters.customer}
            onChange={(e) => onFiltersChange({ ...filters, customer: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Date Début</label>
          <Input
            type="date"
            value={filters.dateStart}
            onChange={(e) => onFiltersChange({ ...filters, dateStart: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Date Fin</label>
          <Input
            type="date"
            value={filters.dateEnd}
            onChange={(e) => onFiltersChange({ ...filters, dateEnd: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">N° Machine</label>
          <Input
            type="text"
            placeholder="Chercher..."
            value={filters.machineNumber}
            onChange={(e) => onFiltersChange({ ...filters, machineNumber: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <Button
        onClick={handleReset}
        variant="outline"
        size="sm"
        className="border-slate-500 text-slate-300 hover:bg-slate-600 bg-transparent"
      >
        Réinitialiser filtres
      </Button>
    </div>
  )
}



/*"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface RepairsFiltersProps {
  filters: {
    technician: string
    customer: string
    dateStart: string
    dateEnd: string
    machineNumber: string
  }
  onFiltersChange: (filters: any) => void
}

export default function RepairsFilters({ filters, onFiltersChange }: RepairsFiltersProps) {
  const handleReset = () => {
    onFiltersChange({
      technician: "",
      customer: "",
      dateStart: "",
      dateEnd: "",
      machineNumber: "",
    })
  }

  return (
    <div className="bg-slate-700 p-6 rounded-lg border border-slate-600 mb-6">
      <h2 className="text-lg font-semibold text-white mb-4">Filtres</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Technicien</label>
          <Input
            type="text"
            placeholder="Chercher..."
            value={filters.technician}
            onChange={(e) => onFiltersChange({ ...filters, technician: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Client</label>
          <Input
            type="text"
            placeholder="Chercher..."
            value={filters.customer}
            onChange={(e) => onFiltersChange({ ...filters, customer: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Date Début</label>
          <Input
            type="date"
            value={filters.dateStart}
            onChange={(e) => onFiltersChange({ ...filters, dateStart: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">Date Fin</label>
          <Input
            type="date"
            value={filters.dateEnd}
            onChange={(e) => onFiltersChange({ ...filters, dateEnd: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-2">N° Machine</label>
          <Input
            type="text"
            placeholder="Chercher..."
            value={filters.machineNumber}
            onChange={(e) => onFiltersChange({ ...filters, machineNumber: e.target.value })}
            className="bg-slate-600 border-slate-500 text-white placeholder-slate-400"
          />
        </div>
      </div>

      <Button
        onClick={handleReset}
        variant="outline"
        size="sm"
        className="border-slate-500 text-slate-300 hover:bg-slate-600 bg-transparent"
      >
        Réinitialiser filtres
      </Button>
    </div>
  )
}*/
