# Effect of Sphere Size

With a working form factor function and a clean plotting routine, we can now do
something genuinely useful: observe how the scattering curve changes as we vary the
sphere radius, and build the intuition needed to read a scattering curve in reverse —
that is, to infer a size from the shape of the data.

## Overlaying curves for different radii

Add this cell to your notebook:

```python
radii = [25, 50, 100, 200]  # radii in angstroms
colors = ["steelblue", "tomato", "seagreen", "darkorchid"]

fig, ax = plt.subplots(figsize=(8, 5))

for R, color in zip(radii, colors):
    P = sphere_form_factor(q, R)
    plot_form_factor(q, P, label=f"R = {R} Å", ax=ax, color=color)

ax.set_title("Form factor for spheres of different radii")
plt.tight_layout()
plt.show()
```

Look at the resulting plot before reading on. What do you notice?

## What changes with radius

!!! note "Key Concept: Size and the Scattering Curve"
    Increasing the sphere radius does two things simultaneously:

    1. **The features shift to smaller $q$.** The first minimum moves to lower $q$
       values because $q_{\min} \approx 4.49 / R$. A larger sphere produces structure
       at larger length scales, which appears at smaller $q$.

    2. **The oscillations become more closely spaced.** Larger spheres oscillate more
       rapidly in $q$, producing more visible fringes within any given $q$ range.

    The shape of the curve — the plateau, the oscillations, the $q^{-4}$ tail — is
    identical for all spheres. Only the scale changes. This is the hallmark of a form
    factor: it depends on geometry (radius), not on material properties.

## Locating the first minimum

Add this cell to mark the first minimum of each curve:

```python
fig, ax = plt.subplots(figsize=(8, 5))

for R, color in zip(radii, colors):
    P = sphere_form_factor(q, R)
    plot_form_factor(q, P, label=f"R = {R} Å", ax=ax, color=color)

    # Mark the first minimum
    idx_min = np.argmin(P)
    ax.axvline(q[idx_min], color=color, linestyle=":", linewidth=0.8, alpha=0.7)

ax.set_title("First minima marked with dotted lines")
plt.tight_layout()
plt.show()
```

Verify that each dotted line falls at approximately $4.49 / R$ for its corresponding
radius.

## Reading size from a mystery curve

The following code generates a scattering curve from a sphere of unknown radius and
adds a small amount of noise to simulate real data:

```python
rng = np.random.default_rng(seed=42)

R_mystery = None  # hidden — do not look at this line yet!
R_mystery = 75.0  # (hidden from view in the exercise)

P_mystery = sphere_form_factor(q, R_mystery)
noise = rng.normal(loc=0, scale=0.005 * P_mystery.max(), size=P_mystery.shape)
I_noisy = P_mystery + noise
I_noisy = np.clip(I_noisy, 1e-10, None)  # keep values positive for log scale
```

!!! example "Try It Yourself"
    Plot `I_noisy` on log-log axes using your `plot_form_factor` function (you may
    need to pass `I_noisy` instead of `P`).

    1. Identify the position of the first minimum in the noisy curve as accurately as
       you can.
    2. Use the rule $R \approx 4.49 / q_{\min}$ to estimate the mystery radius.
    3. How close is your estimate to the true value of 75 Å?

??? success "Solution"
    ```python
    fig, ax = plt.subplots(figsize=(7, 5))
    plot_form_factor(q, I_noisy, label="Mystery sphere", ax=ax, color="gray")

    # Estimate the minimum position
    idx_min = np.argmin(I_noisy)
    q_min_obs = q[idx_min]
    R_estimate = 4.49 / q_min_obs

    print(f"Observed first minimum at q = {q_min_obs:.4f} Å^-1")
    print(f"Estimated radius: R = {R_estimate:.1f} Å")
    print(f"True radius:      R = 75.0 Å")

    ax.axvline(q_min_obs, color="tomato", linestyle="--", label=f"q_min = {q_min_obs:.4f} Å^-1")
    ax.legend()
    plt.tight_layout()
    plt.show()
    ```

    With a clean minimum the estimate should be within a few angstroms of 75 Å. In
    real data, noise and polydispersity (addressed on the next page) can broaden or
    wash out the minimum, making the estimate less precise.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_02_sphere.ipynb
    $ git commit -m "explore effect of sphere radius on scattering curve"
    ```

---

**What's next:** [Polydispersity](7-polydispersity.md) — accounting for the fact that
real samples contain a distribution of sphere sizes, not a single radius.
