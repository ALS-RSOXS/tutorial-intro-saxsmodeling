# Tutorial Plan: Simulating X-ray Scattering — A Practical Introduction

## Overview

This document describes the structure, formatting conventions, and content approach for
building the SAXS modeling tutorial as an MkDocs website hosted on GitHub Pages using
the `mkdocs-rsoxs` theme. It also tracks what has been built and what remains.

**Repository:** `ALS-RSOXS/tutorial-intro-saxsmodeling`  
**Theme:** `mkdocs-rsoxs` (installed from PyPI via `pyproject.toml`)  
**Site:** Deployed to `https://als-rsoxs.github.io/tutorial-intro-saxsmodeling/` via GitHub Actions (`docs.yml`)

---

## Audience

Undergraduate students and researchers early in their PhD program. Assumed background:

- Algebra and introductory calculus
- Some programming exposure (any language) is helpful but not required
- No prior experience with scattering physics, Git, or Python scientific computing

The tone should be direct and encouraging — treat the reader as intelligent but new to
these specific tools and concepts. Avoid jargon without definition. Each new term should
be bolded on first use and explained in plain language before or immediately after.

---

## Pedagogical Approach

- **Full working code is shown on every page.** The student is expected to open VS Code,
  create a new Jupyter notebook for each section, and type (or adapt) the code themselves
  as they read. Code blocks are reference material, not copy-paste targets.
- **Exercises** appear throughout. Solutions are hidden on the same page in a collapsible
  block using `pymdownx.details`. Students should attempt each exercise before expanding.
- **No derivations.** Mathematical formulas are presented with physical intuition and
  described in terms of what each term represents. The goal is to build working models,
  not to derive them from first principles.
- **Git commits are woven in** at natural checkpoints — not as an afterthought. Each
  section ends with a commit prompt using a suggested commit message.
- **Units:** All scattering vectors use inverse angstroms (Å⁻¹). A callout box in
  Section 2 acknowledges that inverse nanometers (nm⁻¹) are also common and explains
  the conversion.

---

## Build Status

### Completed

| File | Status | Notes |
|---|---|---|
| `mkdocs.yml` | ✅ | Finalized with `ALS-RSOXS` URLs; `show_stargazers: true` |
| `pyproject.toml` | ✅ | `mkdocs`, `mkdocs-rsoxs`, `pymdown-extensions`, `mkdocstrings-python` as project dependencies; `requires-python = ">=3.13"` |
| `uv.lock` | ✅ | Committed for reproducible CI builds |
| `Makefile` | ✅ | `make install`, `make docs`, `make docs-serve`, `make clean` |
| `.github/workflows/docs.yml` | ✅ | Builds with `uv sync` + `mkdocs build`, deploys via `actions/deploy-pages` |
| `docs/index.md` | ✅ | Landing page with section overview table |
| `docs/javascripts/katex.js` | ✅ | KaTeX auto-render initialization |
| **Section 1** (7 pages + appendix) | ✅ | See detail below |
| **Section 2** (8 pages) | ✅ | See detail below |
| **Section 3** (3 pages + index) | ✅ | Fitting data — inserted between Sections 2 and 4 |
| **Section 4** (4 pages + index) | ✅ | Shell models — renumbered from old Section 3 |
| **Section 5** (5 pages + index) | ✅ | Gaussian bilayer profiles — renumbered from old Section 4 |
| `docs/appendix/exercise-solutions.md` | ✅ | Stub — directs readers to in-page collapsible solutions |

### Pending

| Item | Notes |
|---|---|
| Landing page "destination image" | A vesicle scattering curve figure on `docs/index.md` would motivate the reader |
| Python code block CSS styling | Theme CSS to be updated in `mkdocs-rsoxs` separately; console blocks already use `console` language tag with `$` prefix |

---

## Site Structure

