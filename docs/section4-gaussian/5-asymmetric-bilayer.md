# Asymmetric Bilayer

The symmetric Gaussian model assumes both leaflets of the bilayer are structurally
identical — same headgroup width, same amplitude. For many purposes this is a
reasonable first approximation, but real vesicle membranes break this symmetry in ways
that are physically meaningful and measurable with SAXS.

## Why bilayers are not symmetric

Two sources of asymmetry are relevant for vesicle scattering:

**Geometric asymmetry from curvature.** In a spherical vesicle the outer leaflet
occupies more surface area than the inner leaflet. For a vesicle of radius $R$ with
bilayer thickness $d_{HH}$, the ratio of outer to inner leaflet area is
$(R / (R - d_{HH}))^2$. For a 300 Å radius POPC vesicle this is approximately
$1.28$ — the outer leaflet has 28% more area per lipid than the inner leaflet.
This difference in packing density leads to different chain order, slightly different
headgroup exposure, and a measurably different electron density profile on each side.

**Structural disorder asymmetry.** Brzustowicz & Brunger (2005) analyzed SAXS data
from unilamellar SOPS vesicles and found that the inner headgroup layer is consistently
**rougher** — has a larger Gaussian width — than the outer layer. They attributed this
to the inner leaflet relieving curvature strain by adopting a more conformationally
disordered state. For POPC this translates to:

- Outer headgroup: $\sigma_H^{\text{out}} \approx 3.0$ Å
- Inner headgroup: $\sigma_H^{\text{in}} \approx 4.5$ Å

## The asymmetric model

The symmetric model forced both headgroup Gaussians to share the same amplitude $A_H$
and width $\sigma_H$. The asymmetric model gives each its own parameters:

$$\rho(r) = \rho_w
+ A_H^{\text{out}} \exp\!\left(-\frac{(r - R)^2}{2(\sigma_H^{\text{out}})^2}\right)
+ A_H^{\text{in}} \exp\!\left(-\frac{(r - (R - d_{HH}))^2}{2(\sigma_H^{\text{in}})^2}\right)
- A_C \exp\!\left(-\frac{(r - r_C)^2}{2\sigma_C^2}\right)$$

The chain region remains symmetric about the midplane $r_C = R - d_{HH}/2$.

## Implementation

```python
def asymmetric_bilayer_electron_density(r, R, d_HH,
                                         sigma_H_out, A_H_out,
                                         sigma_H_in,  A_H_in,
                                         sigma_C, A_C, rho_water):
    """
    Electron density profile for an asymmetric lipid bilayer vesicle.

    Allows independent Gaussian parameters for the outer and inner
    headgroup layers.

    Parameters
    ----------
    r : array-like
        Radial coordinate in Å.
    R : float
        Outer vesicle radius in Å.
    d_HH : float
        Head-to-head distance in Å.
    sigma_H_out : float
        Outer headgroup Gaussian width in Å.
    A_H_out : float
        Outer headgroup amplitude (positive, in Å^-2).
    sigma_H_in : float
        Inner headgroup Gaussian width in Å.
    A_H_in : float
        Inner headgroup amplitude (positive, in Å^-2).
    sigma_C : float
        Chain Gaussian width in Å.
    A_C : float
        Chain amplitude (positive, subtracted, in Å^-2).
    rho_water : float
        Background SLD in Å^-2.

    Returns
    -------
    numpy.ndarray
        Electron density rho(r) in Å^-2.
    """
    r_H_out = R
    r_H_in  = R - d_HH
    r_C     = R - d_HH / 2

    return (rho_water
            + A_H_out * np.exp(-0.5 * ((r - r_H_out) / sigma_H_out)**2)
            + A_H_in  * np.exp(-0.5 * ((r - r_H_in)  / sigma_H_in)**2)
            - A_C     * np.exp(-0.5 * ((r - r_C)      / sigma_C)**2))


def asymmetric_vesicle_form_factor(q, R, d_HH,
                                    sigma_H_out, A_H_out,
                                    sigma_H_in,  A_H_in,
                                    sigma_C, A_C, rho_water, n_points=2000):
    """
    Form factor P(q) for a vesicle with an asymmetric Gaussian bilayer profile.

    Parameters
    ----------
    q : array-like
        Scattering vector in Å^-1.
    R, d_HH, sigma_H_out, A_H_out, sigma_H_in, A_H_in, sigma_C, A_C, rho_water :
        See asymmetric_bilayer_electron_density.
    n_points : int
        Number of points in the radial integration grid.

    Returns
    -------
    numpy.ndarray
        P(q), normalized to 1 at q -> 0.
    """
    sigma_max = max(sigma_H_out, sigma_H_in)
    r = np.linspace(0.1, R + 5 * sigma_max, n_points)

    rho = asymmetric_bilayer_electron_density(r, R, d_HH,
                                               sigma_H_out, A_H_out,
                                               sigma_H_in,  A_H_in,
                                               sigma_C, A_C, rho_water)
    delta_rho = rho - rho_water

    F = np.array([
        np.trapz(delta_rho * r * np.sin(qi * r), r) * 4 * np.pi / qi
        for qi in q
    ])
    F0 = 4 * np.pi * np.trapz(delta_rho * r**2, r)

    return (F / F0)**2
```

## Visualizing the asymmetric profile

Compare the symmetric and asymmetric profiles side by side:

