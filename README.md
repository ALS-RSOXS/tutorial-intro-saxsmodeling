# Simulating X-ray Scattering: A Practical Introduction

A tutorial guide for undergraduate students and researchers early in their PhD programs
who want to build practical computational skills while learning the physics of X-ray
scattering from soft-matter systems.

The tutorial is written as a **MkDocs website** using the `mkdocs-rsoxs` theme and is
intended to be hosted on GitHub Pages. All content lives in the `docs/` folder.

---

## What this tutorial covers

The tutorial is organized into three sections that build on each other, plus an
appendix:

### Section 1 — Setting Up Your Scientific Computing Environment

Covers all software and tooling setup needed before writing any science code. By the
end, the reader has a working Python environment, a GitHub account connected via SSH,
VS Code running Jupyter notebooks, and their first notebook committed and pushed.

| Page | Topic |
|---|---|
| Why Python? | Motivation and overview of the scientific Python ecosystem |
| Installing uv | Installing the uv package manager on macOS, Linux, and Windows |
| Virtual Environments | Creating a project, `pyproject.toml`, installing NumPy/SciPy/Matplotlib/JupyterLab |
| Git and GitHub | Version control concepts, installing Git, creating a GitHub account |
| SSH Keys | Generating a key pair, adding to GitHub, testing the connection |
| VS Code and Jupyter | Installing VS Code and extensions, notebook anatomy, Hello World |
| Your First Commit | Linking to GitHub, staging/committing/pushing, `.gitignore` |

**Appendix A** covers remote computing via SSH, `scp` file transfer, port-forwarded
JupyterLab, and `tmux` session management. Readers are directed here when needed.

---

### Section 2 — Building Mathematical Models

Introduces X-ray scattering from first principles and builds a complete Python model
of scattering from a sphere. The student notebook for this section is
`chapter_02_sphere.ipynb`.

| Page | Topic |
|---|---|
| What is SAXS? | The experiment, defining $q$, form factor vs structure factor, units |
| Scattering Length Density | SLD ($\rho$), contrast $\Delta\rho$, typical values, complex SLD and the optical index of refraction for resonant/anomalous scattering |
| The Sphere Form Factor | $P(q, R)$ formula and physical intuition, amplitude vs intensity, Guinier aside, Porod law |
| q-Vectors in NumPy | `np.logspace`, the $q=0$ singularity, `sphere_form_factor` implementation |
| Plotting on a Log Scale | Why log-log, matplotlib setup, reusable `plot_form_factor` helper |
| Effect of Sphere Size | Overlaying curves for multiple radii, first minimum rule, mystery curve exercise |
| Polydispersity | Gaussian size distribution, $R^6$ weighting, `polydisperse_sphere` via numerical integration |
| Commit Checkpoint | Git reinforcement, summary of functions built |

**Functions built in Section 2:**
- `sphere_amplitude(q, R)` — unsquared scattering amplitude
- `sphere_form_factor(q, R)` — normalized form factor $P(q, R)$
- `plot_form_factor(q, P, ...)` — log-log plot helper
- `polydisperse_sphere(q, R_mean, sigma_R)` — Gaussian polydisperse average
- `sld_from_optical_constants(delta, beta, energy_eV)` — unit conversion utility
- `optical_constants_from_sld(rho_real, rho_imag, energy_eV)` — inverse conversion

---

### Section 3 — Adding Shells to the Model

Extends the sphere model to concentric shells, derives the general multi-shell form
factor, and connects the hollow sphere geometry to the physics of lipid vesicles. The
student notebook for this section is `chapter_03_shells.ipynb`.

| Page | Topic |
|---|---|
| Core-Shell Sphere | Amplitude-before-squaring rule, core-shell formula, `core_shell_form_factor` |
| Multiple Shells | General N-shell model, `multi_shell_form_factor` with loop implementation |
| The Hollow Sphere | Guided discovery of what happens when $\rho_\text{core} = \rho_\text{matrix}$ |
| Connection to Vesicles | Lipid bilayer structure, vesicle simulation, three-layer bilayer model, forward references |

**Functions built in Section 3:**
- `core_shell_form_factor(q, R_core, t_shell, rho_core, rho_shell, rho_matrix)`
- `multi_shell_form_factor(q, radii, slds, rho_matrix)` — general N-shell model

---

## Repository structure

```
tutorial-intro-saxsmodeling/
├── README.md                   # this file
├── PLAN.md                     # detailed implementation plan and formatting guide
├── mkdocs.yml                  # MkDocs site configuration (site_url TBD)
├── context/                    # source manuscripts and reference PDFs
│   ├── LipidSAXS.pdf
│   ├── SimpleVesicleModels.pdf
│   ├── AreVesiclesUnilamellar.pdf
│   ├── saxs_tutorial_section1.pdf
│   └── saxs_tutorial_section1.tex  # original LaTeX draft (Section 1 only)
└── docs/                       # all tutorial content (MkDocs source)
    ├── index.md
    ├── javascripts/
    │   └── katex.js            # KaTeX math rendering initialization
    ├── section1-setup/
    ├── section2-sphere/
    ├── section3-shells/
    └── appendix/
```

---

## Building and previewing the site locally

The site uses the `mkdocs-rsoxs` theme, which must be installed as a local dependency.
Once the site configuration (`site_url`, `repo_url`) is finalized:

```bash
# From the repository root
uv add mkdocs
uv run mkdocs serve
```

Open `http://localhost:8000` in your browser to preview the site.

To build a static copy:

```bash
uv run mkdocs build
```

---

## Status

| Section | Content | Nav | Notes |
|---|---|---|---|
| Section 1 | Complete | ✓ | All 7 pages + appendix written |
| Section 2 | Complete | ✓ | All 8 pages written |
| Section 3 | Complete | ✓ | All 4 pages written |
| `mkdocs.yml` | Draft | — | `site_url` and `repo_url` need final values |
| GitHub Pages | Not deployed | — | Pending site config finalization |

---

## Audience and prerequisites

- Undergraduate students and researchers early in their PhD programs
- No prior experience with scattering physics, Python, or version control assumed
- Working knowledge of algebra and basic calculus helpful
- All sections build on the previous; work through in order