```
docs/
├── index.md                       ✅
├── javascripts/
│   └── katex.js                   ✅
├── section1-setup/
│   ├── index.md                   ✅
│   ├── 1-why-python.md            ✅
│   ├── 2-installing-uv.md         ✅
│   ├── 3-virtual-environments.md  ✅
│   ├── 4-git-github.md            ✅
│   ├── 5-ssh-keys.md              ✅
│   ├── 6-vscode-jupyter.md        ✅
│   └── 7-first-commit.md          ✅
├── section2-sphere/
│   ├── index.md                   ✅
│   ├── 1-what-is-saxs.md          ✅
│   ├── 2-scattering-length-density.md  ✅  (includes complex SLD / optical constants section)
│   ├── 3-sphere-form-factor.md    ✅
│   ├── 4-q-vectors-numpy.md       ✅
│   ├── 5-plotting-loglog.md       ✅
│   ├── 6-effect-of-size.md        ✅
│   ├── 7-polydispersity.md        ✅
│   └── 8-commit-checkpoint.md     ✅
├── section3-fitting/
│   ├── index.md                       ✅
│   ├── 1-chi-squared.md               ✅
│   ├── 2-interpreting-results.md      ✅
│   └── 3-fitting-saxs.md              ✅
├── section4-shells/
│   ├── index.md                   ✅
│   ├── 1-core-shell-model.md      ✅
│   ├── 2-multiple-shells.md       ✅
│   ├── 3-hollow-sphere.md         ✅
│   └── 4-vesicle-connection.md    ✅
├── section5-gaussian/
│   ├── index.md                       ✅
│   ├── 1-why-gaussian.md              ✅
│   ├── 2-building-the-profile.md      ✅
│   ├── 3-form-factor-from-profile.md  ✅
│   ├── 4-comparing-to-shell-model.md  ✅
│   └── 5-asymmetric-bilayer.md        ✅
└── appendix/
    ├── remote-ssh.md              ✅
    └── exercise-solutions.md      ✅  (stub — solutions are in-page)
```

---

## Section Content Detail

### Section 1: Installing Necessary Software ✅

**Goal:** Student has a working Python environment, a GitHub account with SSH auth,
VS Code with Jupyter running, and has made their first commit.

Each page is short — one topic, one action, one checkpoint.

| Page | Key content | Code shown |
|---|---|---|
| `1-why-python.md` | Motivation, ecosystem overview, preview of destination | None |
| `2-installing-uv.md` | Install uv, verify with `uv --version` | Bash / PowerShell tabs |
| `3-virtual-environments.md` | What a venv is, `uv init`, `uv add numpy scipy matplotlib jupyterlab`, verify | Bash |
| `4-git-github.md` | Why version control, installing Git, creating GitHub account, `git config` | Bash (OS tabs) |
| `5-ssh-keys.md` | Key pair generation, add public key to GitHub, test connection | Bash / PowerShell tabs |
| `6-vscode-jupyter.md` | VS Code install, extensions, interpreter selection, notebook anatomy, hello world + sine wave exercise | Python |
| `7-first-commit.md` | Link to GitHub, `git init` / `remote add` / `push -u`, `.gitignore`, commit frequency philosophy | Bash |

**Appendix A (remote-ssh.md):** SSH connection, VS Code Remote-SSH, `scp` file
transfer, port-forwarded JupyterLab, `tmux`. Referenced from Section 1 overview;
readers are told not to read until instructed.

---

### Section 2: Building Mathematical Models ✅

**Goal:** Student can generate a q-vector array, compute and plot the sphere form
factor, understand what changing the radius does, and implement a polydisperse model.
Pages are longer and more integrated than Section 1.

Student notebook: `chapter_02_sphere.ipynb`

| Page | Key content | Notable elements |
|---|---|---|
| `1-what-is-saxs.md` | The experiment, defining $q$, Mermaid diagram, form factor vs structure factor, units callout (Å⁻¹ vs nm⁻¹) | Mermaid diagram, KaTeX |
| `2-scattering-length-density.md` | SLD ($\rho$), contrast $\Delta\rho$, SLD table, Python representation. **Added section:** complex SLD near absorption edges, atomic scattering factor $f_0 + f' + if''$, complex index of refraction $n = 1 - \delta + i\beta$, conversion formulas and Python utility functions, RSOXS tip box | Concept box, advanced-material note box, Python conversion functions |
| `3-sphere-form-factor.md` | $P(q,R)$ formula, physical intuition, amplitude vs intensity concept box, first minimum ≈ 4.5/R, Guinier tip box, Porod region table, forward reference to $S(q)$ | KaTeX, concept box |
| `4-q-vectors-numpy.md` | `np.logspace` motivation, `sphere_form_factor` with `np.where` for $q=0$, units info box, exercise on first minimum | Code annotations, info callout |
| `5-plotting-loglog.md` | Linear vs log-log side-by-side, `plot_form_factor` helper, Porod law overlay exercise | Code annotations |
| `6-effect-of-size.md` | Overlay for 4 radii, first minimum markers, mystery curve exercise (hidden R = 75 Å) | Exercise with collapsible solution |
| `7-polydispersity.md` | Schulz-Zimm distribution (motivation: right-skewed, $R>0$, physically correct for biological materials), formula, $z \leftrightarrow p$ relation, $R^6$ weighting, `polydisperse_sphere` via `scipy.stats.gamma`, Schulz-Zimm vs Gaussian shape comparison plot, oscillation washing | KaTeX, code annotations, exercises including Gaussian comparison |
| `8-commit-checkpoint.md` | Git reinforcement, `.ipynb_checkpoints` in `.gitignore`, summary table of functions built | Short page |

