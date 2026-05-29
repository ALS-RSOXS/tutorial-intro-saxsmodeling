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
| **Section 3** (4 pages) | ✅ | See detail below |
| **Section 4** (5 pages + index) | ✅ | See detail below |
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
├── section3-shells/
│   ├── index.md                   ✅
│   ├── 1-core-shell-model.md      ✅
│   ├── 2-multiple-shells.md       ✅
│   ├── 3-hollow-sphere.md         ✅
│   └── 4-vesicle-connection.md    ✅
├── section4-gaussian/
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

### Section 3: Adding Shells to the Model ✅

**Goal:** Student understands the core-shell form factor, generalizes to multiple
shells, discovers the hollow sphere by setting ρ_core = ρ_matrix, and connects this
to the physics of lipid vesicles.

Student notebook: `chapter_03_shells.ipynb`

| Page | Key content | Notable elements |
|---|---|---|
| `1-core-shell-model.md` | Amplitude-before-squaring rule (concept box), core-shell amplitude formula with physical reading of each term, `sphere_amplitude` and `core_shell_form_factor` implementations, limiting case exercises | Concept box for amplitude vs intensity |
| `2-multiple-shells.md` | General N-shell amplitude as a loop over contrast steps, `multi_shell_form_factor`, numerical verification against core-shell function, three-shell example and exercises | Annotated loop code |
| `3-hollow-sphere.md` | Guided discovery: set `rho_core = rho_matrix`, side-by-side comparison with solid sphere and filled shell, varying shell thickness, limiting case exercises | Discovery-oriented structure |
| `4-vesicle-connection.md` | Bilayer anatomy (headgroup / chains / headgroup), vesicle simulation with realistic parameters, reading R and t from the curve, three-layer bilayer exercise, forward references to polydispersity / asymmetry / structure factor / Gaussian profiles, final commit prompt | Concept box, table of bilayer SLD parameters |

**Functions built in Section 3:**
- `core_shell_form_factor(q, R_core, t_shell, rho_core, rho_shell, rho_matrix)`
- `multi_shell_form_factor(q, radii, slds, rho_matrix)` — general N-shell model

---

### Section 4: Gaussian Bilayer Profiles ✅

**Goal:** Replace the sharp-interface shell model with a continuous Gaussian electron
density profile. Build a symmetric POPC bilayer model, compute its form factor
numerically via spherical Fourier transform, compare to the shell model, and extend
to an asymmetric bilayer with independent leaflet parameters.

**Reference lipid:** POPC at 25°C ($d_{HH} = 37.1$ Å, $\sigma_H = 3.0$ Å,
$\sigma_C = 5.5$ Å)

Student notebook: `chapter_04_gaussian_bilayer.ipynb`

| Page | Key content | Notable elements |
|---|---|---|
| `1-why-gaussian.md` | Three physical causes of smooth interfaces (thermal fluctuations, water penetration, undulations), three failure modes of shell model, literature context (Brzustowicz & Brunger 2005, Kučerka 2011) | No code — conceptual foundation |
| `2-building-the-profile.md` | Symmetric three-Gaussian formula, POPC parameter table, `bilayer_electron_density` function, full profile plot plus component-by-component visualization, exercises on broadening each term | Code annotations, exercise with collapsible solution |
| `3-form-factor-from-profile.md` | Spherical Fourier transform integral, `vesicle_form_factor_gaussian` with `np.trapz` loop, analytical $F(0)$ normalization, radial grid resolution discussion | Info callout on grid resolution, timing exercise |
| `4-comparing-to-shell-model.md` | Side-by-side overlay for same POPC geometry, convergence as $\sigma \to 0$, divergence above $q \approx 0.4$ Å$^{-1}$, conceptual exercise on required $q_{\max}$ for each model | Two overlay plots, four exercises |
| `5-asymmetric-bilayer.md` | Curvature argument (outer leaflet 28% more area), Brzustowicz & Brunger structural disorder finding, `asymmetric_bilayer_electron_density` and `asymmetric_vesicle_form_factor`, symmetric vs asymmetric profile comparison, exercises on detecting asymmetry from data quality | Two functions, concept box, exercises on SNR requirements |