```python
r_plot = np.linspace(R - d_HH - 4*max(sigma_H, 4.5), R + 4*max(sigma_H, 4.5), 1000)

rho_sym = bilayer_electron_density(r_plot, R, d_HH, sigma_H, A_H, sigma_C, A_C,
                                    rho_water)
rho_asym = asymmetric_bilayer_electron_density(r_plot, R, d_HH,
                                                sigma_H_out=3.0, A_H_out=A_H,
                                                sigma_H_in=4.5,  A_H_in=A_H,
                                                sigma_C=sigma_C, A_C=A_C,
                                                rho_water=rho_water)

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(r_plot, rho_sym  * 1e6, color="steelblue", label="Symmetric (σ = 3.0 Å both)")
ax.plot(r_plot, rho_asym * 1e6, color="tomato",    linestyle="--",
        label=r"Asymmetric ($\sigma_{\rm out}$ = 3.0, $\sigma_{\rm in}$ = 4.5 Å)")
ax.axhline(rho_water * 1e6, color="gray", linestyle=":", linewidth=0.8)
ax.set_xlabel(r"$r$ (Å)")
ax.set_ylabel(r"$\rho(r)$ ($10^{-6}$ Å$^{-2}$)")
ax.legend(fontsize=9)
ax.set_title("Symmetric vs asymmetric POPC bilayer profile")
plt.tight_layout()
plt.show()
```

The outer headgroup peak is unchanged. The inner headgroup peak is broader and
shorter — the same area under the curve (same total electron count) but spread over a
wider range.

## Effect on the scattering curve

```python
P_sym  = vesicle_form_factor_gaussian(q, R, d_HH, sigma_H, A_H, sigma_C, A_C,
                                       rho_water)
P_asym = asymmetric_vesicle_form_factor(q, R, d_HH,
                                         sigma_H_out=3.0, A_H_out=A_H,
                                         sigma_H_in=4.5,  A_H_in=A_H,
                                         sigma_C=sigma_C, A_C=A_C,
                                         rho_water=rho_water)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_sym,  label="Symmetric",   ax=ax, color="steelblue")
plot_form_factor(q, P_asym, label="Asymmetric",  ax=ax, color="tomato")
ax.set_title("Effect of inner leaflet broadening on P(q)")
plt.tight_layout()
plt.show()
```

The asymmetric curve is nearly identical to the symmetric one at small $q$ and
diverges only at large $q$ — reflecting the fact that the asymmetry is encoded in
the fine structure of the bilayer profile, which requires high spatial-frequency
information to resolve.

!!! example "Try It Yourself"
    1. Increase `sigma_H_in` progressively from 3.0 to 8.0 Å in steps of 1 Å, keeping
       `sigma_H_out = 3.0` Å fixed. At what `sigma_H_in` does a difference between the
       symmetric and asymmetric scattering curves become visible on your log-log plot?
    2. Now also reduce `A_H_in` to 80% of `A_H_out` while keeping `sigma_H_in = 4.5`
       Å. How does the combination of broader and lower-amplitude inner headgroup
       change the profile? Does this make the scattering difference larger or smaller?
    3. **Conceptual:** Given the difference between the symmetric and asymmetric
       curves, what $q_{\max}$ would your experiment need to reach to distinguish the
       two models? What signal-to-noise ratio would you need at those $q$ values?

??? success "Solution"
    **Part 1:** A visible difference typically appears when `sigma_H_in` reaches
    approximately 5–6 Å. Below that, the broadening of a single peak contributes
    only a small perturbation to the total amplitude, and the difference is buried in
    the log scale. At 7–8 Å the inner headgroup begins to approach the chain region
    in width and the asymmetry becomes clearly visible above $q \approx 0.4$ Å$^{-1}$.

    **Part 2:**
    ```python
    rho_asym2 = asymmetric_bilayer_electron_density(r_plot, R, d_HH,
                                                     sigma_H_out=3.0,
                                                     A_H_out=A_H,
                                                     sigma_H_in=4.5,
                                                     A_H_in=0.8*A_H,
                                                     sigma_C=sigma_C,
                                                     A_C=A_C,
                                                     rho_water=rho_water)
    ```
    Reducing $A_H^{\text{in}}$ lowers the inner headgroup peak further below the outer
    one, making the profile visibly asymmetric even by eye. However, the effect on the
    scattering curve is still small at accessible $q$ values — SAXS is relatively
    insensitive to single-leaflet amplitude differences compared to width differences.

    **Part 3:** The asymmetric and symmetric curves diverge meaningfully above
    $q \approx 0.4$–$0.5$ Å$^{-1}$. In practice, data to $q \approx 0.6$ Å$^{-1}$
    with good signal-to-noise ($I/\sigma > 5$ in the oscillations) would be needed to
    reliably fit leaflet asymmetry parameters. This is achievable at synchrotron SAXS
    beamlines but challenging with laboratory instruments.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_gaussian_bilayer.ipynb
    $ git commit -m "add asymmetric Gaussian bilayer model for POPC"
    ```

---

You have now built a complete progression of bilayer scattering models — from a
uniform hollow sphere, through a symmetric Gaussian profile, to an asymmetric bilayer
that reflects real membrane physics. The next steps in a real analysis would be fitting
these models to experimental data, accounting for polydispersity in vesicle size, and
including the structure factor for concentrated samples.