**Functions built in Section 2:**
- `sphere_amplitude(q, R)` — unsquared amplitude $F(q, R)$
- `sphere_form_factor(q, R)` — normalized $P(q, R) = F^2$
- `plot_form_factor(q, P, ...)` — log-log plot with standard formatting
- `polydisperse_sphere(q, R_mean, sigma_R)` — Gaussian polydisperse average
- `wavelength_from_energy(energy_eV)` — $\lambda = hc/E$
- `sld_from_optical_constants(delta, beta, energy_eV)` — unit conversion
- `optical_constants_from_sld(rho_real, rho_imag, energy_eV)` — inverse conversion

---

### Section 3: Fitting Data ✅

**Goal:** Introduce least-squares fitting with `scipy.optimize.curve_fit`. Build
intuition on a simple line model, then apply log-scale-weighted fitting to a
polydisperse sphere scattering curve. Extract parameter uncertainties, confidence
bands, and correlation matrices throughout.

Student notebook: `chapter_03_fitting.ipynb`

| Page | Key content | Notable elements |
|---|---|---|
| `1-chi-squared.md` | Chi-squared definition, reduced chi-squared, fake line data with Gaussian noise, `curve_fit` mechanics, `absolute_sigma=True`, parameter extraction from covariance diagonal | Concept box, code annotations, exercises on noise level and data density |
| `2-interpreting-results.md` | Covariance matrix structure, converting to correlation matrix, Monte Carlo confidence band (68%) via `multivariate_normal` sampling, `plt.imshow` correlation heatmap, warning on high correlation | Two plots (band + heatmap), exercises on data centring and band width |
| `3-fitting-saxs.md` | Why log-scale weighting is needed, log-normal noise generation, `sigma = I * epsilon` for Option B weighting, three-parameter `saxs_sphere_model`, `bounds` and `maxfev`, confidence band on log-log axes, SAXS correlation matrix, exercises on initial guesses and unweighted fitting | Key concept box on relative errors, four exercises |

**Functions introduced in Section 3:**
- `line_model(x, m, b)` — straight line for introductory fit
- `saxs_sphere_model(q, R_mean, sigma_R, scale)` — wraps `polydisperse_sphere` with a scale factor

**Key scipy tools used:**
- `scipy.optimize.curve_fit` — nonlinear least-squares fitting
- `numpy.random.default_rng.multivariate_normal` — Monte Carlo confidence band sampling

---

### Section 4: Adding Shells to the Model ✅

**Goal:** Student understands the core-shell form factor, generalizes to multiple
shells, discovers the hollow sphere by setting ρ_core = ρ_matrix, and connects this
to the physics of lipid vesicles.

Student notebook: `chapter_04_shells.ipynb`

| Page | Key content | Notable elements |
|---|---|---|
| `1-core-shell-model.md` | Amplitude-before-squaring rule (concept box), core-shell amplitude formula with physical reading of each term, `sphere_amplitude` and `core_shell_form_factor` implementations, limiting case exercises | Concept box for amplitude vs intensity |
| `2-multiple-shells.md` | General N-shell amplitude as a loop over contrast steps, `multi_shell_form_factor`, numerical verification against core-shell function, three-shell example and exercises | Annotated loop code |
| `3-hollow-sphere.md` | Guided discovery: set `rho_core = rho_matrix`, side-by-side comparison with solid sphere and filled shell, varying shell thickness, limiting case exercises | Discovery-oriented structure |
| `4-vesicle-connection.md` | Bilayer anatomy (headgroup / chains / headgroup), vesicle simulation with realistic parameters, reading R and t from the curve, three-layer bilayer exercise, forward references to polydispersity / asymmetry / structure factor / Gaussian profiles, final commit prompt | Concept box, table of bilayer SLD parameters |

**Functions built in Section 4:**
- `core_shell_form_factor(q, R_core, t_shell, rho_core, rho_shell, rho_matrix)`
- `multi_shell_form_factor(q, radii, slds, rho_matrix)` — general N-shell model

---

### Section 5: Gaussian Bilayer Profiles ✅

**Goal:** Replace the sharp-interface shell model with a continuous Gaussian electron
density profile. Build a symmetric POPC bilayer model, compute its form factor
numerically via spherical Fourier transform, compare to the shell model, and extend
to an asymmetric bilayer with independent leaflet parameters.

**Reference lipid:** POPC at 25°C ($d_{HH} = 37.1$ Å, $\sigma_H = 3.0$ Å,
$\sigma_C = 5.5$ Å)

Student notebook: `chapter_05_gaussian_bilayer.ipynb`

