# Commit Checkpoint

You have built a complete working model: a $q$ array, a normalized sphere form factor,
a reusable plotting function, and a polydisperse extension. This is a natural
checkpoint — save your work before moving on.

## What to commit

Check what has changed since your last commit:

```console
$ git status
```

You should see `chapter_02_sphere.ipynb` listed as a new or modified file. Stage and
commit it:

```console
$ git add chapter_02_sphere.ipynb
$ git commit -m "add sphere form factor and polydispersity model"
$ git push
```

!!! tip "Suggested commit messages for this section"
    If you built your notebook incrementally and want to commit at finer granularity,
    here are specific messages that describe each logical piece:

    - `"add sphere form factor function"` — after writing `sphere_form_factor`
    - `"add log-log plotting function"` — after writing `plot_form_factor`
    - `"add polydisperse sphere model"` — after writing `polydisperse_sphere`

    Any of these is better than a vague message like `"update notebook"`.

## Keeping Jupyter checkpoints out of Git

Jupyter automatically saves checkpoint files in a hidden `.ipynb_checkpoints/` folder.
These are not useful to track and clutter the repository. If you did not include this
in your `.gitignore` earlier, add it now:

```
.ipynb_checkpoints/
```

Then commit the updated `.gitignore`:

```console
$ git add .gitignore
$ git commit -m "add jupyter checkpoint folder to gitignore"
$ git push
```

## What you have built

After this section your notebook contains:

| Function | What it does |
|---|---|
| `sphere_form_factor(q, R)` | Computes $P(q, R)$ for a solid sphere |
| `plot_form_factor(q, P, ...)` | Plots a form factor on log-log axes with standard formatting |
| `polydisperse_sphere(q, R_mean, sigma_R)` | Averages $P(q, R)$ over a Gaussian size distribution |

These functions will be reused and extended throughout Section 4.

---

**What's next:** [Section 3 →](../section3-fitting/index.md) — fitting scattering models to data using least-squares optimization and extracting parameter uncertainties.
