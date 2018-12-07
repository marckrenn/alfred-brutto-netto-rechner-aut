const alfy = require('alfy');

function formatMoney(string) {
  return string.toLocaleString("de-AT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2
  });
};

function formatArgument(string) {
  return parseFloat(string).toString().replace('.', ',')
};

alfy.input = alfy.input.toLowerCase().normalize();

isYear = alfy.input.match(/(jahr|jährlich|p.a|pa)/) ? 1 : 0; // 1 = yearly, 0 = monthly
mode = process.argv[3]; // either "nettobrutto" or "bruttonetto"


bundeslaender = ["tirol", "burgenland", "kärnten", "niederösterreich", "oberösterreich", "salzburg", "steiermark", "wien", "vorarlberg", ""]

body = {
  bn_brutto: alfy.input.replace(/[^0-9€.,]/g, '').replace(",", "."),
  calc: `${mode}_familienbonus`,
  bn_zeitraumType: isYear,

  // Following parameters are configurable in the workflow-settings top right corner [x]
  bn_bundesland: bundeslaender.indexOf(process.env.bn_bundesland.toLowerCase()),
  bn_mvk: process.env.bn_mvk,
  bn_jahr: process.env.bn_jahr,
  bn_svsymbol: process.env.bn_svsymbol,
  bn_avab: process.env.bn_avab,
  bn_pendler: process.env.bn_pendler,
  bn_pendlerkm: process.env.bn_pendlerkm,
  bn_pendlergross: process.env.bn_pendlergross,
  bn_pendlereuro: process.env.bn_pendlereuro,
  bn_sachbezug: process.env.bn_sachbezug,
  bn_freibetrag: process.env.bn_freibetrag,
  fb_kif: process.env.fb_kif,
  fb_teilung: process.env.fb_teilung,
  fb_kinderUnder18: process.env.fb_kinderUnder18,
  fb_kinderOver18: process.env.fb_kinderOver18
}

// Undocumented, public API by CPU Informatik GmbH
alfy.fetch('https://cpurechner.azurewebsites.net/api/OldRequest', {
  body,
  maxAge: 31536000000
}).then(data => {

  output = []

  // Net Month
  netMonth = {
    title: `netto ${formatMoney(data.netto)} / Monat`,
    arg: formatArgument(data.netto),
    variables: {
      raw: formatArgument(data.netto),
      formatted: formatMoney(data.netto)
    },
    icon: {
      path: "icons/net.png"
    }
  };

  // Net Year
  netYear = {
    title: `netto ${formatMoney(data.nettojahr)} / Jahr`,
    arg: formatArgument(data.nettojahr),
    variables: {
      raw: formatArgument(data.nettojahr),
      formatted: `netto ${formatMoney(data.nettojahr)} / Jahr`
    },
    icon: {
      path: "icons/net.png"
    }
  };

  // Net Both
  netBoth = {
    title: `netto ${formatMoney(data.netto)} / Monat`,
    arg: formatArgument(data.netto),
    variables: {
      raw: formatArgument(data.netto),
      formatted: `netto ${formatMoney(data.netto)} / Monat`
    },
    icon: {
      path: "icons/net.png"
    },
    mods: {
      shift: {
        subtitle: `${formatMoney(data.nettojahr)} / Jahr`,
        arg: formatArgument(data.nettojahr),
        variables: {
          raw: formatArgument(data.nettojahr),
          formatted: `${formatMoney(data.nettojahr)} / Jahr`
        },
      }
    }
  };

  // Gross Month
  grossMonth = {
    title: `brutto ${formatMoney(data.brutto)} / Monat`,
    arg: formatArgument(data.brutto),
    variables: {
      raw: formatArgument(data.brutto),
      formatted: `brutto ${formatMoney(data.brutto)} / Monat`
    },
    icon: {
      path: "icons/gross.png"
    }
  };

  // Gross Year
  grossYear = {
    title: `brutto ${formatMoney(data.bruttojahr)} / Jahr`,
    arg: formatArgument(data.bruttojahr),
    variables: {
      raw: formatArgument(data.bruttojahr),
      formatted: `brutto ${formatMoney(data.bruttojahr)} / Jahr`
    },
    icon: {
      path: "icons/gross.png"
    }
  };

  // Gross Both
  grossBoth = {
    title: `brutto ${formatMoney(data.brutto)} / Monat`,
    arg: formatArgument(data.brutto),
    variables: {
      raw: formatArgument(data.brutto),
      formatted: `brutto ${formatMoney(data.brutto)} / Monat`
    },
    icon: {
      path: "icons/gross.png"
    },
    mods: {
      shift: {
        subtitle: `brutto ${formatMoney(data.bruttojahr)} / Jahr`,
        arg: formatArgument(data.bruttojahr),
        variables: {
          raw: formatArgument(data.bruttojahr),
          formatted: `brutto ${formatMoney(data.bruttojahr)} / Jahr`
        },
      }
    }
  };

  // Bonus Both
  bonusBoth = {
    title: `UG: ${formatMoney(data.nettosz1)}`,
    arg: formatArgument(data.nettosz1),
    variables: {
      raw: formatArgument(data.nettosz1),
      formatted: `UG: ${formatMoney(data.nettosz1)}`
    },
    icon: {
      path: "icons/vacationPay.png"
    },
    mods: {
      shift: {
        subtitle: `WR: ${formatMoney(data.nettosz2)}`,
        arg: formatArgument(data.nettosz2),
        variables: {
          raw: formatArgument(data.nettosz2),
          formatted: `WR: ${formatMoney(data.nettosz2)}`
        },
        icon: {
          path: "icons/christmasBonus.png"
        },
      }
    }
  };

  if (mode === "nettobrutto") {

    if (isYear === 0) { // Input: Net Month

      output.push(netYear, grossBoth, bonusBoth);

    } else { // Input: Net Year

      output.push(netMonth, grossBoth, bonusBoth);

    }

  } else {

    if (isYear === 0) { // Input: Gross Month

      output.push(grossYear, netBoth, bonusBoth);

    } else { // Input: Gross Year

      output.push(grossMonth, netBoth, bonusBoth);

    }

  }

  alfy.output(output);
});
