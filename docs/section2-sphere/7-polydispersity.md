# Polydispersity

Every model so far has assumed that all spheres in the sample are exactly the same
size. In practice, no synthesis or self-assembly process is perfectly uniform. Real
samples contain a **distribution** of sizes, and this distribution changes the shape
of the scattering curve in a characteristic and important way.

## Choosing a size distribution

We describe polydispersity with a probability distribution $D(R)$ that gives the
relative abundance of spheres with radius $R$. The choice of distribution matters —
not all functional forms are equally physically appropriate.

A Gaussian distribution is symmetric around the mean. For particle sizes this creates
an immediate problem: a Gaussian with any appreciable width will assign non-zero
probability to negative radii, which is unphysical. More importantly, real particle
size distributions in colloidal and biological systems are typically **right-skewed**:
there is a hard lower bound at $R = 0$, statistical fluctuations during growth tend to
produce a tail of larger-than-average particles, and the distribution cuts off sharply
below the mean. A Gaussian cannot capture this asymmetry.

The **Schulz-Zimm distribution** (also called the Schulz distribution) handles all of
this naturally:

$$D(R) = \frac{1}{\Gamma(z+1)}\left(\frac{z+1}{\bar{R}}\right)^{z+1} R^{\,z}
\exp\!\left(-\frac{(z+1)\,R}{\bar{R}}\right)$$

where $\bar{R}$ is the mean radius, $z$ is a dimensionless shape parameter, and
$\Gamma$ is the gamma function. The distribution is defined only for $R > 0$, is
right-skewed for all finite $z$, and becomes symmetric (approaching a Gaussian) only
in the limit $z \to \infty$.

!!! note "Key Concept: The Schulz-Zimm Distribution"
    The shape parameter $z$ controls the width of the distribution. It is directly
    related to the **relative polydispersity** $p = \sigma_R / \bar{R}$:

    $$p = \frac{\sigma_R}{\bar{R}} = \frac{1}{\sqrt{z+1}} \qquad \Longleftrightarrow \qquad z = \frac{1}{p^2} - 1$$

    Large $z$ means a narrow distribution (small $p$); small $z$ means a broad one.
    For $z = 0$ the distribution reduces to a simple exponential — the broadest
    physically meaningful case. For a typical biological vesicle preparation,
    $p \approx 0.1$–$0.3$ and $z \approx 10$–$100$.

    The Schulz-Zimm distribution is mathematically a **gamma distribution** with shape
    parameter $k = z + 1$ and scale parameter $\theta = \bar{R}/(z+1)$.

## Averaging over the distribution

The measured intensity from a polydisperse sample is a weighted average over all
present radii:

$$I(q) \propto \int_0^\infty D(R)\, R^6\, P(q, R)\, \mathrm{d}R$$

!!! note "Key Concept: Why R⁶?"
    The intensity from a single sphere scales as $V^2 = \left(\frac{4}{3}\pi
    R^3\right)^2 \propto R^6$. Larger spheres scatter far more strongly than smaller
    ones. When we average over a size distribution, each radius is weighted not just by
    how abundant it is — $D(R)$ — but also by how strongly it scatters — $R^6$. The
    measured scattering curve is therefore dominated by the larger spheres in the
    distribution, even if they are relatively rare. The right-skewed tail of the
    Schulz-Zimm distribution makes this bias more pronounced than a Gaussian would
    predict.

## Implementation

The Schulz-Zimm distribution is a gamma distribution, so we can use
`scipy.stats.gamma` directly rather than implementing the formula by hand. Add this
function to your notebook:

