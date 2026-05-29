# Chi-Squared and Fitting a Line

When a model has free parameters — a radius, a polydispersity, an SLD — fitting is
the process of finding the values that make the model agree with measured data as
closely as possible. To do this systematically we need a single number that quantifies
how well the model describes the data at any given set of parameters. That number is
**chi-squared**.

## The chi-squared statistic

$$\chi^2(\theta) = \sum_{i=1}^{N} \left(\frac{y_i - f(x_i;\, \theta)}{\sigma_i}\right)^2$$

Each term is the **residual** — the difference between the measured value $y_i$ and
the model prediction $f(x_i; \theta)$ — divided by the measurement uncertainty
$\sigma_i$. Squaring makes every term positive and penalizes large deviations more
than small ones. Dividing by $\sigma_i$ ensures that a noisier data point contributes
less to the total than a precisely measured one.

**Minimizing $\chi^2$** over the parameter space $\theta$ finds the parameter values
that bring the model closest to the data, weighted by measurement precision. This is
**least-squares fitting**.

!!! note "Key Concept: Reduced Chi-Squared"
    The raw $\chi^2$ value grows with the number of data points, making it hard to
    compare fits across datasets. The **reduced chi-squared** $\chi^2_\nu = \chi^2 / \nu$
    divides by the number of degrees of freedom $\nu = N - k$, where $N$ is the number
    of data points and $k$ is the number of free parameters.

    A good fit has $\chi^2_\nu \approx 1$. Much larger means the model does not
    describe the data (or uncertainties are underestimated). Much smaller means the
    uncertainties are overestimated, or the model is being over-fitted.

## Introducing `scipy.optimize.curve_fit`

`scipy.optimize.curve_fit` minimizes $\chi^2$ for any model function you provide.
It returns two things:

- `popt` — the best-fit parameter values
- `pcov` — the **covariance matrix**, a square array that encodes the uncertainty on
  each parameter and how the parameters are correlated with each other

Add a new notebook `chapter_03_fitting.ipynb` and start with:

```python
import numpy as np
import matplotlib.pyplot as plt
from scipy.optimize import curve_fit
```

## Building a fake dataset

We will start with the simplest possible model — a straight line — so that we can
verify the fit results against known true values.

```python
# True model parameters
m_true = 2.5
b_true = -1.0

# Data points and constant measurement uncertainty
rng = np.random.default_rng(seed=42)  # (1)
x      = np.linspace(0, 10, 30)
sigma  = np.full_like(x, 0.5)         # constant 0.5-unit uncertainty on every point
y_true = m_true * x + b_true
y_data = y_true + rng.normal(0, sigma)  # (2)
```

1. `np.random.default_rng(seed=42)` creates a reproducible random number generator.
   Using a fixed seed means this notebook produces the same numbers every time it runs.
2. `rng.normal(0, sigma)` draws one Gaussian-distributed noise value per point, each
   with mean 0 and standard deviation equal to the corresponding `sigma` entry.

Plot the data with error bars:

```python
fig, ax = plt.subplots(figsize=(7, 4))
ax.errorbar(x, y_data, yerr=sigma, fmt="o", color="steelblue",
            capsize=3, label="Noisy data")
ax.plot(x, y_true, color="gray", linestyle="--", linewidth=1, label="True line")
ax.set_xlabel("x")
ax.set_ylabel("y")
ax.legend()
plt.tight_layout()
plt.show()
```

## Defining the model function

`curve_fit` requires a function whose first argument is the independent variable and
whose remaining arguments are the parameters to be fitted:

```python
def line_model(x, m, b):
    """Straight line: y = m*x + b."""
    return m * x + b
```

## Running the fit

