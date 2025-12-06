"use client"

import type { Repair } from "@/types/repair"

interface RepairsTableProps {
  repairs: Repair[],
  returnsCount: Record<string, number>
}


export default function RepairsTable({ repairs,returnsCount }: RepairsTableProps) {
  if (repairs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Aucune réparation trouvée</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Technicien</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Client</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">N° Machine</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Nom Machine</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Remarque</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Horaires</th>
          <th className="px-4 py-3 text-left font-semibold text-slate-200">Retours</th>

          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
              <td className="px-4 py-3 text-slate-300">{repair.date}</td>
              <td className="px-4 py-3 text-slate-300">{repair.technicianName}</td>
              <td className="px-4 py-3 text-slate-300">{repair.customerName}</td>
              <td className="px-4 py-3 text-slate-300">{repair.machineNumber}</td>
              <td className="px-4 py-3 text-slate-300">{repair.machineName}</td>
             
              <td className="px-4 py-3 text-slate-300">{repair.remarks}</td>
              <td className="px-4 py-3 text-slate-300">
                {repair.startTime} - {repair.endTime}
              </td>
              <td className="px-4 py-3 text-slate-300">
                {returnsCount[repair.machineNumber] && 0}
            </td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/*
"use client"

import type { Repair } from "@/types/repair"

interface RepairsTableProps {
  repairs: Repair[]
}

export default function RepairsTable({ repairs }: RepairsTableProps) {
  if (repairs.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Aucune réparation trouvée</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-600">
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Date</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Technicien</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Client</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">N° Machine</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Nom Machine</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Remarque</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-200">Horaires</th>
          </tr>
        </thead>
        <tbody>
          {repairs.map((repair) => (
            <tr key={repair.id} className="border-b border-slate-700 hover:bg-slate-700/50 transition">
              <td className="px-4 py-3 text-slate-300">{repair.date}</td>
              <td className="px-4 py-3 text-slate-300">{repair.technicianName}</td>
              <td className="px-4 py-3 text-slate-300">{repair.customerName}</td>
              <td className="px-4 py-3 text-slate-300">{repair.machineNumber}</td>
              <td className="px-4 py-3 text-slate-300">{repair.machineName}</td>
          
              <td className="px-4 py-3 text-slate-300">{repair.remarks}</td>
              <td className="px-4 py-3 text-slate-300">
                {repair.startTime} - {repair.endTime}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
*/
    {/*
              <td className="px-4 py-3 text-slate-300">
                <div className="flex flex-wrap gap-1">
                  {repair.partsChanged.length > 0 ? (
                    repair.partsChanged.map((part, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded text-xs">
                        {part}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500">-</span>
                  )}
                </div>
              </td>*/}
