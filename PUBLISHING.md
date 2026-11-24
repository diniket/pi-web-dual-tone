# Preparazione alla pubblicazione

**Stato: NON pubblicato.** Nessun repository remoto è stato creato, nessun push è stato
eseguito, nessun pacchetto è stato inviato a npm. Il remote locale `origin` punta già
all'URL previsto, ma non è stato contattato in scrittura.

## Verifiche già eseguite

| Voce | Esito |
|---|---|
| Nome npm `pi-web-dual-tone` | libero (HTTP 404 sul registry) |
| Repository GitHub `diniket/pi-web-dual-tone` | libero (HTTP 404 sull'API) |
| `npm test` | 41/41 |
| `npm pack --dry-run` | 8 file, 8.4 kB |
| Coesistenza con Dark Contrast | verificata, ID e fogli separati |
| Repository Dark Contrast originale | invariato, working tree pulito |
| Istanza Pi Web operativa e PUCP | non toccati |

## Metadati proposti per GitHub

- **Nome**: `pi-web-dual-tone`
- **Descrizione**: `Two-tone dark theme for Pi Web: blue projects and user messages, teal sessions and agent messages, plugins untouched.`
- **Homepage**: `https://github.com/diniket/pi-web-dual-tone#readme`
- **Topic**: `pi-web`, `pi-web-theme`, `pi-coding-agent`, `theme`, `dark-theme`, `accessibility`
- **Licenza**: MIT (copyright 2026 diniket, invariato)
- **Release iniziale**: tag `v1.0.0`, titolo `Dual Tone 1.0.0`

## Metadati già nel pacchetto

`package.json` contiene nome, versione `1.0.0`, descrizione, 10 keyword, licenza MIT,
`engines.node >= 22.19.0`, `files` (`assets`, `CHANGELOG.md`, `LICENSE`),
`publishConfig.access = public`, blocco `piWeb` (plugin `dual-tone`, tema `dual-tone`),
`piWebTested` (Pi Web `1.202611.2`, commit `07b7665`) e i link repository/homepage/bugs.

## Comandi da eseguire solo dopo approvazione esplicita

```bash
# 1. Repository GitHub e primo push
gh repo create diniket/pi-web-dual-tone --public \
  --description "Two-tone dark theme for Pi Web: blue projects and user messages, teal sessions and agent messages, plugins untouched." \
  --source=. --remote=origin --push

# 2. Tag della release
git tag -a v1.0.0 -m "Dual Tone 1.0.0"
git push origin v1.0.0

# 3. Pubblicazione npm (dopo aver rifatto i controlli)
npm test
npm pack --dry-run
npm publish --access public

# 4. Verifica post-pubblicazione
npm view pi-web-dual-tone version
npm view pi-web-dual-tone dist.tarball
pi install npm:pi-web-dual-tone   # su un profilo di prova, non sull'istanza operativa
```

Impostare i topic GitHub dalla UI o con:

```bash
gh repo edit diniket/pi-web-dual-tone --add-topic pi-web --add-topic pi-web-theme \
  --add-topic pi-coding-agent --add-topic theme --add-topic dark-theme --add-topic accessibility
```

## Rollback

- **npm**: `npm unpublish pi-web-dual-tone@1.0.0` (soggetto alla policy npm sulle 72 ore);
  in alternativa `npm deprecate pi-web-dual-tone@1.0.0 "ritirato"`.
- **GitHub**: eliminare la release/tag e il repository remoto; il repository locale resta
  intatto e può essere ripubblicato.
- **Pi Web**: scegliere un altro tema e `pi remove npm:pi-web-dual-tone`.

Nessuna di queste operazioni è stata eseguita.
