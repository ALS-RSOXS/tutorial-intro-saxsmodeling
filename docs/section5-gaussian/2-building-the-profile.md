# Building the Electron Density Profile

The symmetric bilayer model uses three Gaussian components: one for each headgroup
layer and one for the hydrocarbon chain region. All three sit on a background of water
SLD.

## The model formula

$$\rho(r) = \rho_w
+ A_H \exp\!\left(-\frac{(r - r_H^{\text{out}})^2}{2\sigma_H^2}\right)
+ A_H \exp\!\left(-\frac{(r - r_H^{\text{in}})^2}{2\sigma_H^2}\right)
- A_C \exp\!\left(-\frac{(r - r_C)^2}{2\sigma_C^2}\right)$$

The five structural parameters and their physical meaning:

| Parameter | Symbol | Meaning |
|---|---|---|
| Outer vesicle radius | $R$ | Position of outer headgroup peak |
| Head-to-head distance | $d_{HH}$ | Distance from outer to inner headgroup peak |
| Headgroup width | $\sigma_H$ | Broadness of each headgroup Gaussian |
| Headgroup amplitude | $A_H$ | How much denser the headgroups are than water |
| Chain width | $\sigma_C$ | Broadness of the chain region Gaussian |
| Chain amplitude | $A_C$ | How much less dense the chains are than water |

The positions of each component follow from $R$ and $d_{HH}$:

$$r_H^{\text{out}} = R \qquad r_H^{\text{in}} = R - d_{HH} \qquad r_C = R - \frac{d_{HH}}{2}$$

!!! note "Sign convention"
    $A_H$ is **positive** — headgroups have higher electron density than water.
    $A_C$ is also defined as **positive** but appears with a minus sign in the formula,
    because the hydrocarbon chains have *lower* electron density than water. Keeping
    both amplitudes positive makes it easier to verify that parameters are physically
    reasonable.

## POPC starting parameters

All examples in this section use POPC (1-palmitoyl-2-oleoyl-sn-glycero-3-
phosphocholine) at 25°C:

```python
# POPC bilayer parameters at 25 C
R       = 300.0   # outer vesicle radius, Å
d_HH    = 37.1    # head-to-head distance, Å  (Kucerka et al. 2011)
sigma_H =   3.0   # headgroup Gaussian width, Å
sigma_C =   5.5   # chain region Gaussian width, Å
A_H     =  3.0e-6 # headgroup amplitude, Å^-2  (above water background)
A_C     =  1.2e-6 # chain amplitude, Å^-2      (below water background)
rho_water = 9.47e-6  # water SLD, Å^-2
```

## Implementation

Add the following function to your notebook:

```python
import numpy as np

def bilayer_electron_density(r, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water):
    """
    Electron density profile for a symmetric lipid bilayer vesicle.

    Uses three Gaussian components: outer headgroup, inner headgroup,
    and hydrocarbon chain trough centered at the bilayer midplane.

    Parameters
    ----------
    r : array-like
        Radial coordinate in Å, measured from the vesicle center.
    R : float
        Outer vesicle radius (outer headgroup peak position) in Å.
    d_HH : float
        Head-to-head distance across the bilayer in Å.
    sigma_H : float
        Width (standard deviation) of each headgroup Gaussian in Å.
    A_H : float
        Headgroup amplitude relative to water (positive, in Å^-2).
    sigma_C : float
        Width of the chain region Gaussian in Å.
    A_C : float
        Chain amplitude relative to water (positive, subtracted, in Å^-2).
    rho_water : float
        Background (water) SLD in Å^-2.

    Returns
    -------
    numpy.ndarray
        Electron density rho(r) in Å^-2.
    """
    r_H_out = R                # outer headgroup position
    r_H_in  = R - d_HH        # inner headgroup position
    r_C     = R - d_HH / 2    # bilayer midplane

    return (rho_water
            + A_H * np.exp(-0.5 * ((r - r_H_out) / sigma_H)**2)   # (1)
            + A_H * np.exp(-0.5 * ((r - r_H_in)  / sigma_H)**2)
            - A_C * np.exp(-0.5 * ((r - r_C)     / sigma_C)**2))  # (2)
```

1. Both headgroup Gaussians use the same amplitude $A_H$ and width $\sigma_H$ — this
   is the symmetric assumption. It will be relaxed in page 5.
