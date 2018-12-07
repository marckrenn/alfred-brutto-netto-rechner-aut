# alfred-brutto-netto-rechner-aut

> [Alfred 3](https://www.alfredapp.com) workflow to convert between gross and net income for Austria.

Uses the undocumented, public API from the [Bundesministerium für Finanzen](https://rechner.cpulohn.at/bmf.gv.at/familienbonusplus/#bruttoNetto_familienbonus) by [CPU Informatik GmbH](https://www.cpulohn.at/Wordpress/?page_id=844).<br>


## Install

```
$ npm install --global alfred-brutto-netto-rechner-aut
```

*Requires [Node.js](https://nodejs.org) 8+ and the Alfred [Powerpack](https://www.alfredapp.com/powerpack/).*


## Usage

In Alfred, type `netto` or `brutto`, followed by the income you want to convert.</br>
Optionally, append `jahr`, `jährlich`, `p.a.` to define a yearly income.</br>
Hold the shift-key to switch between the converted monthly / yearly value.</br>
Hit return to copy the selected value to the clipboard.



## Related

-  This Workflow was created with [alfy](https://github.com/sindresorhus/alfy) by [Sindre Sorhus](https://github.com/sindresorhus).
- [alfred-emoji](https://github.com/sindresorhus/alfred-emoj) - This repo's readme was blatantly used as a template.



## License

MIT © Marc Krenn