```python
from scipy.stats import gamma as gamma_dist

def polydisperse_sphere(q, R_mean, sigma_R, n_points=300):
    """
    Form factor for a polydisperse distribution of spheres.

    Uses a Schulz-Zimm (gamma) size distribution and numerical
    integration over a range of radii.

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
    z = (R_mean / sigma_R)**2 - 1       # Schulz shape parameter  # (1)
    k     = z + 1                        # gamma shape (k = z + 1)
    theta = R_mean / k                   # gamma scale

    # Integration range: 0 to mean + 5 sigma, keeping R > 0
    R_max = R_mean + 5 * sigma_R
    R_values = np.linspace(1e-3, R_max, n_points)

    # Schulz-Zimm weights via scipy.stats.gamma
    D = gamma_dist.pdf(R_values, a=k, scale=theta)  # (2)

    # Weighted sum: each radius contributes D(R) * R^6 * P(q, R)
    I = np.zeros_like(q, dtype=float)
    for i, R in enumerate(R_values):
        I += D[i] * R**6 * sphere_form_factor(q, R)  # (3)

    return I / I[0]  # normalize to 1 at q -> 0
```

1. The shape parameter $z$ is computed directly from the ratio
   $(\bar{R}/\sigma_R)^2 - 1$. For a 10% relative polydispersity,
   $z = (1/0.1)^2 - 1 = 99$.
2. `scipy.stats.gamma.pdf` evaluates the gamma distribution at each radius. The `a`
   parameter is the shape $k = z+1$ and `scale` is $\theta = \bar{R}/(z+1)$.
3. The structure of the loop is identical to the Gaussian version — only the weights
   `D` have changed.

## Comparing Schulz-Zimm to a Gaussian

Before examining the scattering curves, plot the two distributions side by side to see
the shape difference:

```python
from scipy.stats import gamma as gamma_dist

R_mean  = 50.0
sigma_R = 10.0   # 20% relative polydispersity

R_plot = np.linspace(0.1, 120, 500)

# Schulz-Zimm
z     = (R_mean / sigma_R)**2 - 1
D_sz  = gamma_dist.pdf(R_plot, a=z+1, scale=R_mean/(z+1))

# Gaussian (for comparison)
D_gauss = np.exp(-0.5 * ((R_plot - R_mean) / sigma_R)**2)
D_gauss /= D_gauss.sum() * (R_plot[1] - R_plot[0])  # normalize to same area

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(R_plot, D_sz,    color="tomato",    label="Schulz-Zimm")
ax.plot(R_plot, D_gauss, color="steelblue", linestyle="--", label="Gaussian")
ax.axvline(R_mean, color="gray", linestyle=":", linewidth=0.8, label=r"$\bar{R}$")
ax.set_xlabel(r"$R$ (Å)")
ax.set_ylabel(r"$D(R)$")
ax.set_title(r"Size distributions: $\bar{R}$ = 50 Å, $\sigma_R$ = 10 Å")
ax.legend()
plt.tight_layout()
plt.show()
```

The Schulz-Zimm distribution peaks slightly below the mean and has a longer tail
toward large radii. The Gaussian is symmetric but extends to negative radii (the dashed
line below $R = 0$), which is unphysical.

## Observing the effect of polydispersity on scattering

Add this cell to compare monodisperse and polydisperse scattering curves:

```python
R_mean = 50.0

fig, ax = plt.subplots(figsize=(8, 5))

# Monodisperse reference
P_mono = sphere_form_factor(q, R_mean)
plot_form_factor(q, P_mono, label="Monodisperse", ax=ax, color="steelblue")

# Polydisperse curves with increasing spread
for sigma_frac, color in [(0.05, "seagreen"), (0.15, "tomato"), (0.30, "darkorchid")]:
    sigma_R = sigma_frac * R_mean
    P_poly  = polydisperse_sphere(q, R_mean, sigma_R)
    label   = rf"$\sigma_R / \bar{{R}}$ = {sigma_frac:.0%}"
    plot_form_factor(q, P_poly, label=label, ax=ax, color=color)

ax.set_title(r"Effect of polydispersity — Schulz-Zimm distribution ($\bar{R}$ = 50 Å)")
plt.tight_layout()
plt.show()
```

Look at the oscillations as polydispersity increases. What happens?

## What polydispersity does to the curve

