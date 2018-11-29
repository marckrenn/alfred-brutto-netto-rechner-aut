
const alfy = require('alfy');

function formatMoney(string) {
  return string.toLocaleString("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  });
}

alfy.input = alfy.input.toLowerCase();

timespan = alfy.input.match(/(hr|p.a|pa)/) ? "1" : "0"; // 0 = monthly, 1 = yearly
mode = process.argv[3]; // either "nettobrutto" or "bruttonetto"

body = {
  bn_brutto: parseFloat(alfy.input.replace(/\D/g, "")),
  calc: `${mode}_familienbonus`,
  bn_zeitraumType: timespan,
  // bn_bundesland: "7",
  // bn_mvk: 1,
  // bn_jahr: "201807",
  // bn_svsymbol: "0",
  // bn_avab: 0,
  // bn_pendler: "0",
  // bn_pendlerkm: "0",
  // bn_pendlergross: 0,
  // bn_pendlereuro: "3",
  // bn_sachbezug: "",
  // bn_freibetrag: "",
  // fb_kif: 0,
  // fb_teilung: 0,
  // fb_kinderUnder18: "",
  // fb_kinderOver18: "",
}

// Undocumented, public API by CPU Informatik GmbH
alfy.fetch('https://cpurechner.azurewebsites.net/api/OldRequest', {
  body
}).then(data => {

  output = []

  // Net Month
  netMonth = {};
  netMonth.title = formatMoney(data.netto);
  netMonth.subtitle = `Netto / Monat`;
  netMonth.arg = formatMoney(data.netto);
  netMonth.icon = {
    path: "icons/net.png"
  }

  // Gross Month
  grossMonth = {};
  grossMonth.title = formatMoney(data.brutto);
  grossMonth.subtitle = `Brutto / Monat`;
  grossMonth.arg = data.brutto;
  grossMonth.icon = {
    path: "icons/gross.png"
  }

  // Net Year
  netYear = {};
  netYear.title = formatMoney(data.nettojahr);
  netYear.subtitle = `Netto / Jahr`;
  netYear.arg = data.nettojahr;
  netYear.icon = {
    path: "icons/net.png"
  }

  // Gross Year
  grossYear = {};
  grossYear.title = formatMoney(data.bruttojahr);
  grossYear.subtitle = `Brutto / Jahr`;
  grossYear.arg = data.bruttojahr;
  grossYear.icon = {
    path: "icons/gross.png"
  }

  // Vacation Pay
  vacationPay = {};
  vacationPay.title = formatMoney(data.nettosz1);
  vacationPay.subtitle = `Urlaubsgeld`;
  vacationPay.arg = data.nettosz1;
  vacationPay.icon = {
    path: "icons/vacationPay.png"
  }

  // Christmas Bonus
  christmasBonus = {};
  christmasBonus.title = formatMoney(data.nettosz2);
  christmasBonus.subtitle = `Weihnachtsremuneration`;
  christmasBonus.arg = data.nettosz2;
  christmasBonus.icon = {
    path: "icons/christmasBonus.png"
  }


  if (mode === "nettobrutto") {

    if (timespan === "0") { // Input: Net Month

      output.push(netYear, grossMonth, grossYear, vacationPay, christmasBonus);

    } else { // Input: Net Year

      output.push(netMonth, grossMonth, grossYear, vacationPay, christmasBonus);

    }

  } else {

    if (timespan === "0") { // Input: Gross Month

      output.push(netMonth, netYear, grossYear, vacationPay, christmasBonus);

    } else { // Input: Gross Year

      output.push(netMonth, netYear, grossMonth, vacationPay, christmasBonus);

    }

  }

  alfy.output(output);
});