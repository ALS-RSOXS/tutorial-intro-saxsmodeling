# Multiple Shells

The core-shell model has two regions. The pattern extends naturally to any number of
concentric shells — each with its own SLD — and the code structure mirrors the physics:
loop over the shells, accumulate their amplitude contributions, then square.

## The general multi-shell amplitude

For a sphere with $N$ concentric shells, numbered from the innermost (index 1) to the
outermost (index $N$), embedded in a matrix with SLD $\rho_m$, the total amplitude is:

$$F(q) = \sum_{i=1}^{N} (\rho_i - \rho_{i+1})\, V_i\, F(q, R_i)$$

where $\rho_{N+1} = \rho_m$ is the matrix SLD, $R_i$ is the outer radius of shell $i$,
$V_i = \frac{4}{3}\pi R_i^3$ is the volume of a sphere of that radius, and $F(q, R_i)$
is the sphere amplitude from the previous page.

Notice that the core-shell model from the previous page is exactly this formula with
$N = 2$. The generalization costs nothing conceptually — only the loop length changes.

## Implementation

```python
def multi_shell_form_factor(q, radii, slds, rho_matrix):
    """
    Normalized form factor P(q) for a multi-shell sphere.

    Parameters
    ----------
    q : array-like
        Scattering vector in Å^-1.
    radii : list of float
        Outer radius of each shell from innermost to outermost, in Å.
        radii[0] is the core radius; radii[-1] is the total particle radius.
    slds : list of float
        SLD of each shell from innermost to outermost, in Å^-2.
        Must be the same length as radii.
    rho_matrix : float
        SLD of the surrounding medium in Å^-2.

    Returns
    -------
    numpy.ndarray
        P(q), normalized to 1 at q -> 0.
    """
    # Append the matrix as the region beyond the outermost shell
    slds_ext = list(slds) + [rho_matrix]  # (1)

    F  = np.zeros_like(q, dtype=float)
    F0 = 0.0

    for i, R in enumerate(radii):
        V          = (4/3) * np.pi * R**3
        delta_rho  = slds_ext[i] - slds_ext[i + 1]  # (2)
        F  += delta_rho * V * sphere_amplitude(q, R)
        F0 += delta_rho * V                           # F at q=0

    return (F / F0)**2
```

1. Appending `rho_matrix` means the last contrast step — at the outer surface of the
   particle — is always `slds[-1] - rho_matrix`, consistent with the core-shell
   derivation on the previous page.
2. The contrast at each boundary is the SLD of the current shell minus the SLD of the
   next shell outward. This is the same pattern as the core-shell formula, now handled
   by the loop index.

## Verifying against the core-shell function

Before using the new function, confirm it gives the same result as `core_shell_form_factor`:

```python
R_core  = 40.0
t_shell = 15.0
rho_core   = 10.0e-6
rho_shell  = 14.0e-6
rho_matrix =  9.47e-6

P_cs    = core_shell_form_factor(q, R_core, t_shell,
                                  rho_core, rho_shell, rho_matrix)

P_multi = multi_shell_form_factor(q,
                                   radii=[R_core, R_core + t_shell],
                                   slds=[rho_core, rho_shell],
                                   rho_matrix=rho_matrix)

# The two arrays should be identical to numerical precision
print(f"Max difference: {np.max(np.abs(P_cs - P_multi)):.2e}")
```

The maximum difference should be at the level of floating-point rounding error
(around $10^{-15}$). If it is larger, check that the radius and SLD lists are in the
same order.

## Three-shell example

Now add a third shell and observe the effect:

```python
radii = [30.0, 45.0, 60.0]           # core, middle shell, outer shell (Å)
slds  = [8.0e-6, 14.0e-6, 10.5e-6]  # SLD of each region (Å^-2)
rho_matrix = 9.47e-6                  # water

P_three = multi_shell_form_factor(q, radii, slds, rho_matrix)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_three, label="Three-shell sphere", ax=ax, color="seagreen")
ax.set_title("Three-shell form factor")
plt.tight_layout()
plt.show()
```

Each additional shell introduces a new length scale into the problem. The resulting
curve contains interference contributions from every shell boundary, which generally
makes the oscillation pattern less regular than for a simple solid sphere.

!!! example "Try It Yourself"
    1. Starting from the three-shell example above, set all three SLD values equal
       to each other (but different from the matrix). What does the form factor look
       like? Why?
    2. Set the outer shell SLD equal to the matrix SLD. How does the curve change
       compared to the full three-shell case?
    3. Add a fourth shell. How does increasing the number of shells change the
       complexity of the oscillation pattern?

??? success "Solution"
    **Part 1:** When all shells have the same SLD, the particle is a uniform solid
    sphere of radius `radii[-1]`. Each internal contrast step $\rho_i - \rho_{i+1}$
    is zero, so only the outermost boundary contributes. The result is identical to
    `sphere_amplitude(q, radii[-1])**2`.

    **Part 2:** Setting the outer shell SLD to `rho_matrix` zeroes out the outermost
    contrast step. The visible particle is now a two-shell sphere with outer radius
    `radii[1]` — equivalent to calling `multi_shell_form_factor` with only the first
    two radii and SLD values.

    **Part 3:** Each new shell boundary adds another term to the amplitude sum. The
    oscillations become more complex because more length scales are present. In
    practice, experimental data rarely resolves more than two or three distinct
    oscillation periods, which limits how many shells can be meaningfully fit to data.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_shells.ipynb
    $ git commit -m "add multi_shell_form_factor for N-shell models"
    ```

---

**What's next:** [The Hollow Sphere](3-hollow-sphere.md) — a guided discovery of what
happens when the core and matrix have the same SLD.
