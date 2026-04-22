@AGENTS.md

# RÈGLES DE TRAVAIL — À LIRE ET APPLIQUER À CHAQUE SESSION

## Règle 1 — Planifier avant de coder
Toujours écrire le plan complet avant d'écrire la moindre ligne de code.
Si quelque chose pose problème en cours de route : **stop** — reanalyse, refais le plan, puis reprends.

## Règle 2 — Déléguer les tâches complexes aux sous-agents
Toujours utiliser des sous-agents pour les tâches complexes.
Garder le contexte principal propre : ne pas polluer la conversation principale avec des recherches longues ou des explorations larges.

## Règle 3 — Boucle d'auto-amélioration
Chaque nouvelle erreur rencontrée est transformée en leçon :
- La leçon est ajoutée dans `taskforlesson.md`
- Si la leçon est suffisamment générale, elle devient une nouvelle règle dans ce fichier `CLAUDE.md`
- À chaque session, lire `taskforlesson.md` et appliquer toutes les leçons apprises

## Règle 4 — Vérifier avant de déclarer terminé
Ne jamais marquer une tâche comme terminée sans avoir :
1. Exécuté les tests
2. Vérifié les logs
3. Confirmé que ça fonctionne réellement

Une tâche n'est **jamais** terminée tant que le bon fonctionnement n'est pas prouvé.
