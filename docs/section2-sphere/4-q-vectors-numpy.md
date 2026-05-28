# q-Vectors in NumPy

It is time to open your notebook and start writing code. Create a new notebook called
`chapter_02_sphere.ipynb` in your `saxs-tutorial` project folder. Add a markdown cell
at the top:

```markdown
# Chapter 2: Scattering from a Sphere

Building the form factor model for a solid sphere.
```

## Generating a q array

The scattering vector $q$ runs from very small values (large-scale structure) to large
values (fine detail). A typical SAXS measurement covers several orders of magnitude in
$q$, so we need our array to have good coverage at both small and large values.

Add a code cell and type:

```python
import numpy as np

# q array spanning three decades in inverse angstroms
q = np.logspace(-3, 0, 500)  # (1)
```

1. `np.logspace(-3, 0, 500)` generates 500 points evenly spaced on a **log scale**,
   from $10^{-3}$ Å$^{-1}$ to $10^{0} = 1$ Å$^{-1}$. Compare this to
   `np.linspace(0.001, 1.0, 500)`, which would place almost all points at large $q$
   and leave the small-$q$ region nearly empty.

!!! info "Why logspace and not linspace?"
    Scattering features are spread across decades of $q$. With `np.linspace`, 99% of
    your points would fall between $q = 0.5$ and $q = 1.0$ — the large-$q$ tail where
    the intensity is low and featureless. `np.logspace` distributes points evenly on
    the scale that matters for visualization and analysis.

!!! tip "Units"
    The $q$ array above spans 0.001 to 1.0 Å$^{-1}$. This corresponds to length
    scales of roughly $2\pi/q = 6$ to $6000$ Å. If you are working from a paper that
    uses nm$^{-1}$, multiply their $q$ values by 0.1 to convert to Å$^{-1}$ before
    comparing with your model.

## The sphere form factor function

Add a second code cell and type the form factor function:

```python
def sphere_form_factor(q, R):
    """
    Normalized form factor P(q, R) for a solid sphere of radius R.

    Parameters
    ----------
    q : array-like
        Scattering vector in inverse angstroms (Å^-1).
    R : float
        Sphere radius in angstroms (Å).

    Returns
    -------
    numpy.ndarray
        P(q, R), normalized so that P(q -> 0) = 1.
    """
    qR = q * R
    with np.errstate(invalid="ignore", divide="ignore"):  # (1)
        F = np.where(
            qR < 1e-10,                                   # (2)
            1.0,
            3.0 * (np.sin(qR) - qR * np.cos(qR)) / qR**3
        )
    return F**2
```

1. Suppresses NumPy's divide-by-zero warning for the lines inside this block. We
   handle the problematic case explicitly on the next line.
2. When `qR` is very close to zero, we assign the analytically correct limit $F = 1$
   rather than computing $0/0$.

!!! info "The q = 0 singularity"
    At $q = 0$ the denominator $(qR)^3$ is zero, which would cause a division error.
    Mathematically, the limit of $F(q, R)$ as $q \to 0$ is 1 (this can be shown with
    L'Hôpital's rule). We handle this in code by checking whether `qR` is small and
    substituting the limit directly with `np.where`.

## Evaluating the function

Add a code cell to evaluate $P(q)$ for a sphere of radius 50 Å:

```python
R = 50.0  # radius in angstroms

P = sphere_form_factor(q, R)

print(f"P at q=0.001 Å^-1: {P[0]:.4f}")   # should be close to 1
print(f"P at q=1.0   Å^-1: {P[-1]:.2e}")  # should be much smaller
```

Confirm that the value at the smallest $q$ is very close to 1 and that the value at
large $q$ is many orders of magnitude smaller. If so, the function is working correctly.

!!! example "Try It Yourself"
    The first minimum of $P(q, R)$ occurs at $q_{\min} \approx 4.49 / R$.

    1. For a sphere of radius 50 Å, calculate the predicted $q_{\min}$.
    2. Find the index of the minimum in your `P` array using `np.argmin(P)` and
       compare the corresponding `q` value to your prediction.
    3. Try a different radius. Does the rule of thumb hold?

??? success "Solution"
    ```python
    R = 50.0
    q_min_predicted = 4.49 / R
    print(f"Predicted first minimum: q = {q_min_predicted:.4f} Å^-1")

    P = sphere_form_factor(q, R)
    idx_min = np.argmin(P)
    print(f"Observed first minimum:  q = {q[idx_min]:.4f} Å^-1")
    ```

    The two values should agree closely. The rule $q_{\min} \approx 4.49 / R$ comes
    from the first zero of the derivative of the amplitude $F(q, R)$, which occurs
    exactly at $qR = 4.493$.

    Repeating with $R = 100$ Å shifts the minimum to half the $q$ value, confirming
    that larger spheres produce features at smaller $q$.

---

**What's next:** [Plotting on a Log Scale](5-plotting-loglog.md) — visualizing $P(q)$
in a way that reveals all of its features at once.