```python
p0 = [1.0, 0.0]  # (1) initial parameter guesses: m=1, b=0

popt, pcov = curve_fit(
    line_model,        # model function
    x,                 # independent variable
    y_data,            # measured data
    p0=p0,
    sigma=sigma,       # per-point uncertainties
    absolute_sigma=True,  # (2)
)

m_fit, b_fit     = popt
m_err, b_err     = np.sqrt(np.diag(pcov))  # (3)

print(f"m = {m_fit:.3f} ± {m_err:.3f}   (true: {m_true})")
print(f"b = {b_fit:.3f} ± {b_err:.3f}   (true: {b_true})")
```

1. Initial guesses tell `curve_fit` where to start searching. For a line these do not
   matter much, but for nonlinear models (including scattering form factors) a
   reasonable starting point is essential.
2. `absolute_sigma=True` tells `curve_fit` to treat the `sigma` values as actual
   measurement uncertainties in the same units as `y_data`. Without this flag, the
   covariance matrix is rescaled by the residuals and the uncertainties lose their
   physical meaning.
3. The diagonal of `pcov` contains the **variance** of each parameter. Taking the
   square root gives the **standard deviation** — the parameter uncertainty.

The fitted values should be close to the true values of $m = 2.5$ and $b = -1.0$,
with uncertainties that reflect the noise level.

## Plotting the fit

```python
x_fine = np.linspace(0, 10, 200)
y_fit  = line_model(x_fine, *popt)

fig, ax = plt.subplots(figsize=(7, 4))
ax.errorbar(x, y_data, yerr=sigma, fmt="o", color="steelblue",
            capsize=3, label="Data")
ax.plot(x_fine, y_fit, color="tomato", linewidth=2,
        label=f"Fit: m={m_fit:.2f}±{m_err:.2f}, b={b_fit:.2f}±{b_err:.2f}")
ax.plot(x, y_true, color="gray", linestyle="--", linewidth=1, label="True line")
ax.set_xlabel("x")
ax.set_ylabel("y")
ax.legend()
plt.tight_layout()
plt.show()
```

## Reduced chi-squared

Check the quality of the fit:

```python
residuals    = y_data - line_model(x, *popt)
chi2         = np.sum((residuals / sigma)**2)
n_dof        = len(x) - len(popt)       # degrees of freedom
chi2_reduced = chi2 / n_dof

print(f"χ² = {chi2:.2f}")
print(f"Degrees of freedom = {n_dof}")
print(f"Reduced χ² = {chi2_reduced:.2f}")
```

A value near 1.0 confirms the fit is good and the noise model is consistent with the
data.

!!! example "Try It Yourself"
    1. Change `m_true = 2.5` to `m_true = 5.0` and re-run the cell that generates
       `y_data`. Without changing `p0`, does `curve_fit` still find the correct answer?
       What does this tell you about the sensitivity of linear fitting to initial
       guesses?
    2. Increase `sigma` to 2.0. How do the parameter uncertainties change? Does the
       reduced chi-squared change?
    3. Reduce the number of data points from 30 to 5. What happens to the
       uncertainties and the reduced chi-squared?

??? success "Solution"
    **Part 1:** Yes — `curve_fit` finds the correct answer regardless of the initial
    guess for a linear model. Linear least-squares has a unique global minimum and no
    local minima to get trapped in. This is one of the reasons fitting is often done
    on linearized data when possible.

    **Part 2:** Larger `sigma` (noisier data) produces larger parameter uncertainties
    (proportional to `sigma`). The reduced chi-squared stays near 1.0 because both the
    residuals and the expected uncertainties scale together.

    **Part 3:** With only 5 points and 2 parameters there are only 3 degrees of
    freedom. The uncertainties grow significantly. With very few points the reduced
    chi-squared also becomes more variable — it can differ substantially from 1.0 by
    chance even when the model is correct.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_03_fitting.ipynb
    $ git commit -m "add chi-squared fitting of noisy line with scipy curve_fit"
    ```

---

**What's next:** [Interpreting the Results](2-interpreting-results.md) — extracting
parameter uncertainties, plotting confidence bands, and reading the correlation matrix.
