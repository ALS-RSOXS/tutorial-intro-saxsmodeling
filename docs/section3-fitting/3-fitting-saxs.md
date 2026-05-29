# Fitting Scattering Data

The machinery from the previous two pages — `curve_fit`, covariance matrix, confidence
band, correlation matrix — applies directly to scattering data. One important
modification is needed first: the choice of error weighting.

## Why linear errors fail for scattering data

A SAXS curve spans many orders of magnitude in intensity. At small $q$ the intensity
might be $10^0 = 1$ (normalized); at large $q$ it might be $10^{-6}$. If you use
uniform errors (`sigma = constant`), the chi-squared sum is dominated entirely by the
high-intensity points at small $q$. The optimizer drives the residuals there to zero
and ignores the rest of the curve — the oscillations that encode the sphere radius are
effectively invisible to the fit.

!!! note "Key Concept: Log-Scale Weighting"
    For data that spans multiple decades, use **relative (multiplicative) errors**:

    $$\sigma_i = \varepsilon \cdot I_i$$

    where $\varepsilon$ is a fractional uncertainty (e.g. 5%). Each chi-squared term
    then becomes:

    $$\left(\frac{I_i - P(q_i)}{\varepsilon \cdot I_i}\right)^2 = \frac{1}{\varepsilon^2}\left(\frac{I_i - P(q_i)}{I_i}\right)^2$$

    This weights every data point by its **relative** deviation from the model —
    equivalent to fitting on a log scale. A 10% deviation at $I = 1$ and a 10%
    deviation at $I = 10^{-6}$ contribute equally, ensuring the optimizer sees the
    whole curve.

## Paste in the Section 2 functions

Add a code cell at the top of the notebook and paste in `sphere_form_factor`,
`polydisperse_sphere`, and `plot_form_factor` from `chapter_02_sphere.ipynb`. These
are needed for generating the fake data and for the fit function.

## Generating fake scattering data

We generate a polydisperse sphere scattering curve, add multiplicative noise to
simulate a real measurement, and hide the true parameters to create a fitting problem:

```python
# Hidden true parameters — do not look until after fitting!
R_true     = 47.0   # mean radius, Å
sigma_true = 7.5    # radius std dev, Å (16% relative polydispersity)
scale_true = 1.0    # overall intensity scale

q = np.logspace(-3, 0, 300)

# Generate true curve
I_true = scale_true * polydisperse_sphere(q, R_true, sigma_true)

# Add 5% multiplicative noise
rng      = np.random.default_rng(seed=7)
epsilon  = 0.05                          # fractional uncertainty
I_data   = I_true * rng.lognormal(0, epsilon, size=len(q))  # (1)
sigma_I  = I_data * epsilon              # per-point sigma = 5% of measured intensity
```

1. `rng.lognormal(0, epsilon)` adds multiplicative noise that is symmetric on a log
   scale — a 5% upward fluctuation is as likely as a 5% downward one. This is more
   realistic than additive Gaussian noise for Poisson-counted detector data.

Plot the fake data with error bars:

```python
fig, ax = plt.subplots(figsize=(8, 5))
ax.errorbar(q, I_data, yerr=sigma_I, fmt=".", color="steelblue",
            alpha=0.6, capsize=0, label="Fake SAXS data")
ax.set_xscale("log")
ax.set_yscale("log")
ax.set_xlabel(r"$q$ (Å$^{-1}$)")
ax.set_ylabel(r"$I(q)$")
ax.legend()
plt.tight_layout()
plt.show()
```

## Defining the fit function

The fit function must follow the `curve_fit` convention: first argument is the
independent variable, remaining arguments are the parameters:

```python
def saxs_sphere_model(q, R_mean, sigma_R, scale):
    """
    Polydisperse sphere form factor with a scale factor.

    Parameters
    ----------
    q : array-like
        Scattering vector in Å^-1.
    R_mean : float
        Mean sphere radius in Å.
    sigma_R : float
        Radius standard deviation in Å.
    scale : float
        Overall intensity scale factor.
    """
    return scale * polydisperse_sphere(q, R_mean, sigma_R)
```

The `scale` parameter absorbs the overall intensity — in a real experiment this
encodes concentration, contrast, and instrument calibration.

## Running the fit

Choose initial guesses that are plausible but deliberately off from the true values:

```python
p0     = [60.0, 5.0, 1.0]   # R_mean=60 Å, sigma_R=5 Å, scale=1
bounds = ([5, 0.1, 0.01], [500, 100, 100])   # (1)

popt, pcov = curve_fit(
    saxs_sphere_model,
    q,
    I_data,
    p0=p0,
    sigma=sigma_I,          # log-scale weighting
    absolute_sigma=True,
    bounds=bounds,
    maxfev=5000,             # (2)
)

R_fit, sigma_R_fit, scale_fit = popt
R_err, sigma_R_err, scale_err = np.sqrt(np.diag(pcov))

print(f"R_mean  = {R_fit:.1f} ± {R_err:.1f} Å        (true: {R_true} Å)")
print(f"sigma_R = {sigma_R_fit:.1f} ± {sigma_R_err:.1f} Å   (true: {sigma_true} Å)")
print(f"scale   = {scale_fit:.3f} ± {scale_err:.3f}     (true: {scale_true})")
```

1. Bounds prevent the optimizer from exploring unphysical parameter values (negative
   radii, zero scale). For scattering models this is important — the form factor
   function may behave poorly outside the physical range.
2. Scattering models are nonlinear and may require more iterations than the default
   limit. `maxfev=5000` provides enough room for most fits.

## Reduced chi-squared

