export function Round5Minutes(time) {
   const coeff = 1000 * 60 * 5;
   const rounded = new Date(Math.round(time / coeff) * coeff);
   return rounded.getHours() * 100 + rounded.getMinutes();
}
