'use client'

import React, { memo } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { useAppSelectors } from '@/hooks/useAppSelectors'
import { useRenderPerformance } from '@/hooks/usePerformance'
import { Activity, Clock, TrendingUp, CheckCircle } from 'lucide-react'

const PerformanceStats = memo(function PerformanceStats() {
  const { appStats, todoStats } = useAppSelectors()
  const renderTime = useRenderPerformance('PerformanceStats')

  const stats = [
    {
      title: 'Tareas Totales',
      value: appStats.totalTodos,
      icon: Activity,
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      title: 'Completadas',
      value: appStats.completedTodos,
      icon: CheckCircle,
      color: 'text-green-600 dark:text-green-400'
    },
    {
      title: 'Tasa de Éxito',
      value: `${appStats.completionRate}%`,
      icon: TrendingUp,
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      title: 'Render Time',
      value: `${renderTime}ms`,
      icon: Clock,
      color: 'text-orange-600 dark:text-orange-400'
    }
  ]

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Estadísticas de Rendimiento
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
              >
                <IconComponent className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        
        {/* Información adicional */}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600 dark:text-gray-400">Notas:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {appStats.totalNotes}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Materias:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {appStats.totalSubjects}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Pendientes:</span>
              <span className="ml-2 font-medium text-gray-900 dark:text-white">
                {appStats.pendingTodos}
              </span>
            </div>
            <div>
              <span className="text-gray-600 dark:text-gray-400">Vencidas:</span>
              <span className="ml-2 font-medium text-red-600 dark:text-red-400">
                {appStats.overdueTodos}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

export default PerformanceStats