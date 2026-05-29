# The Hollow Sphere

On the scattering length density page in Section 2, we asked: *what happens when the
core SLD equals the matrix SLD?* We said the question would come back. It has.

Work through this page in your notebook — the result is more interesting than you might
expect.

## Setting up the experiment

Set the core SLD equal to the matrix SLD and compute the form factor:

```python
R_core     = 45.0    # core radius in Å
t_shell    = 10.0    # shell thickness in Å
rho_shell  = 14.0e-6 # Å^-2
rho_matrix =  9.47e-6  # water

# The key change: core SLD = matrix SLD
rho_core   = rho_matrix

P_hollow = multi_shell_form_factor(
    q,
    radii=[R_core, R_core + t_shell],
    slds=[rho_core, rho_shell],
    rho_matrix=rho_matrix,
)
```

Now plot it alongside the equivalent solid sphere (same outer radius, same shell SLD,
but a solid core with `rho_core = rho_shell`):

```python
P_solid_sphere = sphere_amplitude(q, R_core + t_shell)**2

rho_core_solid = rho_shell  # filled core
P_filled = multi_shell_form_factor(
    q,
    radii=[R_core, R_core + t_shell],
    slds=[rho_core_solid, rho_shell],
    rho_matrix=rho_matrix,
)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_solid_sphere, label="Solid sphere", ax=ax, color="steelblue")
plot_form_factor(q, P_filled,       label="Filled shell (core = shell SLD)", ax=ax, color="seagreen")
plot_form_factor(q, P_hollow,       label="Hollow sphere (core = matrix SLD)", ax=ax, color="tomato")
ax.set_title("Hollow sphere vs filled alternatives")
plt.tight_layout()
plt.show()
```

Look carefully at the three curves. Then read on.

## What is happening physically

!!! note "Key Concept: The Hollow Sphere"
    When `rho_core = rho_matrix`, the core is indistinguishable from the surrounding
    medium. The particle that the X-rays "see" is not a filled object — it is purely
    the shell. The core volume contributes no contrast; it scatters identically to the
    matrix and therefore produces no signal.

    What remains is the scattering from a thin spherical shell: a hollow sphere.

The hollow sphere curve has a distinctly different character from a solid sphere of the
same outer radius:

- The **first peak** shifts to lower $q$ compared to the solid sphere. The dominant
  length scale is now the vesicle radius $R$, not the core radius.
- The **oscillation spacing** at high $q$ is controlled by the shell thickness $t$,
  not the overall radius. Thinner shells push these features to larger $q$.
- The curve **falls more steeply** at intermediate $q$ than a solid sphere.

## Exploring shell thickness

Compare hollow spheres with the same outer radius but different shell thicknesses:

```python
R_outer = 55.0   # fixed outer radius in Å
thicknesses = [5.0, 10.0, 20.0, 35.0]
colors = ["steelblue", "tomato", "seagreen", "darkorchid"]

fig, ax = plt.subplots(figsize=(8, 5))

for t, color in zip(thicknesses, colors):
    R_core = R_outer - t
    if R_core <= 0:
        continue
    P = multi_shell_form_factor(
        q,
        radii=[R_core, R_outer],
        slds=[rho_matrix, rho_shell],   # core = matrix
        rho_matrix=rho_matrix,
    )
    plot_form_factor(q, P, label=f"t = {t:.0f} Å", ax=ax, color=color)

ax.set_title(f"Hollow sphere: fixed R = {R_outer} Å, varying shell thickness")
plt.tight_layout()
plt.show()
```

As the shell becomes thinner, the high-$q$ oscillations shift outward. As it approaches
the full radius (a solid sphere), the curve converges toward the solid sphere limit.

!!! example "Try It Yourself"
    1. Fix the outer radius at 55 Å and the shell thickness at 10 Å. Increase
       `rho_shell` from just above `rho_matrix` to well above it. How does the
       overall intensity (proportional to $F_0^2$) change? Why?
    2. What happens to the curve if you make the shell SLD *lower* than the matrix
       SLD? Is that physically possible? (Hint: look at the SLD table from Section 2.)
    3. Confirm numerically that setting `rho_core = rho_shell` in the hollow sphere
       model gives back the solid sphere form factor.

??? success "Solution"
    **Part 1:** Increasing `rho_shell` increases the contrast $\Delta\rho =
    \rho_{\text{shell}} - \rho_{\text{matrix}}$. The normalization factor $F_0$
    grows, meaning the unnormalized intensity $\propto F_0^2$ increases quadratically
    with contrast. The *shape* of $P(q)$ does not change — it is the prefactor that
    scales.

    **Part 2:** Yes — a shell SLD below the matrix SLD is physically possible. Lipid
    hydrocarbon chains have SLD $\approx 7.0 \times 10^{-6}$ Å$^{-2}$, which is
    *lower* than water ($9.47 \times 10^{-6}$ Å$^{-2}$). The contrast is still
    non-zero; the sign of $\Delta\rho$ flips, but $(\Delta\rho)^2$ is unchanged, so
    the form factor shape is identical. Only the overall sign of the amplitude changes.

    **Part 3:**
    ```python
    R_outer = 55.0
    t = 10.0
    R_core = R_outer - t

    # Hollow model with rho_core = rho_shell (filled)
    rho_fill = 14.0e-6
    P_filled_test = multi_shell_form_factor(
        q,
        radii=[R_core, R_outer],
        slds=[rho_fill, rho_fill],
        rho_matrix=rho_matrix,
    )
    P_solid_test = sphere_amplitude(q, R_outer)**2

    print(f"Max difference: {np.max(np.abs(P_filled_test - P_solid_test)):.2e}")
    ```

    Both curves should be identical (difference at floating-point precision). Setting
    `rho_core = rho_shell` zeroes the first contrast term, leaving only the
    outermost boundary — a solid sphere of radius `R_outer` with $\Delta\rho =
    \rho_{\text{shell}} - \rho_m$.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_shells.ipynb
    $ git commit -m "explore hollow sphere geometry and vesicle approximation"
    ```

---

**What's next:** [Connection to Vesicles](4-vesicle-connection.md) — connecting the
hollow sphere model to the physical picture of a lipid bilayer membrane.