!!! note "Key Concept: Oscillation Washing"
    Different sphere sizes produce oscillations at different $q$ positions. When the
    sample contains a range of radii, these oscillations are spread over a range of
    $q$ values and partially cancel each other — a process called **oscillation
    washing** or smearing.

    At low polydispersity (< 5%) the oscillations are clearly visible. At moderate
    polydispersity (~15%) they are significantly damped. At high polydispersity (> 30%)
    they are nearly completely washed out and the curve appears smooth.

    Because the Schulz-Zimm distribution has a longer large-$R$ tail than a Gaussian
    with the same $\sigma_R$, it washes the oscillations slightly more aggressively —
    reflecting the fact that real distributions include more large outlier particles
    than a symmetric Gaussian would predict.

    This explains why oscillations are rarely seen in scattering from biological samples
    (broad, asymmetric size distributions) but are clearly visible in carefully
    synthesized monodisperse nanoparticles.

!!! example "Try It Yourself"
    1. At what relative polydispersity ($\sigma_R / \bar{R}$) do the oscillations
       become difficult to identify by eye? Explore a range of values.
    2. The mean radius is fixed at 50 Å throughout. Does the position of the first
       minimum shift as polydispersity increases? Why does the $R^6$ weighting make
       this shift go in the direction it does?
    3. Compare the polydisperse scattering curves for the same $\sigma_R / \bar{R}$
       using the Schulz-Zimm distribution and a Gaussian distribution. At what
       polydispersity level does the difference become noticeable?

??? success "Solution"
    **Part 1:** The oscillations typically become indistinct by eye around
    $\sigma_R / \bar{R} \approx 0.20$–$0.25$. The exact threshold depends on $q$
    range and noise level, but 20% is a reasonable rule of thumb.

    **Part 2:** The first minimum shifts slightly toward smaller $q$ as polydispersity
    increases. The $R^6$ weighting biases the effective average radius upward — larger
    spheres contribute disproportionately to the signal, so the curve behaves as if the
    mean radius is somewhat larger than $\bar{R}$. This bias is more pronounced with
    the Schulz-Zimm distribution than with a Gaussian because its right-skewed tail
    contributes more large-$R$ weight.

    **Part 3:**
    ```python
    def polydisperse_sphere_gaussian(q, R_mean, sigma_R, n_points=300):
        """Polydisperse sphere using a Gaussian size distribution."""
        R_min    = max(1.0, R_mean - 4 * sigma_R)
        R_max    = R_mean + 4 * sigma_R
        R_values = np.linspace(R_min, R_max, n_points)
        D = np.exp(-0.5 * ((R_values - R_mean) / sigma_R)**2)
        I = np.zeros_like(q, dtype=float)
        for i, R in enumerate(R_values):
            I += D[i] * R**6 * sphere_form_factor(q, R)
        return I / I[0]

    sigma_R = 0.20 * R_mean   # 20% polydispersity

    P_sz    = polydisperse_sphere(q, R_mean, sigma_R)
    P_gauss = polydisperse_sphere_gaussian(q, R_mean, sigma_R)

    fig, ax = plt.subplots(figsize=(8, 5))
    plot_form_factor(q, P_sz,    label="Schulz-Zimm", ax=ax, color="tomato")
    plot_form_factor(q, P_gauss, label="Gaussian",    ax=ax, color="steelblue")
    ax.set_title(r"Schulz-Zimm vs Gaussian, $\sigma_R/\bar{R}$ = 20%")
    plt.tight_layout()
    plt.show()
    ```

    At 10–15% polydispersity the difference is small and practically negligible. At
    20–30% the Schulz-Zimm curve shows slightly more washing of the oscillations,
    particularly at higher $q$, due to its heavier large-$R$ tail.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_02_sphere.ipynb
    $ git commit -m "add polydisperse_sphere with Schulz-Zimm distribution"
    ```

---

**What's next:** [Commit Checkpoint](8-commit-checkpoint.md) — saving everything you
have built so far to GitHub.
