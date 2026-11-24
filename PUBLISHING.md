# Pubblicazione

**Stato: pubblicato.** Repository GitHub pubblico e pacchetto npm `pi-web-dual-tone@1.0.0`
disponibile; tag `v1.0.0` e release GitHub creati dal commit `06e0e72`.

- GitHub: <https://github.com/diniket/pi-web-dual-tone>
- Release: <https://github.com/diniket/pi-web-dual-tone/releases/tag/v1.0.0>
- npm: <https://www.npmjs.com/package/pi-web-dual-tone>

## Verifiche

| Voce | Esito |
|---|---|
| `npm test` | 41/41 |
| Tarball pubblicato | 8 file, 8.4 kB |
| Shasum registry | `e09925cfe4d5ce98249edb04938d4a5a8620a62c` (identico al pack locale) |
| Baseline plugin | SHA-256 `88b39cf2…7692`, invariata |
| `latest` npm | `1.0.0` |
| Coesistenza con Dark Contrast | verificata, ID e fogli separati |
| Repository Dark Contrast originale | invariato |
| Screenshot pubblicati | solo sintetici, nomi e percorsi fittizi |

## Metadati applicati

- **Descrizione GitHub/npm**: `Two-tone dark theme for Pi Web: blue projects and user messages, teal sessions and agent messages, plugins untouched.`
- **Topic GitHub**: `pi-web`, `pi-web-theme`, `pi-coding-agent`, `theme`, `dark-theme`, `accessibility`
- **Licenza**: MIT (copyright 2026 diniket)
- **Compatibilità dichiarata**: Pi Web `1.202611.2` (commit `07b7665`)
- **Release**: `v1.0.0`, note da `CHANGELOG.md`

## Versione placeholder

Il registry conserva anche `0.0.0-stage`, un placeholder creato prima del rilascio per
riservare il nome. Non è `latest` e non viene installato da `npm install`; può essere
rimosso o deprecato su richiesta.

## Installazione

```bash
pi install npm:pi-web-dual-tone
```

Poi **Settings → General → Theme → Dual Tone**. Il mount locale attuale
(`~/.pi-web/plugins/dual-tone` → repository) resta attivo per lo sviluppo e non va in
conflitto con il pacchetto npm.

## Rollback

- **npm**: `npm unpublish pi-web-dual-tone@1.0.0` (soggetto alla policy npm sulle 72 ore)
  oppure `npm deprecate pi-web-dual-tone@1.0.0 "ritirato"`.
- **GitHub**: eliminare release e tag `v1.0.0`, quindi il repository remoto se necessario.
- **Pi Web**: scegliere un altro tema; per il mount locale `rm ~/.pi-web/plugins/dual-tone`.
