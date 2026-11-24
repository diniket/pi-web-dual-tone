# Preparazione alla pubblicazione

**Stato: repository GitHub pubblicato, npm NON pubblicato.** Il repository
[`diniket/pi-web-dual-tone`](https://github.com/diniket/pi-web-dual-tone) è pubblico sul
branch `main`; nessun pacchetto è stato inviato a npm.

## Verifiche

| Voce | Esito |
|---|---|
| Repository GitHub `diniket/pi-web-dual-tone` | **pubblico**, branch `main`, topic impostati |
| Nome npm `pi-web-dual-tone` | libero (HTTP 404 sul registry, verificato prima del rilascio GitHub) |
| `npm test` | 41/41 |
| `npm pack --dry-run` | 8 file, 8.4 kB |
| Coesistenza con Dark Contrast | verificata, ID e fogli separati |
| Repository Dark Contrast originale | invariato, working tree pulito |
| Istanza Pi Web operativa e PUCP | non toccati dalla pubblicazione GitHub |
| Screenshot pubblicati | solo sintetici, nomi e percorsi fittizi |

## Metadati GitHub (applicati)

- **Nome**: `pi-web-dual-tone`
- **Descrizione**: `Two-tone dark theme for Pi Web: blue projects and user messages, teal sessions and agent messages, plugins untouched.`
- **Homepage**: `https://github.com/diniket/pi-web-dual-tone#readme`
- **Topic**: `pi-web`, `pi-web-theme`, `pi-coding-agent`, `theme`, `dark-theme`, `accessibility`
- **Licenza**: MIT (copyright 2026 diniket, invariato)

## Metadati già nel pacchetto

`package.json` contiene nome, versione `1.0.0`, descrizione, 10 keyword, licenza MIT,
`engines.node >= 22.19.0`, `files` (`assets`, `CHANGELOG.md`, `LICENSE`),
`publishConfig.access = public`, blocco `piWeb` (plugin `dual-tone`, tema `dual-tone`),
`piWebTested` (Pi Web `1.202611.2`, commit `07b7665`) e i link repository/homepage/bugs.

## Pubblicazione npm — da eseguire solo dopo approvazione esplicita

```bash
# 1. Controlli finali
npm test
npm pack --dry-run

# 2. Pubblicazione
npm publish --access public

# 3. Verifica post-pubblicazione
npm view pi-web-dual-tone version
npm view pi-web-dual-tone dist.tarball
pi install npm:pi-web-dual-tone   # su un profilo di prova, non sull'istanza operativa
```

Tag e release GitHub (opzionali, non ancora creati):

```bash
git tag -a v1.0.0 -m "Dual Tone 1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --title "Dual Tone 1.0.0" --notes-file CHANGELOG.md
```

## Rollback

- **GitHub**: eliminare release/tag e repository remoto; il repository locale resta
  intatto. `gh repo delete diniket/pi-web-dual-tone`.
- **npm** (solo dopo una futura pubblicazione): `npm unpublish pi-web-dual-tone@1.0.0`
  (soggetto alla policy npm sulle 72 ore) oppure `npm deprecate`.
- **Pi Web**: scegliere un altro tema e rimuovere il plugin; con il mount locale attuale,
  `rm ~/.pi-web/plugins/dual-tone`.

La pubblicazione su GitHub è stata eseguita su autorizzazione dell'utente; la
pubblicazione npm non è stata eseguita.