**Functions built in Section 4:**
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
| Section 3 | `chapter_03_shells.ipynb` |
| Section 4 | `chapter_04_gaussian_bilayer.ipynb` |

**Additional formatting applied across all sections:**
- All shell/terminal command blocks use `console` language tag with `$` prefix on command lines
- Git checkpoint `!!! tip` boxes added to all pages that introduce new code
- Suggested commit messages provided at each checkpoint

---

### Section 4: Gaussian Bilayer Profiles ⬜ Not yet written

**Goal:** Introduce the Gaussian electron density profile as a physically motivated
alternative to the sharp-interface shell model. Build a symmetric POPC bilayer model,
compute its form factor numerically, compare it to the three-shell model, and then
extend it to an asymmetric bilayer to capture real membrane physics. The student
notebook for this section is `chapter_04_gaussian_bilayer.ipynb`.

**Reference lipid system throughout:** POPC (1-palmitoyl-2-oleoyl-sn-glycero-3-
phosphocholine) at 25°C.

**POPC starting parameters:**

| Parameter | Symbol | Value | Notes |
|---|---|---|---|
| Head-to-head distance | $d_{HH}$ | 37.1 Å | Kučerka et al. 2011 |
| Headgroup width (symmetric) | $\sigma_H$ | 3.0 Å | Outer and inner equal |
| Chain region width | $\sigma_C$ | 5.5 Å | |
| Headgroup amplitude | $A_H$ | positive | Headgroups denser than water |
| Chain amplitude | $A_C$ | negative | Chains less dense than water |
| Vesicle outer radius | $R$ | 300 Å | Representative LUV |

**POPC asymmetric parameters (page 5):**

| Parameter | Outer leaflet | Inner leaflet | Notes |
|---|---|---|---|
| Headgroup width $\sigma_H$ | 3.0 Å | 4.5 Å | Inner is rougher (Brzustowicz & Brunger 2005) |
| Headgroup amplitude $A_H$ | reference | slightly lower | Inner slightly less ordered |

#### Motivation: why Gaussian profiles?

The three-shell model of a bilayer (headgroup / chains / headgroup) assumes perfectly
sharp interfaces — the electron density jumps instantly from one value to the next at
each boundary. This is an approximation. In a real membrane:

- **Thermal fluctuations** cause individual lipid molecules to move in and out of
  registry, blurring the interface over ~5–10 Å
- **The headgroup–water interface** is chemically diffuse: water penetrates into the
  headgroup region and the boundary is a gradient, not a step
- **Undulations** of the whole bilayer surface add further apparent broadening when
  averaged over the illuminated volume

The Gaussian model captures this physical reality by representing each structural
region — headgroups and hydrocarbon chains — as a Gaussian function of the radial
coordinate rather than a rectangular slab. This approach:

- Reproduces experimental data more faithfully at higher $q$ where oscillations are
  sensitive to interface sharpness
- Reduces the number of parameters compared to adding more sharp shells to approximate
  a smooth profile
- Is directly comparable to results from X-ray reflectometry and molecular dynamics
  simulations, where the electron density profile is the primary output
- Has an established literature precedent — it is the model used by Brzustowicz &
  Brunger (2005) and forms the basis of widely used analysis software

#### Page structure

