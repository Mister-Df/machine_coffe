import assert from 'node:assert/strict'
import test from 'node:test'
import { buildSalesReport } from './salesReport.js'

test('reports zero sales when there are no accepted orders', () => {
  assert.deepEqual(buildSalesReport([]), {
    unitsByDrink: {
      TEA: 0,
      COFFEE: 0,
      CHOCOLATE: 0,
      'JUS D’ORANGE': 0,
    },
    days: [],
    totalUnits: 0,
    totalRevenueCents: 0,
  })
})

test('aggregates drinks by date and counts only the drink price as revenue', () => {
  const sales = [
    {
      boisson: 'TEA',
      prixCentimes: 40,
      montantVerseCentimes: 100,
      dateVente: '2026-11-12',
    },
    {
      boisson: 'TEA',
      prixCentimes: 40,
      montantVerseCentimes: 40,
      dateVente: '2026-11-12',
    },
    {
      boisson: 'JUS D’ORANGE',
      prixCentimes: 60,
      montantVerseCentimes: 100,
      dateVente: '2026-11-13',
    },
  ]

  assert.deepEqual(buildSalesReport(sales), {
    unitsByDrink: {
      TEA: 2,
      COFFEE: 0,
      CHOCOLATE: 0,
      'JUS D’ORANGE': 1,
    },
    days: [
      { date: '2026-11-12', units: 2, revenueCents: 80 },
      { date: '2026-11-13', units: 1, revenueCents: 60 },
    ],
    totalUnits: 3,
    totalRevenueCents: 140,
  })
})
