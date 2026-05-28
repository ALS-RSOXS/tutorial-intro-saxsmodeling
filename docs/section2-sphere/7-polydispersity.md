# Polydispersity

Every model so far has assumed that all spheres in the sample are exactly the same
size. In practice, no synthesis or self-assembly process is perfectly uniform. Real
samples contain a **distribution** of sizes, and this distribution changes the shape
of the scattering curve in a characteristic and important way.

## The size distribution

We describe polydispersity with a probability distribution $D(R)$ that tells us the
relative abundance of spheres with radius $R$. For this tutorial we use a **Gaussian
distribution**:

$$D(R) = \exp\!\left(-\frac{(R - \bar{R})^2}{2\sigma_R^2}\right)$$

where $\bar{R}$ is the mean radius and $\sigma_R$ is the standard deviation. The
ratio $\sigma_R / \bar{R}$ is called the **relative polydispersity** — a value of 0.1
means a 10% spread in radius.

## Averaging over the distribution

The measured intensity from a polydisperse sample is a weighted average of the form
factors for each radius present:

$$I(q) \propto \int_0^\infty D(R)\, R^6\, P(q, R)\, \mathrm{d}R$$

!!! note "Key Concept: Why R⁶?"
    The intensity from a single sphere scales as $V^2 = \left(\frac{4}{3}\pi R^3\right)^2 \propto R^6$.
    Larger spheres scatter far more strongly than smaller ones. When we average over a
    size distribution, each radius $R$ is weighted not just by how abundant it is
    — $D(R)$ — but also by how much it scatters — $R^6$. This means the measured
    scattering curve is dominated by the larger spheres in the distribution, even if
    they are relatively rare.

## Computing the polydisperse form factor

The integral above does not have a simple closed form, so we evaluate it numerically.
Add this function to your notebook:

```python
def polydisperse_sphere(q, R_mean, sigma_R, n_points=300):
    """
    Form factor for a polydisperse distribution of spheres.

    Uses a Gaussian size distribution and numerical integration
    over a range of radii.

    Parameters
    ----------
    q : array-like
        Scattering vector in inverse angstroms (Å^-1).
    R_mean : float
        Mean sphere radius in angstroms (Å).
    sigma_R : float
        Standard deviation of the radius distribution in angstroms (Å).
    n_points : int
        Number of radii used in the numerical integration.

    Returns
    -------
    numpy.ndarray
        Polydisperse intensity, normalized to 1 at q -> 0.
    """
    # Integration range: mean ± 4 standard deviations, keeping R > 0
    R_min = max(1.0, R_mean - 4 * sigma_R)
    R_max = R_mean + 4 * sigma_R
    R_values = np.linspace(R_min, R_max, n_points)

    # Gaussian size distribution (unnormalized — only the shape matters)
    D = np.exp(-0.5 * ((R_values - R_mean) / sigma_R) ** 2)

    # Weighted sum: each radius contributes D(R) * R^6 * P(q, R)
    I = np.zeros_like(q, dtype=float)
    for i, R in enumerate(R_values):
        I += D[i] * R**6 * sphere_form_factor(q, R)  # (1)

    # Normalize to 1 at q -> 0
    return I / I[0]
```

1. The loop steps through each radius in the distribution, computes its contribution
   to the total intensity, and accumulates the result. This is a direct implementation
   of the integral: the sum over discrete $R$ values approximates $\int D(R) R^6 P(q,R) \mathrm{d}R$.

## Observing the effect of polydispersity

Add this cell to compare monodisperse and polydisperse curves:

```python
R_mean = 50.0      # mean radius in angstroms

fig, ax = plt.subplots(figsize=(8, 5))

# Monodisperse reference
P_mono = sphere_form_factor(q, R_mean)
plot_form_factor(q, P_mono, label="Monodisperse", ax=ax, color="steelblue")

# Polydisperse curves with increasing spread
for sigma_frac, color in [(0.05, "seagreen"), (0.15, "tomato"), (0.30, "darkorchid")]:
    sigma_R = sigma_frac * R_mean
    P_poly = polydisperse_sphere(q, R_mean, sigma_R)
    label = rf"$\sigma_R / \bar{{R}}$ = {sigma_frac:.0%}"
    plot_form_factor(q, P_poly, label=label, ax=ax, color=color)

ax.set_title(r"Effect of polydispersity ($\bar{R}$ = 50 Å)")
plt.tight_layout()
plt.show()
```

Look at the oscillations as polydispersity increases. What happens?

## What polydispersity does to the curve

!!! note "Key Concept: Oscillation Washing"
    Different sphere sizes produce oscillations at different $q$ positions. When the
    sample contains a range of radii, these oscillations do not all fall at the same
    $q$ — they are spread out. The result is **destructive interference**: the minima
    of some spheres coincide with the maxima of others, and the oscillations cancel.

    At low polydispersity (< 5%) the oscillations are clearly visible. At moderate
    polydispersity (~15%) they are significantly damped. At high polydispersity
    (> 30%) they are nearly completely washed out and the curve appears smooth.

    This is why oscillations are rarely seen in measurements of biological samples
    (which typically have broad size distributions) but are clearly visible in
    carefully synthesized monodisperse nanoparticles.

!!! example "Try It Yourself"
    1. At what relative polydispersity ($\sigma_R / \bar{R}$) do the oscillations
       become difficult to identify by eye? Explore a range of values to find your
       answer.
    2. The mean radius is fixed at 50 Å throughout. Does the position of the first
       minimum change as polydispersity increases? What does this tell you about the
       robustness of the $R \approx 4.49 / q_{\min}$ estimate?
    3. Re-run the calculation with $\bar{R} = 100$ Å and $\sigma_R / \bar{R} = 0.10$.
       How does the overall shape of the polydisperse curve compare to the 50 Å case?

??? success "Solution"
    **Part 1:** The oscillations typically become indistinct by eye around
    $\sigma_R / \bar{R} \approx 0.20$–$0.25$. The exact threshold depends on $q$
    range and noise level, but 20% is a reasonable rule of thumb for when oscillations
    can no longer be used to estimate radius reliably.

    **Part 2:** The first minimum position shifts only slightly with increasing
    polydispersity (it moves slightly toward smaller $q$ because the $R^6$ weighting
    biases the effective radius upward). For moderate polydispersity the shift is
    small, and the rule-of-thumb estimate remains useful. For high polydispersity the
    minimum is too broad to locate accurately.

    **Part 3:**
    ```python
    R_mean = 100.0
    sigma_R = 0.10 * R_mean  # 10 Å

    P_poly_100 = polydisperse_sphere(q, R_mean, sigma_R)

    fig, ax = plt.subplots(figsize=(7, 5))
    plot_form_factor(q, P_poly_100, label=r"$\bar{R}$ = 100 Å, 10% PDI", ax=ax)
    plt.tight_layout()
    plt.show()
    ```

    The curve for 100 Å has its features at half the $q$ values of the 50 Å case,
    consistent with the $q_{\min} \propto 1/R$ scaling. The overall shape is identical
    — only the scale changes.

---

**What's next:** [Commit Checkpoint](8-commit-checkpoint.md) — saving everything you
have built so far to GitHub.
