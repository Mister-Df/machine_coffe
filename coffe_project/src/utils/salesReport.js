const BOISSONS = ['TEA', 'COFFEE', 'CHOCOLATE', 'JUS D’ORANGE']

function normaliserBoisson(boisson) {
  return boisson === 'ORANGE JUICE' ? 'JUS D’ORANGE' : boisson
}

export function getLocalDateKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function buildSalesReport(sales) {
  const unitsByDrink = Object.fromEntries(BOISSONS.map((boisson) => [boisson, 0]))
  const salesByDay = new Map()

  for (const sale of sales) {
    const boisson = normaliserBoisson(sale.boisson)
    if (!Object.hasOwn(unitsByDrink, boisson)) {
      throw new Error(`Unknown drink in sales record: ${sale.boisson}`)
    }
    if (!Number.isInteger(sale.prixCentimes) || sale.prixCentimes < 0) {
      throw new Error(`Invalid sale price for: ${sale.boisson}`)
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(sale.dateVente)) {
      throw new Error(`Invalid sale date for: ${sale.boisson}`)
    }

    unitsByDrink[boisson] += 1
    const dailySales = salesByDay.get(sale.dateVente) ?? {
      units: 0,
      revenueCents: 0,
    }
    dailySales.units += 1
    dailySales.revenueCents += sale.prixCentimes
    salesByDay.set(sale.dateVente, dailySales)
  }

  const days = [...salesByDay.entries()]
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, totals]) => ({ date, ...totals }))
  const totalUnits = Object.values(unitsByDrink).reduce((total, units) => total + units, 0)
  const totalRevenueCents = days.reduce((total, day) => total + day.revenueCents, 0)

  return { unitsByDrink, days, totalUnits, totalRevenueCents }
}
