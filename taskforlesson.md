# TASKFORLESSON — Journal des leçons apprises

> Ce fichier est lu au début de chaque session. Chaque erreur rencontrée devient une leçon ici.
> Les leçons générales remontent dans `CLAUDE.md` en tant que règle permanente.

---

## Format d'une leçon

```
### [DATE] — Titre court
**Contexte :** ce qui se passait
**Erreur :** ce qui a mal tourné
**Leçon :** ce qu'il faut faire à la place
**Règle dérivée :** (si applicable — copier dans CLAUDE.md)
```

---

## Leçons

### [2026-04-22] — TypeError sur .toUpperCase() d'un champ undefined
**Contexte :** `admin/page.js:598` — affichage du statut d'une réservation dans le tableau admin
**Erreur :** `r.status.toUpperCase()` plante si l'API retourne une réservation sans champ `status`
**Leçon :** Toujours utiliser l'optional chaining sur les champs de chaîne venant de l'API : `r.status?.toUpperCase() ?? '—'`
**Règle dérivée :** Ne jamais appeler de méthode string (`.toUpperCase()`, `.toLowerCase()`, `.trim()`) directement sur un champ API sans guard `?.`
