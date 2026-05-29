# Interpreting the Results

`curve_fit` returns `popt` (the best-fit parameters) and `pcov` (the covariance
matrix). The covariance matrix is the key to understanding not just *what* the best
values are, but *how confident* you should be in them and *whether the parameters are
independent of each other*.

## The covariance matrix

The covariance matrix $\mathbf{C}$ is a $k \times k$ symmetric matrix for a model
with $k$ free parameters:

$$\mathbf{C} = \begin{pmatrix} \text{Var}(m) & \text{Cov}(m,b) \\ \text{Cov}(b,m) & \text{Var}(b) \end{pmatrix}$$

- The **diagonal entries** $C_{ii} = \text{Var}(\theta_i)$ are the variances of each
  parameter. Taking $\sqrt{C_{ii}}$ gives the standard deviation — the parameter
  uncertainty reported alongside the best-fit value.
- The **off-diagonal entries** $C_{ij} = \text{Cov}(\theta_i, \theta_j)$ measure how
  much the uncertainty in parameter $i$ is shared with parameter $j$. A large
  off-diagonal entry means the two parameters are not independently constrained by the
  data.

## The correlation matrix

The covariance matrix mixes units of different parameters, making it hard to read
directly. Converting it to a **correlation matrix** normalizes each entry to lie
between $-1$ and $1$:

$$r_{ij} = \frac{C_{ij}}{\sqrt{C_{ii}\, C_{jj}}}$$

A value of $r_{ij} = 0$ means the two parameters are independent. A value near $\pm 1$
means they are strongly correlated — changing one parameter can be nearly compensated
by changing the other, making it impossible for the optimizer to determine either
precisely.

!!! note "Key Concept: Why Correlation Matters"
    High parameter correlation is a warning sign. If $|r_{ij}| > 0.9$, the data
    cannot uniquely determine both parameters simultaneously. The fit may report a
    low $\chi^2$ while returning parameter values and uncertainties that are physically
    meaningless.

    For a straight line $y = mx + b$, $m$ and $b$ are only uncorrelated if the data
    is centred near $x = 0$. If the data spans $x = 100$–$110$, the intercept $b$ is
    far from the data range and will be strongly correlated with $m$.

## Computing and plotting the correlation matrix

Continuing in your notebook from the previous page:

```python
# Correlation matrix from covariance matrix
sigma_params = np.sqrt(np.diag(pcov))
corr = pcov / np.outer(sigma_params, sigma_params)

param_names = ["m", "b"]

fig, ax = plt.subplots(figsize=(3.5, 3))
im = ax.imshow(corr, vmin=-1, vmax=1, cmap="RdBu_r")  # (1)
plt.colorbar(im, ax=ax)

ax.set_xticks(range(len(param_names)))
ax.set_yticks(range(len(param_names)))
ax.set_xticklabels(param_names)
ax.set_yticklabels(param_names)

for i in range(len(param_names)):
    for j in range(len(param_names)):
        ax.text(j, i, f"{corr[i, j]:.2f}", ha="center", va="center",
                fontsize=11, color="black")

ax.set_title("Parameter correlation matrix")
plt.tight_layout()
plt.show()
```

1. `cmap="RdBu_r"` uses a red-white-blue colormap: blue for strong positive
   correlation, red for strong negative, white for zero. Centering at 0 with
   `vmin=-1, vmax=1` makes the scale interpretable.

The diagonal should be exactly 1.0 (every parameter is perfectly correlated with
itself). For a line fit on data spanning $x = 0$–$10$, the off-diagonal entry
will be small but nonzero. The further the data is from $x = 0$, the larger this
correlation becomes.

## Confidence bands

The best-fit curve passes through the middle of the uncertainty. A **confidence band**
shows the range of curves that are consistent with the data within the parameter
uncertainties — a shaded region around the best-fit line.

We generate the band by sampling many parameter sets from the fitted parameter
distribution (a multivariate Gaussian centred at `popt` with covariance `pcov`),
evaluating the model for each sample, and taking percentiles:

```python
n_samples = 2000
x_fine    = np.linspace(0, 10, 200)

# Sample parameter sets from the posterior distribution
param_samples = rng.multivariate_normal(popt, pcov, n_samples)  # (1)

# Evaluate model for each sample
curves = np.array([line_model(x_fine, *p) for p in param_samples])

# 68% confidence interval (1-sigma equivalent)
band_lo = np.percentile(curves, 16, axis=0)  # (2)
band_hi = np.percentile(curves, 84, axis=0)
```

1. `np.random.default_rng.multivariate_normal` draws parameter sets consistent with
   the covariance structure of the fit. Parameter combinations that are unlikely given
   the data will rarely be sampled.
2. The 16th and 84th percentiles bracket the central 68% of the distribution —
   equivalent to a $\pm 1\sigma$ interval for a Gaussian.

Plot the result:

```python
y_fit = line_model(x_fine, *popt)

fig, ax = plt.subplots(figsize=(7, 4))
ax.fill_between(x_fine, band_lo, band_hi,
                color="tomato", alpha=0.3, label="68% confidence band")
ax.plot(x_fine, y_fit, color="tomato", linewidth=2, label="Best fit")
ax.errorbar(x, y_data, yerr=sigma, fmt="o", color="steelblue",
            capsize=3, label="Data")
ax.plot(x, y_true, color="gray", linestyle="--", linewidth=1,
        label="True line")
ax.set_xlabel("x")
ax.set_ylabel("y")
ax.legend()
plt.tight_layout()
plt.show()
```

The shaded band should be narrow — reflecting the small parameter uncertainties of a
line fit to 30 data points — and should enclose the true line most of the time.

!!! example "Try It Yourself"
    1. Shift all x-values so the data spans $x = 100$–$110$ instead of $0$–$10$
       (add 100 to every x value). Re-run the fit. How does the correlation between
       $m$ and $b$ change in the correlation matrix? Does the confidence band become
       wider?
    2. Reduce `n_samples` from 2000 to 10. What happens to the smoothness of the
       confidence band? How many samples are needed for a visually clean result?
    3. Change the confidence band from 68% (1σ) to 95% (2σ) by changing the
       percentile values. How much wider does the band become?

??? success "Solution"
    **Part 1:** Shifting to $x = 100$–$110$ places the intercept far from the data
    range, making $b$ largely determined by extrapolation. The off-diagonal correlation
    increases dramatically (often above 0.99). The confidence band becomes visibly
    wider because the two parameters cannot be independently determined.

    **Part 2:** With only 10 samples the band is jagged and unreliable — individual
    extreme parameter draws create visible spikes. Around 500–1000 samples produces a
    smooth band for a two-parameter model. More complex models need more samples.

    **Part 3:**
    ```python
    band_lo_2sig = np.percentile(curves, 2.5, axis=0)
    band_hi_2sig = np.percentile(curves, 97.5, axis=0)
    ```
    The 95% band is approximately twice as wide as the 68% band for a Gaussian
    distribution (1.96σ vs 1σ).

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_03_fitting.ipynb
    $ git commit -m "add covariance matrix, confidence band, and correlation matrix"
    ```

---

**What's next:** [Fitting Scattering Data](3-fitting-saxs.md) — applying these tools
to the sphere form factor with log-scale-weighted residuals.