| Page | Status | Key content |
|---|---|---|
| `1-why-gaussian.md` | ✅ | Sharp vs smooth interfaces, physical motivation, literature context, preview of what the Gaussian model can and cannot do |
| `2-building-the-profile.md` | ✅ | Symmetric POPC bilayer as three Gaussians, parameter definitions, `bilayer_electron_density`, profile visualization overlaid on three-shell step function |
| `3-form-factor-from-profile.md` | ✅ | Spherical Fourier transform integral, `vesicle_form_factor_gaussian`, radial grid discussion |
| `4-comparing-to-shell-model.md` | ✅ | Side-by-side Gaussian vs three-shell, convergence at narrow widths, divergence at high $q$, conceptual exercise on required $q$ range |
| `5-asymmetric-bilayer.md` | ✅ | Physical motivation for leaflet asymmetry (curvature, composition, Brzustowicz finding), `asymmetric_bilayer_electron_density` with separate outer/inner headgroup parameters, comparison to symmetric model, POPC asymmetry exercise |

#### Content detail

**Page 1 — Why Gaussian profiles?**

- Open with a physical picture: a bilayer is not a stack of uniform slabs, it is a
  continuously varying electron density profile
- Schematic of the headgroup-chain-headgroup structure with smooth transitions
- Three regimes where the step model breaks down:
  (a) high-$q$ oscillation amplitude over-predicted by sharp interfaces,
  (b) fitting real data where interface roughness is a free parameter,
  (c) comparing to MD simulations which output continuous profiles
- Brief mention of published Gaussian bilayer models and why they are standard in the
  field (Brzustowicz & Brunger 2005, Pabst et al., Kučerka et al.)
- Note that the Gaussian model still uses the same amplitude-before-squaring rule from
  Section 3

**Page 2 — Building the electron density profile**

The symmetric bilayer model uses three Gaussian components:

$$\rho(r) = \rho_w + A_H \left[\exp\!\left(-\frac{(r - r_H^{\text{out}})^2}{2\sigma_H^2}\right) + \exp\!\left(-\frac{(r - r_H^{\text{in}})^2}{2\sigma_H^2}\right)\right] - A_C\,\exp\!\left(-\frac{(r - r_C)^2}{2\sigma_C^2}\right)$$

where:
- $\rho_w$ — water SLD ($9.47 \times 10^{-6}$ Å$^{-2}$)
- $A_H$, $\sigma_H$ — headgroup amplitude and width (same for both leaflets)
- $r_H^{\text{out}} = R$ — outer headgroup position
- $r_H^{\text{in}} = R - d_{HH}$ — inner headgroup position
- $A_C$, $\sigma_C$ — chain amplitude (negative) and width
- $r_C = R - d_{HH}/2$ — bilayer midplane

Use POPC starting parameters: $d_{HH} = 37.1$ Å, $\sigma_H = 3.0$ Å, $\sigma_C = 5.5$ Å.

Python: implement `bilayer_electron_density(r, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water)`.
Plot $\rho(r)$ vs $r$, label each Gaussian component, and overlay the step-function
profile from the three-shell model.

**Page 3 — From profile to form factor**

$$F(q) = \frac{4\pi}{q} \int_0^\infty \left[\rho(r) - \rho_w\right] r \sin(qr)\, \mathrm{d}r$$

Numerical evaluation with `np.trapz`. Sketch of the `vesicle_form_factor_gaussian`
function (same signature pattern as symmetric model). Discuss radial grid resolution:
`n_points=2000` is a reasonable default. Code annotations on the loop.

**Page 4 — Comparing to the shell model**

Main exercise: generate both the Gaussian form factor and the three-shell form factor
for the same nominal POPC bilayer geometry, overlay on log-log axes.

Expected result: models agree at small/intermediate $q$; diverge at high $q$ where
the Gaussian's $\exp(-q^2\sigma^2/2)$ envelope damps the oscillations below what
the sharp-interface model predicts.

Exercises:
1. Start with $\sigma_H = 1$ Å, $\sigma_C = 1$ Å — confirm convergence to shell model
2. Broaden progressively — at what width does high-$q$ diverge meaningfully?
3. Vary $A_H$ with $A_C$ fixed — what changes in the profile and form factor?
4. **Conceptual:** At $q_{\max} = 0.3$ Å$^{-1}$ vs $q_{\max} = 0.6$ Å$^{-1}$, which
   model is sufficient? What does this imply for experimental design?

