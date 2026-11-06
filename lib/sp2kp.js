// Hook for the SP2KP (Kemendag) food-price scraper.
//
// The cron route (app/api/cron/prices) calls fetchDailyPrices() once a day and
// stores the result with db.savePricePoint(). Plug your existing scraper in
// here. Until then the forecast endpoints use the simulated series.

/**
 * @returns {Promise<Array<{city:string, commodityId:string, date:string, price:number}>>}
 *   commodityId must be one of COMMODITIES[].id in lib/forecast.js
 */
export async function fetchDailyPrices() {
  return []; // TODO: call your scraper / stored dataset
}