| Page | Key content | Notable elements |
|---|---|---|
| `1-why-gaussian.md` | Three physical causes of smooth interfaces (thermal fluctuations, water penetration, undulations), three failure modes of shell model, literature context (Brzustowicz & Brunger 2005, Kučerka 2011) | No code — conceptual foundation |
| `2-building-the-profile.md` | Symmetric three-Gaussian formula, POPC parameter table, `bilayer_electron_density` function, full profile plot plus component-by-component visualization, exercises on broadening each term | Code annotations, exercise with collapsible solution |
| `3-form-factor-from-profile.md` | Spherical Fourier transform integral, `vesicle_form_factor_gaussian` with `np.trapz` loop, analytical $F(0)$ normalization, radial grid resolution discussion | Info callout on grid resolution, timing exercise |
| `4-comparing-to-shell-model.md` | Side-by-side overlay for same POPC geometry, convergence as $\sigma \to 0$, divergence above $q \approx 0.4$ Å$^{-1}$, conceptual exercise on required $q_{\max}$ for each model | Two overlay plots, four exercises |
| `5-asymmetric-bilayer.md` | Curvature argument (outer leaflet 28% more area), Brzustowicz & Brunger structural disorder finding, `asymmetric_bilayer_electron_density` and `asymmetric_vesicle_form_factor`, symmetric vs asymmetric profile comparison, exercises on detecting asymmetry from data quality | Two functions, concept box, exercises on SNR requirements |

**Functions built in Section 5:**
- `bilayer_electron_density(r, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water)`
- `vesicle_form_factor_gaussian(q, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water, n_points=2000)`
- `asymmetric_bilayer_electron_density(r, R, d_HH, sigma_H_out, A_H_out, sigma_H_in, A_H_in, sigma_C, A_C, rho_water)`
- `asymmetric_vesicle_form_factor(q, R, d_HH, sigma_H_out, A_H_out, sigma_H_in, A_H_in, sigma_C, A_C, rho_water, n_points=2000)`

---

## Formatting Conventions

### Admonition boxes

| Purpose | Admonition type |
|---|---|
| Key concept / definition | `!!! note "Key Concept: ..."` |
| Aside / clarification | `!!! tip` |
| Potential mistake / gotcha | `!!! warning` |
| Exercise | `!!! example "Try It Yourself"` |
| Brief inline callout | `!!! info` |

### Collapsible exercise solutions

```markdown
??? success "Solution"
    Solution content here. Collapsed by default.
```

### OS-specific terminal commands

```markdown
=== "macOS / Linux"
    ```bash
    command here
    ```

=== "Windows (PowerShell)"
    ```powershell
    command here
    ```
```

### Math

KaTeX via `pymdownx.arithmatex` with `generic: true`. Inline: `$...$`. Display: `$$...$$`.

### Code annotations

```python
q = np.logspace(-3, 0, 500)  # (1)
```
```
1. Explanation of why this line works this way.
```

### Notebook naming convention

| Section | Notebook |
|---|---|
| Section 1 | `chapter_01_hello.ipynb` |
| Section 2 | `chapter_02_sphere.ipynb` |
| Section 3 | `chapter_03_fitting.ipynb` |
| Section 4 | `chapter_04_shells.ipynb` |
| Section 5 | `chapter_05_gaussian_bilayer.ipynb` |

**Additional formatting applied across all sections:**
- All shell/terminal command blocks use `console` language tag with `$` prefix on command lines
- Git checkpoint `!!! tip` boxes added to all pages that introduce new code
- Suggested commit messages provided at each checkpoint

---

---

## Writing Style Notes

- Use **bold** for new terms on first use.
- Prefer short sentences and short paragraphs. One idea per paragraph.
- Display equations (`$$`) when the equation is the main point; inline (`$...$`) when
  referenced within a sentence.
- Code variable names match mathematical symbols: `R` for radius, `rho_core` for
  $\rho_c$, `q` for $q$.
- Never say "simply" or "just."
- End every page with a "What's next" sentence linking to the following page.

---

## Build and Deployment

The site is live and deploying automatically. Configuration is complete.

### Local development

```console
$ make install    # uv sync — installs all dependencies
$ make docs-serve # uv run mkdocs serve — live preview at http://localhost:8000
$ make docs       # uv run mkdocs build — builds static site into site/
$ make clean      # removes site/ directory
```

### CI/CD

Every push to `main` triggers `.github/workflows/docs.yml`:
1. Checks out repo with `fetch-depth: 0` (required by gitpython in theme)
2. Installs uv and Python 3.13
3. Runs `uv sync` (reads `uv.lock` for reproducibility; cached by `setup-uv`)
4. Runs `uv run mkdocs build`
5. Uploads `site/` as a Pages artifact and deploys via `actions/deploy-pages`

### Known open items

- **Landing page figure** — `docs/index.md` would benefit from a vesicle scattering
  curve image to motivate the reader before they begin
- **Python code block styling** — `console` blocks are visually distinct from
  `python` blocks via the theme's Pygments highlighting; further CSS differentiation
  (e.g. dark terminal background for console) is planned as a theme update in
  `mkdocs-rsoxs`