2. The chain term is subtracted because $A_C > 0$ but the chains have *lower*
   electron density than water.

## Visualizing the profile

Zoom in on the bilayer region to see the structure clearly:

```python
import matplotlib.pyplot as plt

# Radial grid — zoom in on the bilayer region
r = np.linspace(R - d_HH - 4*sigma_H, R + 4*sigma_H, 1000)

rho = bilayer_electron_density(r, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water)

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(r, rho * 1e6, color="steelblue", linewidth=2, label="Gaussian profile")  # (1)
ax.axhline(rho_water * 1e6, color="gray", linestyle="--", linewidth=0.8,
           label=r"$\rho_{\rm water}$")
ax.set_xlabel(r"$r$ (Å)")
ax.set_ylabel(r"$\rho(r)$ ($10^{-6}$ Å$^{-2}$)")
ax.set_title("POPC bilayer electron density profile")
ax.legend()
plt.tight_layout()
plt.show()
```

1. Multiplying by $10^6$ converts from Å$^{-2}$ to the conventional unit of
   $10^{-6}$ Å$^{-2}$, making the axis labels more readable.

You should see two peaks above the water baseline (the headgroups) flanking a trough
below it (the hydrocarbon chains). The outer peak is at $r = R = 300$ Å and the inner
peak is at $r = R - d_{HH} = 262.9$ Å.

## Visualizing each component

It is instructive to plot each Gaussian term separately so you can see how they
combine:

```python
r_H_out = R
r_H_in  = R - d_HH
r_C     = R - d_HH / 2

fig, ax = plt.subplots(figsize=(8, 4))

ax.plot(r, rho * 1e6, color="steelblue", linewidth=2, label="Total profile")
ax.plot(r, (rho_water + A_H * np.exp(-0.5*((r-r_H_out)/sigma_H)**2)) * 1e6,
        color="tomato", linestyle="--", linewidth=1.2, label="Outer headgroup")
ax.plot(r, (rho_water + A_H * np.exp(-0.5*((r-r_H_in)/sigma_H)**2)) * 1e6,
        color="seagreen", linestyle="--", linewidth=1.2, label="Inner headgroup")
ax.plot(r, (rho_water - A_C * np.exp(-0.5*((r-r_C)/sigma_C)**2)) * 1e6,
        color="darkorchid", linestyle="--", linewidth=1.2, label="Chain trough")

ax.axhline(rho_water * 1e6, color="gray", linestyle=":", linewidth=0.8)
ax.set_xlabel(r"$r$ (Å)")
ax.set_ylabel(r"$\rho(r)$ ($10^{-6}$ Å$^{-2}$)")
ax.legend(fontsize=9)
plt.tight_layout()
plt.show()
```

!!! example "Try It Yourself"
    1. Increase `sigma_H` from 3.0 Å to 8.0 Å. How does the headgroup peak shape
       change? At what width do the two headgroup peaks start to overlap?
    2. Increase `sigma_C` from 5.5 Å to 15 Å. What happens to the chain trough?
    3. Set `A_C = 0`. What does the profile look like? Does this correspond to any
       physically meaningful structure?

??? success "Solution"
    **Part 1:** As `sigma_H` increases the headgroup peaks broaden and flatten. The
    two peaks begin to visibly overlap when `sigma_H` approaches $d_{HH}/4 \approx
    9$ Å for POPC — at that point the inner edge of the outer peak overlaps the outer
    edge of the inner peak.

    **Part 2:** Broadening `sigma_C` spreads the chain trough over a wider radial
    range, eventually swallowing the headgroup peaks into a single broad depression.
    Beyond `sigma_C` $\approx 20$ Å the profile loses its characteristic two-peak
    shape entirely.

    **Part 3:** With `A_C = 0` the chain trough disappears and the profile shows
    only the two headgroup peaks above a flat water baseline. This would represent a
    bilayer where the chain electron density happens to match water — unphysical for
    real lipids but useful as a diagnostic to check that each term is working
    correctly.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_gaussian_bilayer.ipynb
    $ git commit -m "add POPC bilayer_electron_density function and profile visualization"
    ```

---

**What's next:** [Form Factor from a Profile](3-form-factor-from-profile.md) —
computing the scattering form factor from the electron density profile numerically.
