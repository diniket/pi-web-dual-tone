# Verifica Dual Tone — 2026-11-24 (tema v1.0.0)

## Oggetto

Nuovo tema indipendente **Dual Tone** per Pi Web, derivato dal branch
`preview/chat-hierarchy` (commit `35f3577`) del progetto Dark Contrast. Il pacchetto
Dark Contrast pubblicato non è stato modificato.

Identità verificata: npm `pi-web-dual-tone`, plugin `dual-tone`, tema `dual-tone`,
versione `1.0.0`, Pi Web `1.202611.2` (commit `07b7665`).

## Metodo

- Suite statica `npm test` (manifest, palette, selettori, contrasto, baseline, foglio generato).
- Harness di anteprima **isolato**: directory dati temporanea, plugin montato come
  `data/plugins/dual-tone`, nessuna sessione o configurazione dell'istanza operativa.
- Browser reale headless (Chromium, CDP con `Emulation.setDeviceMetricsOverride`) per la
  matrice di viewport e per gli screenshot comparativi.
- Istanza reale su un PC desktop della rete locale: Firefox con profilo temporaneo,
  tunnel SSH verso `127.0.0.1:18617`, verifica e interazione con **Computer Use**;
  screenshot di finestra con `grim`, non pubblicati.
- Coesistenza: nello stesso gateway isolato sono montati `dual-tone` e `dark-contrast`;
  interrogati `/api/themes`, `/api/theme` e i due fogli CSS.

## Esito sintetico

| Verifica | Esito |
|---|---|
| Suite statica `npm test` | **41/41** |
| Matrice browser (5 viewport) | **32/32** per viewport; 1 esclusione dichiarata sui telefoni |
| OpenSpec: elementi confrontati | **37**, stili calcolati invariati |
| OpenSpec: token `--pi-*` ereditati | **58**, invariati |
| Tool card reali nel fixture | **2** (successo + errore, colori distinti) |
| Coesistenza Dark Contrast + Dual Tone | **sì**, ID e fogli separati |
| Selezione tema su Firefox reale | **sì**, andata e ritorno senza reload |
| Token incrociati tra i due fogli | **0** |
| Baseline ufficiale | SHA-256 `88b39cf2…7692`, 52 token |

## Matrice browser

Viewport richieste e misurate (CSS px), fixture sintetica, tema forzato `dual-tone:dual-tone`:

| Viewport | Controlli | Esito | Esclusioni |
|---|---|---|---|
| 1792×1080 | 32 | 32/32 | — |
| 1381×900 | 32 | 32/32 | — |
| 1024×768 | 32 | 32/32 | — |
| 390×844 | 32 | 32/32 | tipografia etichetta progetti (verificata a desktop) |
| 320×700 | 32 | 32/32 | idem |

Controlli principali: superfici progetto/sessione `rgb(20,30,43)` / `rgb(19,34,31)`,
selezione progetto `rgb(32,61,92)`, selezione sessione `rgb(32,55,47)`, messaggio utente
`rgb(23,46,71)`, messaggio agente `rgb(20,37,34)`, eventi compatti (12px, 26px,
sfondo trasparente), intestazione evento espansa leggibile, apertura/chiusura nativa,
popup azioni sessione, composer modificabile, focus visibile, placeholder, azione
predefinita, scroll contenuto, nessun overflow orizzontale.

Dati completi: [`matrix.json`](matrix.json).

## Isolamento OpenSpec

Con il tema applicato, il pannello OpenSpec reale (pacchetto esterno, non copiato) è
stato confrontato in memoria con la sola palette ufficiale PI WEB Dark:

- 37 elementi: colore, sfondo, bordi, font-size, family, weight, line-height **identici**;
- 58 dichiarazioni `--pi-*` lette dal pannello **identiche**;
- nessuna regola del tema tocca `.panel-content`, wrapper di etichetta o contenuto plugin;
- la superficie visibile del pannello resta quella ufficiale.

## Coesistenza

Nello stesso gateway isolato:

- `/api/themes` elenca sia `dark-contrast:dark-contrast` sia `dual-tone:dual-tone`;
- `/api/theme?themeId=dual-tone:dual-tone` restituisce **solo** il foglio Dual Tone;
- `/api/theme?themeId=dark-contrast:dark-contrast` restituisce **solo** il foglio Dark Contrast;
- foglio Dual Tone: 35 token `--dt-`, **0** token `--dc-`, **0** menzioni "Dark Contrast",
  52 token `--pi-`;
- foglio Dark Contrast: 14 token `--dc-`, **0** token `--dt-`, 52 token `--pi-`.

Dettagli: [`coexistence.json`](coexistence.json). Le URL contengono la revisione del
pacchetto calcolata al momento della prova (Pi Web la calcola sull'intero pacchetto):
qualsiasi modifica successiva, anche solo a test o documentazione, produce un hash nuovo
senza cambiare l'esito della verifica.

## Rendering reale (Computer Use)

Su un PC desktop della rete locale, finestra Firefox isolata (`--profile` temporaneo)
puntata all'anteprima tramite tunnel SSH:

1. **Settings → General → Theme** mostra, nello stesso elenco, *Dark Contrast* e *Dual Tone*.
2. Applicato **Dark Contrast** con *Use in this browser*: selezioni blu, superfici neutre.
3. Applicato **Dual Tone**: progetto blu, sessione e risposta verde petrolio; nessun reload.
4. Selezionata una sessione diversa: la riga attiva diventa `#20372F` con bordo teal.
5. Espanso il gruppo eventi: intestazione leggibile, tool `done`/`failed` distinti,
   corpo dell'errore leggibile.
6. Responsive Design Mode a **320 px**: layout mobile, nessun overflow, composer contenuto.

Gli screenshot pubblicati nel repository sono **solo quelli sintetici** dell'harness:
nessuna immagine del desktop reale, del browser personale o di progetti/sessioni
preesistenti è inclusa. Nomi di progetti, percorsi e sessioni nelle immagini sono
fittizi (`Aurora Lab`, `Borea`, `Cobalto`, `Dune Works`, `/tmp/dual-tone-showcase`).

Screenshot comparativi e di matrice:

- [`dual-tone-desktop.png`](../docs/dual-tone-desktop.png)
- [`comparison-desktop.png`](../docs/comparison-desktop.png)
- [`comparison-sidebar.png`](../docs/comparison-sidebar.png)
- [`comparison-mobile.png`](../docs/comparison-mobile.png)
- [`dual-tone-events.png`](../docs/dual-tone-events.png)
- [`dual-tone-mobile.png`](../docs/dual-tone-mobile.png)
- [`dual-tone-mobile-navigation.png`](../docs/dual-tone-mobile-navigation.png)
- [`dual-tone-tablet.png`](../docs/dual-tone-tablet.png)

## Limiti dichiarati

- Le sessioni della fixture sono sintetiche: nessuna inferenza, allegato, shell o
  terminale è stato eseguito nel collaudo grafico.
- Sui viewport da telefono la sezione progetti è chiusa per scelta nativa di Pi Web:
  la tipografia dell'etichetta è verificata a desktop e la selezione progetto è
  verificata aprendo la sezione nella vista di navigazione mobile.
- Alcuni selettori del chrome core e di CodeMirror sono sperimentali: ricollaudare dopo
  ogni aggiornamento di Pi Web.
- La baseline ufficiale è una copia statica: se Pi Web aggiungesse nuovi token, i plugin
  userebbero i fallback finché la copia non viene riallineata.
- L'isolamento OpenSpec è verificato su aspetto e token, non su ogni comportamento
  funzionale del plugin.
- Nessuna trascrizione preesistente è stata letta o copiata.

## Pulizia

Sono stati chiusi solo i processi creati per la prova: due istanze di anteprima Pi Web
isolate, i relativi proxy, i due tunnel SSH, i profili Chromium temporanei e la finestra
Firefox di prova. I servizi operativi di Pi Web non sono stati riavviati; il browser
personale dell'utente non è stato toccato.
