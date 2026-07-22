"use client";

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto text-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <span className="text-neon-red text-xs uppercase tracking-[0.2em] mb-2 block">
            Légal
          </span>
          <h1 className="heading-lg mb-4">Politique de Confidentialité</h1>
          <p className="text-white/60">Dernière mise à jour : 22 juillet 2026</p>
        </motion.div>

        <motion.div
          className="space-y-8 text-white/70"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Responsable du traitement</h2>
            <p>
              GHF Agency (&quot;Girl&apos;s Have Fun&quot;), agence événementielle basée à Paris, est responsable du
              traitement des données à caractère personnel collectées via ce site et son application. Pour toute
              question relative à vos données, vous pouvez nous contacter à l&apos;adresse{' '}
              <a href="mailto:dpo@ghfagency.com" className="text-neon-gold hover:underline">
                dpo@ghfagency.com
              </a>{' '}
              ou par courrier au siège social de l&apos;agence, Paris, France.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. Données collectées</h2>
            <p>Selon votre utilisation du site, nous collectons :</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>
                <strong className="text-white">Compte utilisateur</strong> : nom, adresse email, mot de passe
                (stocké de façon chiffrée), numéro de téléphone et pseudo Instagram (facultatifs).
              </li>
              <li>
                <strong className="text-white">Réservations</strong> : événement choisi, type de table (VIP /
                Ambassadeur), nombre de personnes, et informations de contact nécessaires au traitement de la
                réservation.
              </li>
              <li>
                <strong className="text-white">Concours</strong> : informations fournies lors de votre participation
                (nom, contact, réponses au formulaire) utilisées pour l&apos;attribution des lots.
              </li>
              <li>
                <strong className="text-white">Photos de la galerie</strong> : images envoyées via notre système
                d&apos;upload communautaire ou prises lors de nos événements.
              </li>
              <li>
                <strong className="text-white">Cookies et données de navigation</strong> : jeton de connexion
                (stocké dans le navigateur pour vous maintenir connecté·e), préférences d&apos;affichage, et le cas
                échéant des mesures d&apos;audience anonymisées.
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Finalités et base légale</h2>
            <p>Vos données sont traitées pour les finalités suivantes :</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Créer et gérer votre compte, et vous authentifier (exécution du contrat / intérêt légitime).</li>
              <li>Traiter vos réservations de tables et événements (exécution du contrat).</li>
              <li>Organiser les concours et attribuer les lots (exécution du contrat / consentement).</li>
              <li>Publier les photos de la galerie communautaire à des fins promotionnelles (consentement).</li>
              <li>Vous informer de nos événements exclusifs par email (consentement, avec possibilité de retrait à tout moment).</li>
              <li>Assurer la sécurité du site et prévenir la fraude (intérêt légitime).</li>
              <li>Respecter nos obligations légales et comptables (obligation légale).</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Cookies et traceurs</h2>
            <p>
              Le site utilise un stockage local (<code className="text-neon-gold">localStorage</code>) pour
              conserver votre jeton de connexion et vous éviter de vous ré-authentifier à chaque visite. Ce
              stockage est strictement nécessaire au fonctionnement du service et ne requiert pas de consentement
              préalable. Des cookies ou outils de mesure d&apos;audience additionnels (statistiques de
              fréquentation) peuvent être utilisés ; dans ce cas, votre consentement vous est demandé via le bandeau
              affiché lors de votre première visite, et vous pouvez le modifier à tout moment en effaçant les
              données de votre navigateur.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Durée de conservation</h2>
            <p>
              Les données de compte sont conservées tant que votre compte est actif, puis supprimées ou anonymisées
              dans un délai de 3 ans après votre dernière activité. Les données de réservation sont conservées 5 ans
              à des fins comptables et légales. Les photos de la galerie sont conservées jusqu&apos;à votre demande
              de retrait.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Destinataires des données</h2>
            <p>
              Vos données sont destinées aux équipes internes de GHF Agency et à nos sous-traitants techniques
              (hébergement du site et de l&apos;API, envoi d&apos;emails), qui n&apos;utilisent vos données que
              pour exécuter les prestations demandées et dans le respect du RGPD. Elles ne sont ni vendues, ni
              louées à des tiers.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Droit à l&apos;image</h2>
            <p>
              En envoyant des photos via notre système d&apos;upload communautaire, ou en participant à nos
              événements, vous consentez à l&apos;exploitation potentielle de votre image au sein de notre galerie,
              uniquement à des fins promotionnelles pour GHF Agency. Vous pouvez demander le retrait de vos photos
              à tout moment en nous contactant.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Vos droits</h2>
            <p>Conformément au RGPD et à la loi Informatique et Libertés, vous disposez des droits suivants :</p>
            <ul className="list-disc list-inside space-y-2 pl-2">
              <li>Droit d&apos;accès à vos données personnelles.</li>
              <li>Droit de rectification des données inexactes ou incomplètes.</li>
              <li>Droit à l&apos;effacement (&quot;droit à l&apos;oubli&quot;).</li>
              <li>Droit d&apos;opposition et de limitation du traitement.</li>
              <li>Droit à la portabilité de vos données.</li>
              <li>Droit de retirer votre consentement à tout moment, sans affecter la licéité des traitements antérieurs.</li>
            </ul>
            <p>
              Pour exercer l&apos;un de ces droits, contactez-nous à{' '}
              <a href="mailto:dpo@ghfagency.com" className="text-neon-gold hover:underline">
                dpo@ghfagency.com
              </a>
              . Une réponse vous sera apportée dans un délai maximum d&apos;un mois. Si vous estimez que vos droits
              ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL (
              <a
                href="https://www.cnil.fr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-gold hover:underline"
              >
                www.cnil.fr
              </a>
              ).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Sécurité</h2>
            <p>
              Nous mettons en œuvre les mesures techniques et organisationnelles nécessaires pour assurer la
              sécurité de vos données (connexion chiffrée, gestion sécurisée des accès, chiffrement des mots de
              passe).
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Modification de cette politique</h2>
            <p>
              Cette politique de confidentialité peut être mise à jour à tout moment afin de refléter l&apos;
              évolution du site ou de la réglementation. La date de dernière mise à jour est indiquée en haut de
              cette page.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