**Page 5 — Asymmetric bilayer**

*Physical motivation:*

Real lipid bilayers are not symmetric about the midplane. Two sources of asymmetry are
relevant here:

1. **Geometric asymmetry from curvature** — in a vesicle the outer leaflet has
   greater area per lipid than the inner leaflet. This forces the outer leaflet to
   stretch slightly and the inner leaflet to compress, leading to different packing
   densities and slightly different headgroup environments.

2. **Structural disorder asymmetry** — Brzustowicz & Brunger (2005) found
   experimentally that the inner headgroup layer is measurably rougher (larger
   $\sigma_H^{\text{in}}$) than the outer layer, consistent with the inner leaflet
   being more conformationally disordered due to curvature strain.

For POPC specifically:
- Outer headgroup: $\sigma_H^{\text{out}} \approx 3.0$ Å
- Inner headgroup: $\sigma_H^{\text{in}} \approx 4.5$ Å

*The asymmetric model:*

Replace the single shared $\sigma_H$ and $A_H$ with separate parameters for each leaflet:

$$\rho(r) = \rho_w + A_H^{\text{out}} \exp\!\left(-\frac{(r - R)^2}{2(\sigma_H^{\text{out}})^2}\right) + A_H^{\text{in}} \exp\!\left(-\frac{(r - (R - d_{HH}))^2}{2(\sigma_H^{\text{in}})^2}\right) - A_C\,\exp\!\left(-\frac{(r - r_C)^2}{2\sigma_C^2}\right)$$

Python: implement `asymmetric_bilayer_electron_density(r, R, d_HH, sigma_H_out, A_H_out, sigma_H_in, A_H_in, sigma_C, A_C, rho_water)`.

*Content flow:*
1. Side-by-side profile plot: symmetric POPC vs asymmetric POPC — show the broadened
   inner headgroup peak
2. Side-by-side scattering curve: how does the asymmetry affect $P(q)$?
3. Discuss: at what $q$ does the asymmetry become detectable? (Requires high-$q$ data)
4. Exercise: starting from symmetric parameters, increase $\sigma_H^{\text{in}}$
   progressively from 3.0 to 6.0 Å and track how the scattering curve changes
5. Conceptual exercise: if you can only measure to $q = 0.4$ Å$^{-1}$, can you
   distinguish a symmetric from an asymmetric bilayer? What does this tell you about
   the data quality needed for structural refinement?

*Git checkpoint:* `"add asymmetric Gaussian bilayer model for POPC"`

#### Functions to build in Section 4

| Function | Signature |
|---|---|
| `bilayer_electron_density` | `(r, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water)` |
| `vesicle_form_factor_gaussian` | `(q, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water, n_points=2000)` |
| `asymmetric_bilayer_electron_density` | `(r, R, d_HH, sigma_H_out, A_H_out, sigma_H_in, A_H_in, sigma_C, A_C, rho_water)` |
| `asymmetric_vesicle_form_factor` | `(q, R, d_HH, sigma_H_out, A_H_out, sigma_H_in, A_H_in, sigma_C, A_C, rho_water, n_points=2000)` |

#### mkdocs.yml nav additions (when written)

```yaml
- "Section 4: Gaussian Bilayer Profiles":
  - Overview: section4-gaussian/index.md
  - Why Gaussian Profiles?: section4-gaussian/1-why-gaussian.md
  - Building the Profile: section4-gaussian/2-building-the-profile.md
  - Form Factor from a Profile: section4-gaussian/3-form-factor-from-profile.md
  - Comparing to the Shell Model: section4-gaussian/4-comparing-to-shell-model.md
  - Asymmetric Bilayer: section4-gaussian/5-asymmetric-bilayer.md
```

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