```python
residuals    = I_data - saxs_sphere_model(q, *popt)
chi2         = np.sum((residuals / sigma_I)**2)
n_dof        = len(q) - len(popt)
chi2_reduced = chi2 / n_dof

print(f"Reduced χ² = {chi2_reduced:.3f}")
```

For a good fit to data with well-estimated errors this should be close to 1.0.

## Plotting the fit and confidence band

```python
# Confidence band via Monte Carlo sampling
n_samples     = 1000
param_samples = rng.multivariate_normal(popt, pcov, n_samples)
curves        = np.array([saxs_sphere_model(q, *p) for p in param_samples
                           if p[0] > 0 and p[1] > 0 and p[2] > 0])  # (1)
band_lo = np.percentile(curves, 16, axis=0)
band_hi = np.percentile(curves, 84, axis=0)

I_fit = saxs_sphere_model(q, *popt)

fig, ax = plt.subplots(figsize=(8, 5))
ax.fill_between(q, band_lo, band_hi, color="tomato", alpha=0.3,
                label="68% confidence band")
ax.loglog(q, I_fit,   color="tomato",   linewidth=2, label="Best fit")
ax.loglog(q, I_data,  color="steelblue", linewidth=0,
          marker=".", markersize=3, alpha=0.6, label="Data")
ax.loglog(q, I_true,  color="gray",    linestyle="--", linewidth=1,
          label="True curve")
ax.set_xlabel(r"$q$ (Å$^{-1}$)")
ax.set_ylabel(r"$I(q)$")
ax.legend()
ax.set_title(f"Fitted: R = {R_fit:.1f}±{R_err:.1f} Å, "
             f"σ = {sigma_R_fit:.1f}±{sigma_R_err:.1f} Å")
plt.tight_layout()
plt.show()
```

1. Sampled parameter sets occasionally include unphysical values (e.g. negative
   radius). Filtering those out before computing percentiles avoids `nan` values in
   the band.

## Correlation matrix

```python
param_names  = ["R_mean", "σ_R", "scale"]
sigma_params = np.sqrt(np.diag(pcov))
corr         = pcov / np.outer(sigma_params, sigma_params)

fig, ax = plt.subplots(figsize=(4.5, 4))
im = ax.imshow(corr, vmin=-1, vmax=1, cmap="RdBu_r")
plt.colorbar(im, ax=ax)
ax.set_xticks(range(3))
ax.set_yticks(range(3))
ax.set_xticklabels(param_names, fontsize=9)
ax.set_yticklabels(param_names, fontsize=9)
for i in range(3):
    for j in range(3):
        ax.text(j, i, f"{corr[i, j]:.2f}", ha="center", va="center", fontsize=10)
ax.set_title("SAXS fit correlation matrix")
plt.tight_layout()
plt.show()
```

Examine the correlation between `R_mean` and `sigma_R`. For a polydisperse sphere
model these two parameters are partially correlated — a larger mean radius can be
partially offset by broader polydispersity to produce similar oscillation washing.
This is reflected in the off-diagonal entry. It will be non-negligible but should be
well below 0.9 for clean data with visible oscillations.

!!! example "Try It Yourself"
    1. Change the initial guess `p0 = [60.0, 5.0, 1.0]` to a value far from the
       truth, say `p0 = [200.0, 20.0, 1.0]`. Does `curve_fit` still converge to the
       correct answer? What happens if you try `p0 = [5.0, 0.5, 1.0]`?
    2. Increase the noise level from `epsilon = 0.05` to `epsilon = 0.30` (30%
       noise). How do the parameter uncertainties change? Does the reduced chi-squared
       remain close to 1.0?
    3. Set `sigma_true = 1.0` Å (nearly monodisperse). What happens to the
       oscillations in the fake data? Is `curve_fit` able to reliably recover
       `sigma_R`? Look at the parameter correlation matrix — what does it tell you
       about fitting polydispersity from data without visible oscillations?
    4. Replace `sigma_I = I_data * epsilon` with `sigma_I = np.full_like(I_data,
       epsilon)` (constant, unweighted errors). Re-run the fit. How do the recovered
       parameters change? Does the fit still describe the oscillations at large $q$?

??? success "Solution"
    **Part 1:** With `p0 = [200.0, 20.0, 1.0]` the fit typically converges, though
    it may take more iterations. With `p0 = [5.0, 0.5, 1.0]` the optimizer may get
    stuck in a local minimum or fail entirely — the form factor at R = 5 Å looks
    completely different from the true curve. This illustrates why reasonable initial
    guesses are critical for nonlinear models.

    **Part 2:** At 30% noise the parameter uncertainties roughly triple relative to
    5% noise. The reduced chi-squared stays near 1.0 as long as the sigma values are
    correctly specified as `I_data * epsilon`.

    **Part 3:** With nearly monodisperse data the oscillations are sharp and
    prominent. However, `sigma_R` is poorly constrained because very small
    polydispersity values produce nearly identical scattering curves — the data is
    insensitive to the exact value of `sigma_R` once it is small. The correlation
    between `R_mean` and `sigma_R` may increase significantly.

    **Part 4:** With constant (unweighted) errors the optimizer ignores the large-$q$
    oscillations entirely. The fit matches the low-$q$ plateau well but fails at high
    $q$. The recovered `R_mean` may be systematically off because the oscillation
    positions — which carry the radius information — were effectively not used in the
    fit.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_03_fitting.ipynb
    $ git commit -m "fit polydisperse sphere to fake SAXS data with log-scale weighting"
    ```

---

**What's next:** [Section 4 →](../section4-shells/index.md) — extending the sphere model with concentric shells and connecting the hollow sphere geometry to the physics of lipid vesicles.
