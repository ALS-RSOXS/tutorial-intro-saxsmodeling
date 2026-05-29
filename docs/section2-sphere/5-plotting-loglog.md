# Plotting on a Log Scale

Scattering data spans many orders of magnitude in both $q$ and $I(q)$. Plotting on a
linear scale hides almost everything interesting. This page shows why log-log plots
are the standard for scattering data and walks through building a publication-ready
figure with Matplotlib.

## Why linear scale fails

Add a code cell to your notebook and plot $P(q)$ on a linear scale first:

```python
import matplotlib.pyplot as plt

R = 50.0
P = sphere_form_factor(q, R)

fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(q, P, color="steelblue")
ax.set_xlabel(r"$q$ (Å$^{-1}$)")
ax.set_ylabel(r"$P(q)$")
ax.set_title("Linear scale")
plt.tight_layout()
plt.show()
```

The curve appears to drop immediately to zero and stay there. All of the oscillation
structure — the features that carry information about the sphere radius — is invisible
because the intensity at large $q$ is millions of times smaller than at small $q$.

## Switching to log-log

Add another code cell and use logarithmic axes:

```python
fig, ax = plt.subplots(figsize=(7, 4))
ax.plot(q, P, color="steelblue")
ax.set_xscale("log")  # (1)
ax.set_yscale("log")
ax.set_xlabel(r"$q$ (Å$^{-1}$)")
ax.set_ylabel(r"$P(q)$")
ax.set_title("Log-log scale")
plt.tight_layout()
plt.show()
```

1. `ax.set_xscale("log")` and `ax.set_yscale("log")` switch both axes to logarithmic
   spacing. This is a one-line change from the linear version above.

Now you can see the full structure of the curve: the flat plateau at low $q$, the
oscillations at intermediate $q$, and the power-law decay at large $q$.

## Side-by-side comparison

Seeing both scales together makes the difference concrete. Add this cell:

```python
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

for ax in axes:
    ax.plot(q, P, color="steelblue")
    ax.set_xlabel(r"$q$ (Å$^{-1}$)")
    ax.set_ylabel(r"$P(q)$")

axes[0].set_title("Linear scale")
axes[1].set_xscale("log")
axes[1].set_yscale("log")
axes[1].set_title("Log-log scale")

plt.tight_layout()
plt.show()
```

## Building a clean scattering plot

For figures you will use in presentations or papers, a few small additions make a
significant difference. Add this cell as the template you will use for all remaining
plots in this tutorial:

```python
def plot_form_factor(q, P, label=None, ax=None, color="steelblue"):
    """Plot a form factor on log-log axes with standard formatting."""
    if ax is None:
        fig, ax = plt.subplots(figsize=(7, 5))

    ax.plot(q, P, color=color, label=label, linewidth=1.5)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel(r"$q$ (Å$^{-1}$)", fontsize=13)
    ax.set_ylabel(r"$P(q)$", fontsize=13)
    ax.tick_params(which="both", direction="in", top=True, right=True)  # (1)

    if label is not None:
        ax.legend(fontsize=11)

    return ax
```

1. `which="both"` adds tick marks for both major and minor gridlines.
   `direction="in"` points the ticks inward, which is the convention in most
   scientific journals.

Test the function:

```python
fig, ax = plt.subplots(figsize=(7, 5))
plot_form_factor(q, P, label=f"R = {R:.0f} Å", ax=ax)
plt.tight_layout()
plt.show()
```

!!! example "Try It Yourself"
    1. The low-$q$ plateau sits at $P = 1$ by definition. At what approximate value
       of $q$ does the curve leave the plateau and begin to fall for $R = 50$ Å?
       Does this match the prediction $q \sim 1/R$?
    2. At large $q$ the form factor follows a power law: $P(q) \propto q^{-4}$.
       Verify this by overlaying a line proportional to $q^{-4}$ on your log-log plot.
       On a log-log plot, a power law $q^n$ appears as a straight line with slope $n$.

??? success "Solution"
    **Part 1:** The plateau ends when $qR \sim 1$, so at $q \sim 1/R = 1/50 = 0.02$
    Å$^{-1}$. This is the region where the wavelength of the probe matches the size
    of the object — the transition between "can't resolve the sphere" (low $q$) and
    "resolves the sphere" (high $q$).

    **Part 2:**
    ```python
    fig, ax = plt.subplots(figsize=(7, 5))
    plot_form_factor(q, P, label=f"R = {R:.0f} Å", ax=ax)

    # Overlay a q^-4 reference line
    q_ref = q[q > 0.1]           # only the high-q region
    scale = P[q > 0.1][0]        # match the amplitude at the start of the region
    ax.plot(q_ref, scale * (q_ref / q_ref[0])**(-4),
            color="tomato", linestyle="--", label=r"$q^{-4}$")
    ax.legend()
    plt.tight_layout()
    plt.show()
    ```

    The dashed line should follow the envelope of the oscillations at large $q$. The
    $q^{-4}$ behavior (known as **Porod's law**) is a universal signature of sharp
    interfaces and does not depend on particle shape.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_02_sphere.ipynb
    $ git commit -m "add plot_form_factor log-log plotting helper"
    ```

---

**What's next:** [Effect of Sphere Size](6-effect-of-size.md) — varying the radius
and observing how the scattering curve changes.
