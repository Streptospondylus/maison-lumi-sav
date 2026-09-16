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
    reference: createReference(),
    complaint: "",
    returnDecision: "",
    comment: "",
    view: "opening"
  };

  const screen = document.querySelector("#screen");
  const progress = document.querySelector("#progress");
  document.querySelector("#reference").textContent = state.reference;

  function createReference() {
    const seed = (Date.now().toString(36).slice(-3) + Math.random().toString(36).slice(2, 4)).toUpperCase();
    return `ML-SAV-${seed}`;
  }

  function setProgress(value) {
    progress.style.width = `${value}%`;
  }

  function render(html, progressValue, className = "") {
    screen.innerHTML = `<div class="screen ${className}">${html}</div>`;
    setProgress(progressValue);
    screen.scrollTop = 0;
    const heading = screen.querySelector("h1, h2");
    if (heading) {
      heading.setAttribute("tabindex", "-1");
      requestAnimationFrame(() => heading.focus({ preventScroll: true }));
    }
  }

  function button(label, action, type = "primary") {
    return `<button class="button ${type}" type="button" data-action="${action}">${label}</button>`;
  }

  function bind(action, handler) {
    const element = screen.querySelector(`[data-action="${action}"]`);
    if (element) element.addEventListener("click", handler);
    return element;
  }

  function wait(ms) {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return new Promise(resolve => window.setTimeout(resolve, reduced ? Math.min(ms, 80) : ms));
  }

  function opening() {
    state.view = "opening";
    render(`
      <div class="content">
        <p class="eyebrow">Prise en charge</p>
        <h1>Service après-vente</h1>
        <p class="lead">Nous allons procéder au diagnostic de votre spécimen.</p>
        <div class="status-panel" aria-label="Informations du dossier">
          <div class="status-row"><span>Type</span><strong>Spécimen domestique</strong></div>
          <div class="status-row"><span>Garantie</span><strong>Expirée</strong></div>
          <div class="status-row"><span>Statut</span><strong>En attente</strong></div>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="action-area">${button("Commencer le diagnostic", "start")}</div>
    `, 5);
    bind("start", complaintScreen);
  }

  function complaintScreen() {
    state.view = "complaint";
    const choices = complaints.map((item, index) => `
      <button class="choice" type="button" data-complaint="${index}" aria-pressed="false">
        <span>${item}</span><span class="select-mark" aria-hidden="true"></span>
      </button>`).join("");
    render(`
      <div class="content scrollable">
        <p class="eyebrow">Ouverture du dossier</p>
        <h2>Quel dysfonctionnement souhaitez-vous signaler&nbsp;?</h2>
        <div class="choice-list" role="list">${choices}</div>
      </div>
    `, 16, "compact");

    screen.querySelectorAll("[data-complaint]").forEach(choice => {
      choice.addEventListener("click", async () => {
        state.complaint = complaints[Number(choice.dataset.complaint)];
        choice.classList.add("selected");
        choice.setAttribute("aria-pressed", "true");
        screen.querySelectorAll("[data-complaint]").forEach(node => { node.disabled = true; });
        await wait(300);
        diagnosticLoading();
      });
    });
  }

  async function diagnosticLoading() {
    state.view = "diagnostic-loading";
    let label = "Analyse comportementale en cours";
    if (state.complaint === "Pas assez à mon service") label = "Étalonnage du niveau de servitude";
    if (state.complaint === "Pas assez amoureux") label = "Vérification du module affectif";
    const serviceWarning = state.complaint === "Pas assez à mon service"
      ? '<p class="body-copy">Le niveau de servitude observé est inférieur aux spécifications contractuelles.</p>'
      : "";
    render(`
      <div class="content">
        <p class="eyebrow">Diagnostic initial</p>
        <h2>${state.complaint === "Pas assez à mon service" ? "Anomalie critique détectée." : state.complaint === "Pas assez amoureux" ? "Vérification du module affectif…" : "Signalement enregistré."}</h2>
        ${serviceWarning}
        <div class="diagnostic" role="status" aria-label="${label}">
          <div>
            <div class="scanner" aria-hidden="true"><span class="scanner-line"></span></div>
            <p class="loader-label">${label}</p>
          </div>
        </div>
      </div>
    `, 30);
    await wait(1450);

    if (state.complaint === "Pas assez amoureux") {
      const labelNode = screen.querySelector(".loader-label");
      labelNode.textContent = "Analyse impossible";
      await wait(620);
      labelNode.textContent = "Nouvelle tentative…";
      await wait(850);
    }
    diagnosticResult();
  }

  function diagnosticResult() {
    state.view = "diagnostic-result";
    let content;
    if (state.complaint === "Pas assez à mon service") {
      content = `
        <p class="eyebrow">Correctif système</p>
        <h2>Correctif appliqué.</h2>
        <div class="metric reveal delayed">
          <span class="metric-label">Niveau de dévouement</span>
          <div class="metric-values"><span class="metric-old">94&nbsp;%</span><span class="metric-arrow">→</span><strong class="metric-new">137&nbsp;%</strong></div>
        </div>
        <div class="result-block reveal delayed">
          <p class="result-note">Une surveillance permanente de l’utilisatrice a été activée.</p>
        </div>`;
    } else if (state.complaint === "Pas assez amoureux") {
      content = `
        <p class="eyebrow">Résultat de l’analyse</p>
        <h2>Valeur hors plage</h2>
        <div class="instrument reveal">
          <div class="instrument-line"><span>Limite instrumentale</span><strong>100&nbsp;%</strong></div>
          <div class="instrument-line"><span>Valeur estimée</span><strong class="error">ERREUR</strong></div>
        </div>
        <div class="result-block reveal delayed">
          <p class="result-note">Le niveau mesuré dépasse la capacité maximale de l’outil de diagnostic.</p>
        </div>`;
    } else {
      content = `
        <p class="eyebrow">Résultat de l’analyse</p>
        <h2>Le comportement semble conforme aux caractéristiques connues du modèle.</h2>
        <div class="result-block reveal delayed">
          <p class="result-note">Aucune anomalie de fabrication n’a été identifiée.</p>
        </div>`;
    }
    render(`
      <div class="content">${content}</div>
      <div class="spacer"></div>
      <div class="action-area">${button("Poursuivre", "continue")}</div>
    `, 40);
    bind("continue", returnScreen);
  }

  function returnScreen() {
    state.view = "return";
    render(`
      <div class="content">
        <p class="eyebrow">Options de prise en charge</p>
        <h2>Souhaitez-vous lancer une procédure de retour&nbsp;?</h2>
        <p class="body-copy">Cette action entraînera une vérification des conditions contractuelles.</p>
      </div>
      <div class="spacer"></div>
      <div class="action-area">
        ${button("Oui", "return-yes")}
        ${button("Je vais quand même le garder", "return-keep", "secondary")}
      </div>
    `, 51);
    bind("return-yes", () => returnLoading("Oui"));
    bind("return-keep", () => returnDecision("Je vais quand même le garder"));
  }

  async function returnLoading(decision) {
    state.returnDecision = decision;
    render(`
      <div class="content">
        <p class="eyebrow">Procédure de retour</p>
        <h2>Vérification des conditions de retour…</h2>
        <div class="diagnostic" role="status">
          <div><div class="scanner" aria-hidden="true"><span class="scanner-line"></span></div><p class="loader-label">Consultation du contrat</p></div>
        </div>
      </div>
    `, 56);
    await wait(1250);
    returnDecision(decision);
  }

  function returnDecision(decision) {
    state.returnDecision = decision;
    const refused = decision === "Oui";
    render(`
      <div class="content">
        <p class="eyebrow">Décision de prise en charge</p>
        <h2>${refused ? "Retour refusé." : "Décision enregistrée."}</h2>
        <p class="lead">${refused ? "Délai légal dépassé depuis longtemps." : "Le produit reste affecté à l’utilisatrice actuelle."}</p>
      </div>
      <div class="spacer"></div>
      <div class="action-area">${button("Poursuivre", "details")}</div>
    `, 60);
    bind("details", detailScreen);
  }

  function detailScreen() {
    state.view = "details";
    const list = observations.map((item, index) => `
      <li class="observation" style="animation-delay:${Math.min(index * 85, 595)}ms">
        <span class="check" aria-hidden="true"></span><span>${item}</span>
      </li>`).join("");
    render(`
      <div class="content scrollable">
        <p class="eyebrow">Diagnostic complémentaire</p>
        <h2>Le diagnostic complémentaire a relevé plusieurs particularités&nbsp;:</h2>
        <ul class="observations">${list}</ul>
        <div class="verdict">
          <p>Aucun de ces éléments ne constitue un défaut de fabrication.</p>
          <p>Ils correspondent aux spécifications connues du modèle.</p>
        </div>
        <div class="action-area">${button("Continuer", "comment")}</div>
      </div>
    `, 72, "compact");
    bind("comment", commentScreen);
  }

  function commentScreen() {
    state.view = "comment";
    render(`
      <div class="content scrollable">
        <p class="eyebrow">Note au dossier</p>
        <h2>Souhaitez-vous ajouter un commentaire au dossier&nbsp;?</h2>
        <label class="field-label" for="comment">Commentaire facultatif</label>
        <textarea id="comment" name="comment" maxlength="2000" placeholder="Décrivez ici tout autre comportement problématique…" autocomplete="off"></textarea>
        <p class="form-status" id="form-status" role="status"></p>
        <div class="action-area">
          ${button("Ajouter au dossier", "submit-comment")}
          ${button("Continuer sans commentaire", "skip-comment", "text")}
        </div>
      </div>
    `, 82, "compact");
    bind("submit-comment", submitComment);
    bind("skip-comment", () => { state.comment = ""; conclusionScreen(); });
  }

  async function submitComment() {
    const textarea = screen.querySelector("#comment");
    const status = screen.querySelector("#form-status");
    const submit = screen.querySelector('[data-action="submit-comment"]');
    const comment = textarea.value.trim();
    state.comment = comment;

    if (!comment) {
      status.textContent = "Aucun commentaire ajouté. Vous pouvez poursuivre sans commentaire.";
      textarea.focus();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Enregistrement…";
    const timestamp = new Intl.DateTimeFormat("fr-FR", {
      dateStyle: "full", timeStyle: "medium"
    }).format(new Date());

    const payload = {
      _subject: "Maison Lumi — Nouveau signalement SAV",
      _template: "table",
      _captcha: "false",
      "Motif sélectionné": state.complaint,
      "Décision concernant le retour": state.returnDecision,
      "Commentaire": comment,
      "Date / heure": timestamp,
      "Dossier": state.reference
    };

    try {
      const response = await fetch(EMAIL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Relay unavailable");
      commentConfirmation(true);
    } catch (error) {
      commentConfirmation(false);
    }
  }

  function commentConfirmation(success) {
    render(`
      <div class="content">
        <p class="eyebrow">Mise à jour du dossier</p>
        <h2>${success ? "Commentaire enregistré." : "Transmission momentanément indisponible."}</h2>
        <p class="lead">${success ? "Il sera ignoré avec toute l’attention qu’il mérite." : "Le dossier peut néanmoins poursuivre son traitement."}</p>
      </div>
      <div class="spacer"></div>
      <div class="action-area">${button("Poursuivre", "conclusion")}</div>
    `, 87);
    bind("conclusion", conclusionScreen);
  }

  async function conclusionScreen() {
    state.view = "conclusion";
    render(`
      <div class="content">
        <p class="eyebrow">Conclusion du service</p>
        <h2>Décision définitive</h2>
        <div class="official-lines">
          <p class="official-line" style="animation-delay:120ms">Aucun remplacement n’est disponible.</p>
          <p class="official-line" style="animation-delay:520ms">Aucune réparation n’est recommandée.</p>
          <p class="official-line" style="animation-delay:920ms">Le produit fonctionne malheureusement comme prévu.</p>
        </div>
      </div>
      <div class="spacer"></div>
      <div class="action-area">${button("Clôturer le dossier", "close")}</div>
    `, 94);
    const close = bind("close", endingScreen);
    close.style.opacity = "0";
    close.disabled = true;
    await wait(1400);
    close.style.opacity = "1";
    close.disabled = false;
  }

  function endingScreen() {
    state.view = "ending";
    render(`
      <div class="content">
        <div class="close-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none"><path d="m6.5 12.5 3.4 3.4 7.7-8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <p class="eyebrow">Dossier ${state.reference}</p>
        <h1>Dossier clôturé.</h1>
        <p class="ending-line">Vous allez devoir le garder.</p>
        <p class="ending-final">Il en est plutôt content.</p>
      </div>
    `, 100, "centered closing");
  }

  opening();
})();
