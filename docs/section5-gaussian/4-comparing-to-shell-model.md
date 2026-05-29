# Comparing to the Shell Model

You now have two ways to compute the scattering form factor of a lipid vesicle: the
three-shell model from Section 4 and the Gaussian profile model from this section.
This page puts them side by side and examines when they agree, when they diverge, and
what that means for interpreting experimental data.

## Setting up the comparison

For a fair comparison, both models should represent the same nominal bilayer geometry.
Map the POPC Gaussian parameters onto equivalent three-shell parameters:

```python
# Gaussian model parameters (POPC)
R       = 300.0
d_HH    = 37.1
sigma_H =   3.0
sigma_C =   5.5
A_H     =  3.0e-6
A_C     =  1.2e-6
rho_water = 9.47e-6

# Equivalent three-shell parameters
# Treat each layer thickness as the FWHM of its Gaussian: FWHM = 2*sqrt(2*ln2)*sigma ~ 2.35*sigma
t_head  = 2.35 * sigma_H          # ~7 Å headgroup thickness
t_chain = d_HH - 2 * t_head       # chain region thickness
R_outer = R
R_chain_end   = R_outer - t_head
R_chain_start = R_chain_end - t_chain
R_inner       = R_chain_start - t_head

rho_head  = rho_water + A_H        # headgroup SLD
rho_chain = rho_water - A_C        # chain SLD

P_shell = multi_shell_form_factor(
    q,
    radii=[R_inner, R_chain_start, R_chain_end, R_outer],
    slds=[rho_water, rho_head, rho_chain, rho_head],
    rho_matrix=rho_water,
)

P_gauss = vesicle_form_factor_gaussian(q, R, d_HH, sigma_H, A_H, sigma_C, A_C,
                                        rho_water)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_shell, label="Three-shell model",   ax=ax, color="tomato")
plot_form_factor(q, P_gauss, label="Gaussian profile",    ax=ax, color="steelblue")
ax.set_title("Shell model vs Gaussian profile — POPC vesicle")
plt.tight_layout()
plt.show()
```

## What you should observe

The two curves agree closely at small $q$ and begin to diverge at larger $q$:

!!! note "Key Concept: Where the Models Differ"
    At small to intermediate $q$ — below roughly $q \approx 0.2$ Å$^{-1}$ for a
    typical lipid bilayer — both models predict essentially the same curve. The
    scattering at these length scales is dominated by the overall bilayer thickness and
    vesicle radius, which both models represent the same way.

    At larger $q$, the Gaussian profile predicts systematically **lower** oscillation
    amplitude than the shell model. The reason is the $\exp(-q^2\sigma^2/2)$
    **Gaussian envelope**: each interface contributes a scattering amplitude that
    decays exponentially with $q^2$. Broader interfaces (larger $\sigma$) decay faster.
    A sharp interface has $\sigma = 0$ and no decay at all — it contributes equally at
    all $q$, which is why the shell model over-predicts high-$q$ oscillations compared
    to a real membrane.

## Convergence at narrow interfaces

When $\sigma_H \to 0$ and $\sigma_C \to 0$, the Gaussian profile approaches a step
function and the two models should converge. Verify this:

```python
fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_shell, label="Three-shell model", ax=ax,
                 color="tomato", linestyle="--")

for sigma, color in [(3.0, "steelblue"), (1.0, "seagreen"), (0.3, "darkorchid")]:
    P = vesicle_form_factor_gaussian(q, R, d_HH, sigma, A_H, sigma, A_C, rho_water)
    plot_form_factor(q, P, label=rf"Gaussian $\sigma$ = {sigma} Å", ax=ax, color=color)

ax.set_title("Convergence to shell model as Gaussian widths narrow")
plt.tight_layout()
plt.show()
```

As $\sigma$ decreases from 3.0 to 0.3 Å the Gaussian curve approaches the shell
model from below, confirming that the shell model is the $\sigma \to 0$ limit of the
Gaussian model.

!!! example "Try It Yourself"
    1. At what value of $\sigma$ do the Gaussian and shell models become visually
       indistinguishable across the full $q$ range? Is this physically achievable in a
       real bilayer?
    2. Fix `sigma_H = 3.0` Å and vary only `sigma_C` between 1 and 15 Å. At which
       $q$ values does the chain width most strongly affect the curve?
    3. Set both `A_H` and `A_C` to very small values (near zero contrast). What
       happens to both curves? Does the Gaussian model degrade more gracefully than
       the shell model in the low-contrast limit?
    4. **Conceptual:** A SAXS experiment on POPC vesicles measures data up to
       $q_{\max} = 0.35$ Å$^{-1}$. Looking at your comparison plot, would you be able
       to distinguish the Gaussian model from the shell model at this $q$ range? What
       if $q_{\max} = 0.6$ Å$^{-1}$?

??? success "Solution"
    **Part 1:** The curves become indistinguishable by eye around $\sigma \approx
    0.5$ Å. This is far narrower than any real fluid-phase lipid bilayer (where
    $\sigma_H \sim 3$–$5$ Å), so a sharp-interface model always has measurable error
    relative to the physical truth for fluid-phase membranes.

    **Part 2:** `sigma_C` affects the intermediate-$q$ region most strongly —
    roughly between the first minimum and third minimum of the form factor. The
    headgroup peaks at higher $q$ are relatively insensitive to chain width because
    they arise primarily from the headgroup Gaussians.

    **Part 3:** Both curves approach a flat line $P(q) = 1$ as contrast vanishes,
    since the vesicle becomes indistinguishable from the surrounding water. The
    Gaussian model degrades smoothly; the shell model behaves identically because the
    normalization absorbs the contrast.

    **Part 4:** Up to $q_{\max} = 0.35$ Å$^{-1}$ the two models overlap closely
    for POPC parameters — you would not be able to reliably distinguish them from data
    alone. Above $q \approx 0.4$–$0.5$ Å$^{-1}$ the models diverge measurably, so
    data to $q_{\max} = 0.6$ Å$^{-1}$ would allow the Gaussian widths to be
    determined from a fit. This is the primary reason that structural SAXS studies of
    bilayers push to higher $q$ whenever beam time and signal-to-noise allow.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_gaussian_bilayer.ipynb
    $ git commit -m "compare Gaussian and shell model form factors for POPC"
    ```

---

**What's next:** [Asymmetric Bilayer](5-asymmetric-bilayer.md) — extending the
Gaussian model to allow the inner and outer leaflets to have different structural
parameters.
