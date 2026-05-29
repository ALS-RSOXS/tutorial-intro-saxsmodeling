# Form Factor from a Profile

With a continuous electron density profile in hand, the next step is to compute the
scattering form factor. For the shell models in Section 3 we had a closed-form
analytical result. The Gaussian bilayer profile does not have a simple closed form for
a spherical geometry, so we evaluate the form factor **numerically**.

## The spherical Fourier transform

For any spherically symmetric particle with electron density profile $\rho(r)$, the
scattering amplitude is:

$$F(q) = \frac{4\pi}{q} \int_0^\infty \left[\rho(r) - \rho_w\right]\, r\, \sin(qr)\, \mathrm{d}r$$

This is the spherical Fourier transform of the contrast profile $\Delta\rho(r) = \rho(r) - \rho_w$.

!!! note "Key Concept: Where this comes from"
    The general 3D Fourier transform of a spherically symmetric function reduces to a
    1D integral. The $\sin(qr)/(qr)$ factor — appearing here as $\sin(qr)$ after the
    $1/q$ is pulled outside — is the spherical Bessel function $j_0(qr)$ multiplied
    by $qr$. It encodes the interference between waves scattered from a thin shell at
    radius $r$ and the detector at angle $q$.

    The intensity form factor is then $P(q) = [F(q)/F(0)]^2$, normalized so that
    $P(q \to 0) = 1$.

## Implementation

Add this function to your notebook:

```python
def vesicle_form_factor_gaussian(q, R, d_HH, sigma_H, A_H, sigma_C, A_C,
                                  rho_water, n_points=2000):
    """
    Form factor P(q) for a vesicle with a Gaussian electron density profile.

    Evaluates the spherical Fourier transform numerically using np.trapz.

    Parameters
    ----------
    q : array-like
        Scattering vector in Å^-1.
    R : float
        Outer vesicle radius in Å.
    d_HH : float
        Head-to-head distance in Å.
    sigma_H : float
        Headgroup Gaussian width in Å.
    A_H : float
        Headgroup amplitude (positive, in Å^-2).
    sigma_C : float
        Chain Gaussian width in Å.
    A_C : float
        Chain amplitude (positive, subtracted, in Å^-2).
    rho_water : float
        Background SLD in Å^-2.
    n_points : int
        Number of points in the radial integration grid.

    Returns
    -------
    numpy.ndarray
        P(q), normalized to 1 at q -> 0.
    """
    # Radial grid: extend beyond the outer headgroup to capture the full profile
    r = np.linspace(0.1, R + 5 * sigma_H, n_points)  # (1)

    rho = bilayer_electron_density(r, R, d_HH, sigma_H, A_H, sigma_C, A_C, rho_water)
    delta_rho = rho - rho_water

    # Spherical Fourier transform at each q value
    F = np.array([
        np.trapz(delta_rho * r * np.sin(qi * r), r) * 4 * np.pi / qi
        for qi in q
    ])  # (2)

    # Normalization: F(q -> 0) = 4*pi * integral of delta_rho * r^2 dr
    F0 = 4 * np.pi * np.trapz(delta_rho * r**2, r)  # (3)

    return (F / F0)**2
```

1. The grid extends to $R + 5\sigma_H$ to capture the full Gaussian tail of the outer
   headgroup. Cutting off earlier would underestimate the form factor at high $q$.
2. The loop evaluates the integral at each $q$ value. This is the most readable
   implementation — a vectorized version would be faster for large $q$ arrays.
3. At $q \to 0$, $\sin(qr)/(qr) \to 1$, so $F(0) = \frac{4\pi}{q}\int\Delta\rho \cdot
   r\sin(qr)\,dr \to 4\pi\int\Delta\rho\, r^2\,dr$. Using this analytical limit as the
   normalization is more accurate than using $F$ at the smallest finite $q$.

!!! info "Grid resolution"
    The radial grid must be fine enough to resolve the narrowest Gaussian in the
    profile. For POPC with $\sigma_H = 3$ Å, a spacing of $\Delta r \lesssim 1$ Å is
    needed. With `n_points=2000` and `R=300` Å the spacing is
    $(300 + 5 \times 3)/2000 \approx 0.16$ Å — well resolved. For much larger
    vesicles or narrower Gaussians, increase `n_points` accordingly.

## Computing and plotting the form factor

```python
q = np.logspace(-3, 0, 500)

P_gauss = vesicle_form_factor_gaussian(q, R, d_HH, sigma_H, A_H, sigma_C, A_C,
                                        rho_water)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_gauss,
                 label=f"Gaussian profile (POPC, R = {R:.0f} Å)",
                 ax=ax, color="steelblue")
ax.set_title("Vesicle form factor from Gaussian bilayer profile")
plt.tight_layout()
plt.show()
```

The curve should show the characteristic hollow-sphere shape from Section 3 — a
prominent peak followed by oscillations — but with smoother, more damped oscillations
at high $q$ compared to a sharp-interface model.

!!! example "Try It Yourself"
    1. The function is called once per value of `q` in the loop. For 500 $q$ values
       and a 2000-point radial grid, how many floating-point multiplications does the
       inner integral require? Use Python's `time` module to measure how long the
       calculation takes on your machine.
    2. Halve `n_points` to 1000 and compare the resulting curve to the 2000-point
       version. Is there a visible difference? At what `n_points` does the calculation
       become inaccurate?
    3. Change the vesicle radius to `R = 500` Å. Where do the form factor features
       shift? Is this consistent with what you learned in Section 2?

??? success "Solution"
    **Part 1:** Each call to `np.trapz` performs approximately `n_points`
    multiplications. With 500 $q$ values and `n_points=2000` that is
    $500 \times 2000 = 10^6$ operations. A rough timing:

    ```python
    import time
    t0 = time.time()
    P_test = vesicle_form_factor_gaussian(q, R, d_HH, sigma_H, A_H, sigma_C, A_C,
                                           rho_water)
    print(f"Elapsed: {time.time() - t0:.2f} s")
    ```

    On a typical laptop this takes 0.5–2 seconds. Vectorizing the loop would reduce
    this to milliseconds, but the readable loop is sufficient for exploration.

    **Part 2:** At `n_points=1000` (spacing ~0.32 Å) the curves are nearly identical
    for POPC parameters. Noticeable differences appear below `n_points=200` where the
    headgroup Gaussians begin to be under-sampled. The default of 2000 provides a
    comfortable safety margin.

    **Part 3:** Doubling the radius shifts all features to half the $q$ value,
    consistent with the $q \propto 1/R$ scaling established in Section 2.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_gaussian_bilayer.ipynb
    $ git commit -m "add vesicle_form_factor_gaussian numerical Fourier transform"
    ```

---

**What's next:** [Comparing to the Shell Model](4-comparing-to-shell-model.md) —
overlaying the Gaussian and three-shell form factors and understanding where they agree
and where they diverge.
