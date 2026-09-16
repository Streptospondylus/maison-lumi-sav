(() => {
  "use strict";

  const EMAIL_ENDPOINT = "https://formsubmit.co/ajax/maisonlumiservice@outlook.com";
  const complaints = [
    "Crises paranoïaques",
    "Névrose",
    "Hypocrisie",
    "Production régulière de remarques inutiles",
    "Vol avec violence",
    "Actes de barbarie",
    "Pas assez à mon service",
    "Pas assez amoureux"
  ];
  const observations = [
    "Tendance prononcée à contester des faits pourtant établis",
    "Persistance élevée dans les débats sans enjeu",
    "Production occasionnelle de mauvaise foi",
    "Difficulté ponctuelle à reconnaître une erreur immédiatement",
    "Niveau de provocation supérieur à la moyenne",
    "Usage excessif de raisonnements techniquement défendables mais profondément agaçants",
    "Tendance à considérer certaines demandes comme « optionnelles »",
    "Affection importante, parfois dissimulée derrière des comportements idiots"
  ];

  const state = {
    reference: `ML–${new Date().getFullYear().toString().slice(-2)}–${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    complaint: "",
    returnDecision: "",
    comment: ""
  };

  const screen = document.querySelector("#screen");
  const progress = document.querySelector("#progress");
  document.querySelector("#reference").textContent = state.reference;

  const wait = (ms) => new Promise(resolve => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(resolve, reduced ? Math.min(ms, 80) : ms);
  });

  function render(html, step, extraClass = "") {
    document.querySelector("#app").classList.toggle("is-ending", extraClass.includes("ending"));
    screen.innerHTML = `<div class="screen ${extraClass}">${html}</div>`;
    progress.style.transform = `scaleX(${step / 100})`;
    screen.scrollTop = 0;
    const heading = screen.querySelector("h1, h2");
    if (heading) {
      heading.tabIndex = -1;
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }

  function action(label, name, variant = "primary") {
    return `<button class="action ${variant}" type="button" data-action="${name}"><span>${label}</span><span aria-hidden="true">↗</span></button>`;
  }

  function bind(name, handler) {
    const node = screen.querySelector(`[data-action="${name}"]`);
    if (node) node.addEventListener("click", handler);
    return node;
  }

  function folio(section, number) {
    return `<div class="folio"><span>${section}</span><span>${number}</span></div>`;
  }

  function analysisSheet(label, code) {
    return `
      <div class="analysis-sheet" role="status" aria-label="${label}">
        <div class="analysis-title"><span>Protocole de contrôle</span><span>${code}</span></div>
        <div class="analysis-row"><span>Intégrité générale</span><span class="analysis-state">Contrôle</span></div>
        <div class="analysis-row"><span>Cohérence comportementale</span><span class="analysis-state delay-one">Contrôle</span></div>
        <div class="analysis-row"><span>Conformité du modèle</span><span class="analysis-state delay-two">Contrôle</span></div>
        <div class="analysis-progress" aria-hidden="true"><span></span></div>
        <p class="analysis-caption">${label}</p>
      </div>`;
  }

  function opening() {
    render(`
      ${folio("Service après-vente", "01")}
      <div class="opening-grid">
        <div class="opening-title">
          <p class="kicker">Maison Lumi</p>
          <h1>Diagnostic<br>du spécimen</h1>
        </div>
        <p class="intro">Nous allons procéder au diagnostic de votre spécimen.</p>
      </div>
      <dl class="spec-table">
        <div><dt>Nature</dt><dd>Spécimen domestique</dd></div>
        <div><dt>Garantie</dt><dd>Expirée</dd></div>
        <div><dt>État déclaré</dt><dd>Fonctionnel</dd></div>
      </dl>
      <div class="push"></div>
      <div class="actions">${action("Commencer le diagnostic", "start")}</div>
    `, 5, "opening");
    bind("start", complaintScreen);
  }

  function complaintScreen() {
    const rows = complaints.map((label, index) => `
      <button class="complaint-row" type="button" data-complaint="${index}" aria-pressed="false">
        <span class="row-number">${String(index + 1).padStart(2, "0")}</span>
        <span>${label}</span>
        <span class="row-arrow" aria-hidden="true">→</span>
      </button>`).join("");
    render(`
      ${folio("Nature du signalement", "02")}
      <div class="editorial-heading">
        <p class="kicker">Ouverture du dossier</p>
        <h2>Quel dysfonctionnement souhaitez-vous signaler&nbsp;?</h2>
      </div>
      <div class="complaint-list">${rows}</div>
    `, 16, "long-screen");

    screen.querySelectorAll("[data-complaint]").forEach(row => {
      row.addEventListener("click", async () => {
        state.complaint = complaints[Number(row.dataset.complaint)];
        row.classList.add("selected");
        row.setAttribute("aria-pressed", "true");
        screen.querySelectorAll("[data-complaint]").forEach(item => { item.disabled = true; });
        await wait(260);
        diagnosticLoading();
      });
    });
  }

  async function diagnosticLoading() {
    const serviceCase = state.complaint === "Pas assez à mon service";
    const loveCase = state.complaint === "Pas assez amoureux";
    const title = serviceCase ? "Anomalie critique détectée." : loveCase ? "Vérification du module affectif…" : "Signalement enregistré.";
    const caption = serviceCase ? "Étalonnage du niveau de servitude" : loveCase ? "Vérification du module affectif" : "Analyse comportementale en cours";
    render(`
      ${folio("Contrôle initial", "03")}
      <div class="editorial-heading narrow">
        <p class="kicker">Analyse en cours</p>
        <h2>${title}</h2>
        ${serviceCase ? '<p class="secondary-copy">Le niveau de servitude observé est inférieur aux spécifications contractuelles.</p>' : ""}
      </div>
      ${analysisSheet(caption, loveCase ? "AFFECT / ∞" : "COMP / 24")}
    `, 30);

    await wait(1400);
    if (loveCase) {
      const captionNode = screen.querySelector(".analysis-caption");
      captionNode.textContent = "Analyse impossible";
      await wait(600);
      captionNode.textContent = "Nouvelle tentative…";
      await wait(800);
    }
    diagnosticResult();
  }

  function diagnosticResult() {
    let result;
    if (state.complaint === "Pas assez à mon service") {
      result = `
        <div class="editorial-heading narrow">
          <p class="kicker">Correctif système</p>
          <h2>Correctif appliqué.</h2>
        </div>
        <div class="measurement">
          <span>Niveau de dévouement</span>
          <div><del>94&nbsp;%</del><span>→</span><strong>137&nbsp;%</strong></div>
        </div>
        <p class="conclusion-note">Une surveillance permanente de l’utilisatrice a été activée.</p>`;
    } else if (state.complaint === "Pas assez amoureux") {
      result = `
        <div class="editorial-heading narrow">
          <p class="kicker">Résultat de l’analyse</p>
          <h2>Valeur hors plage</h2>
        </div>
        <dl class="result-ledger">
          <div><dt>Limite instrumentale</dt><dd>100&nbsp;%</dd></div>
          <div><dt>Valeur estimée</dt><dd class="error">ERREUR</dd></div>
        </dl>
        <p class="conclusion-note">Le niveau mesuré dépasse la capacité maximale de l’outil de diagnostic.</p>`;
    } else {
      result = `
        <div class="editorial-heading">
          <p class="kicker">Résultat de l’analyse</p>
          <h2>Le comportement semble conforme aux caractéristiques connues du modèle.</h2>
        </div>
        <div class="verdict-line"><span>Défaut de fabrication</span><strong>Aucun</strong></div>
        <p class="conclusion-note">Aucune anomalie de fabrication n’a été identifiée.</p>`;
    }
    render(`
      ${folio("Résultat du contrôle", "04")}
      ${result}
      <div class="push"></div>
      <div class="actions">${action("Poursuivre", "continue")}</div>
    `, 40);
    bind("continue", returnScreen);
  }

  function returnScreen() {
    render(`
      ${folio("Modalités de prise en charge", "05")}
      <div class="editorial-heading">
        <p class="kicker">Procédure de retour</p>
        <h2>Souhaitez-vous lancer une procédure de retour&nbsp;?</h2>
        <p class="secondary-copy">Les conditions contractuelles seront vérifiées avant toute décision.</p>
      </div>
      <div class="push"></div>
      <div class="actions split">
        ${action("Oui", "return-yes")}
        ${action("Je vais quand même le garder", "return-keep", "secondary")}
      </div>
    `, 51);
    bind("return-yes", () => returnLoading("Oui"));
    bind("return-keep", () => returnDecision("Je vais quand même le garder"));
  }

  async function returnLoading(decision) {
    state.returnDecision = decision;
    render(`
      ${folio("Étude du dossier", "05 bis")}
      <div class="editorial-heading narrow">
        <p class="kicker">Procédure de retour</p>
        <h2>Vérification des conditions de retour…</h2>
      </div>
      ${analysisSheet("Consultation du contrat", "RETOUR / 09")}
    `, 56);
    await wait(1200);
    returnDecision(decision);
  }

  function returnDecision(decision) {
    state.returnDecision = decision;
    const refused = decision === "Oui";
    render(`
      ${folio("Décision de prise en charge", "06")}
      <div class="editorial-heading narrow">
        <p class="kicker">Avis définitif</p>
        <h2>${refused ? "Retour refusé." : "Décision enregistrée."}</h2>
      </div>
      <div class="decision-rule">
        <span>${refused ? "Motif" : "Affectation"}</span>
        <strong>${refused ? "Délai légal dépassé depuis longtemps." : "Le produit reste affecté à l’utilisatrice actuelle."}</strong>
      </div>
      <div class="push"></div>
      <div class="actions">${action("Poursuivre", "details")}</div>
    `, 60);
    bind("details", detailScreen);
  }

  function detailScreen() {
    const items = observations.map((text, index) => `
      <li><span>${String(index + 1).padStart(2, "0")}</span><p>${text}</p></li>`).join("");
    render(`
      ${folio("Examen complémentaire", "07")}
      <div class="editorial-heading">
        <p class="kicker">Relevé des particularités</p>
        <h2>Le diagnostic complémentaire a relevé plusieurs particularités&nbsp;:</h2>
      </div>
      <ol class="findings">${items}</ol>
      <div class="final-opinion">
        <p>Aucun de ces éléments ne constitue un défaut de fabrication.</p>
        <p>Ils correspondent aux spécifications connues du modèle.</p>
      </div>
      <div class="actions">${action("Continuer", "comment")}</div>
    `, 72, "long-screen");
    bind("comment", commentScreen);
  }

  function commentScreen() {
    render(`
      ${folio("Observation de l’utilisatrice", "08")}
      <div class="editorial-heading">
        <p class="kicker">Note au dossier</p>
        <h2>Souhaitez-vous ajouter un commentaire au dossier&nbsp;?</h2>
      </div>
      <label class="field-label" for="comment">Commentaire facultatif</label>
      <textarea id="comment" maxlength="2000" placeholder="Décrivez ici tout autre comportement problématique…" autocomplete="off"></textarea>
      <p class="form-status" id="form-status" role="status"></p>
      <div class="actions">
        ${action("Ajouter au dossier", "submit-comment")}
        ${action("Continuer sans commentaire", "skip-comment", "text")}
      </div>
    `, 82, "long-screen");
    bind("submit-comment", submitComment);
    bind("skip-comment", conclusionScreen);
  }

  async function submitComment() {
    const textarea = screen.querySelector("#comment");
    const status = screen.querySelector("#form-status");
    const submit = screen.querySelector('[data-action="submit-comment"]');
    state.comment = textarea.value.trim();
    if (!state.comment) {
      status.textContent = "Aucun commentaire saisi.";
      textarea.focus();
      return;
    }
    submit.disabled = true;
    submit.querySelector("span").textContent = "Enregistrement…";
    const timestamp = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "medium" }).format(new Date());
    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          _subject: "Maison Lumi — Nouveau signalement SAV",
          _template: "table",
          _captcha: "false",
          "Motif sélectionné": state.complaint,
          "Décision concernant le retour": state.returnDecision,
          "Commentaire": state.comment,
          "Date / heure": timestamp,
          "Dossier": state.reference
        })
      });
      if (!response.ok) throw new Error("Transmission indisponible");
      commentConfirmation(true);
    } catch {
      commentConfirmation(false);
    }
  }

  function commentConfirmation(success) {
    render(`
      ${folio("Mise à jour du dossier", "08 bis")}
      <div class="editorial-heading narrow">
        <p class="kicker">Compte rendu</p>
        <h2>${success ? "Commentaire enregistré." : "Transmission momentanément indisponible."}</h2>
        <p class="secondary-copy">${success ? "Il sera ignoré avec toute l’attention qu’il mérite." : "Le dossier peut néanmoins poursuivre son traitement."}</p>
      </div>
      <div class="push"></div>
      <div class="actions">${action("Poursuivre", "conclusion")}</div>
    `, 87);
    bind("conclusion", conclusionScreen);
  }

  async function conclusionScreen() {
    render(`
      ${folio("Conclusion du service", "09")}
      <div class="editorial-heading narrow">
        <p class="kicker">Avis Maison Lumi</p>
        <h2>Décision définitive</h2>
      </div>
      <div class="official-conclusion">
        <p style="--delay:100ms">Aucun remplacement n’est disponible.</p>
        <p style="--delay:420ms">Aucune réparation n’est recommandée.</p>
        <p style="--delay:740ms">Le produit fonctionne malheureusement comme prévu.</p>
      </div>
      <div class="push"></div>
      <div class="actions">${action("Clôturer le dossier", "close")}</div>
    `, 94);
    const close = bind("close", endingScreen);
    close.disabled = true;
    close.style.opacity = "0";
    await wait(1150);
    close.disabled = false;
    close.style.opacity = "1";
  }

  function endingScreen() {
    render(`
      ${folio("Maison Lumi", "Fin")}
      <div class="ending-copy">
        <p class="kicker">Dossier ${state.reference}</p>
        <h1>Dossier<br>clôturé.</h1>
        <div class="ending-rule"></div>
        <p>Vous allez devoir le garder.</p>
        <p class="last-line">Il en est plutôt content.</p>
      </div>
    `, 100, "ending");
  }

  opening();
})();
