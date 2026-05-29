# Core-Shell Sphere

A **core-shell sphere** consists of a solid core with one SLD surrounded by a
concentric shell with a different SLD, all embedded in a matrix. This is a direct
extension of the solid sphere model — the key change is in how the amplitude is
computed.

## Why amplitudes, not intensities

Before writing any code, there is a conceptual point that must be clear.

!!! note "Key Concept: Adding Amplitudes, Then Squaring"
    When combining scattering from multiple regions, you must sum the **amplitudes**
    first and then square the result to get the intensity. You cannot add intensities
    directly.

    This matters because amplitudes can be positive or negative — they carry phase
    information about whether scattered waves reinforce or cancel each other. If you
    added intensities instead, you would always get more scattering as you add more
    material, which is physically wrong. Shells with the right SLD can reduce the
    total scattering by partially cancelling the core contribution.

    $$P(q) = \left[\sum_i F_i(q)\right]^2 \neq \sum_i F_i(q)^2$$

In Section 2 we defined the normalized form factor as the square of the amplitude:

$$P(q, R) = F(q, R)^2 = \left[\frac{3(\sin(qR) - qR\cos(qR))}{(qR)^3}\right]^2$$

For the core-shell model we need to work with the **unsquared amplitude** $F(q, R)$
so we can combine contributions from the core and shell before squaring.

## The core-shell amplitude

A core-shell sphere has three regions: core (radius $R_c$, SLD $\rho_c$), shell (outer
radius $R_s = R_c + t$, SLD $\rho_s$), and matrix (SLD $\rho_m$). The total scattering
amplitude is:

$$F_{\text{cs}}(q) = (\rho_c - \rho_s)\,V_c\,F(q, R_c) + (\rho_s - \rho_m)\,V_s\,F(q, R_s)$$

where $V = \frac{4}{3}\pi R^3$ and $F(q, R)$ is the unnormalized sphere amplitude.

The structure of this expression has a clear physical reading: each term is the
contribution of a uniform sphere at that radius, weighted by the **contrast step** at
its boundary. The first term describes what the core looks like relative to the shell
material. The second describes what the entire particle looks like relative to the
matrix.

The normalized form factor is:

$$P_{\text{cs}}(q) = \left[\frac{F_{\text{cs}}(q)}{F_{\text{cs}}(0)}\right]^2$$

where $F_{\text{cs}}(0) = (\rho_c - \rho_s)V_c + (\rho_s - \rho_m)V_s$ is the
zero-$q$ limit (obtained by substituting $F(q,R) = 1$).

## Implementation

Create `chapter_04_shells.ipynb` and paste in the helper functions from Section 2.
Then add the following new cells.

First, extract the unsquared amplitude from the Section 2 function:

```python
import numpy as np

def sphere_amplitude(q, R):
    """
    Unsquared scattering amplitude F(q, R) for a uniform sphere.

    Parameters
    ----------
    q : array-like
        Scattering vector in Å^-1.
    R : float
        Sphere radius in Å.

    Returns
    -------
    numpy.ndarray
        Amplitude, normalized to F(q -> 0) = 1.
    """
    qR = q * R
    with np.errstate(invalid="ignore", divide="ignore"):
        F = np.where(
            qR < 1e-10,
            1.0,
            3.0 * (np.sin(qR) - qR * np.cos(qR)) / qR**3
        )
    return F
```

Note that `sphere_form_factor` from Section 2 is just `sphere_amplitude(q, R)**2`.

Now add the core-shell function:

```python
def core_shell_form_factor(q, R_core, t_shell, rho_core, rho_shell, rho_matrix):
    """
    Normalized form factor P(q) for a core-shell sphere.

    Parameters
    ----------
    q : array-like
        Scattering vector in Å^-1.
    R_core : float
        Core radius in Å.
    t_shell : float
        Shell thickness in Å.
    rho_core : float
        Core SLD in Å^-2.
    rho_shell : float
        Shell SLD in Å^-2.
    rho_matrix : float
        Matrix SLD in Å^-2.

    Returns
    -------
    numpy.ndarray
        P(q), normalized to 1 at q -> 0.
    """
    R_total = R_core + t_shell
    V_core  = (4/3) * np.pi * R_core**3
    V_total = (4/3) * np.pi * R_total**3

    # Sum amplitudes with contrast-weighted volumes
    F = ((rho_core  - rho_shell)  * V_core  * sphere_amplitude(q, R_core) +
         (rho_shell - rho_matrix) * V_total * sphere_amplitude(q, R_total))

    # Zero-q normalization (sphere_amplitude -> 1 as q -> 0)
    F0 = ((rho_core  - rho_shell)  * V_core +
          (rho_shell - rho_matrix) * V_total)

    return (F / F0)**2
```

## Exploring the core-shell model

Generate a $q$ array and compare the core-shell form factor against the plain sphere:

```python
import matplotlib.pyplot as plt

q = np.logspace(-3, 0, 500)

# Baseline: solid sphere with same outer radius
R_core  = 40.0   # Å
t_shell = 15.0   # Å — shell thickness
R_total = R_core + t_shell

rho_core   = 10.0e-6   # Å^-2
rho_shell  = 14.0e-6   # Å^-2
rho_matrix =  9.47e-6  # water

P_sphere    = sphere_amplitude(q, R_total)**2
P_core_shell = core_shell_form_factor(q, R_core, t_shell,
                                       rho_core, rho_shell, rho_matrix)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_sphere,     label=f"Solid sphere R = {R_total} Å",  ax=ax, color="steelblue")
plot_form_factor(q, P_core_shell, label=f"Core-shell (core {R_core} Å + shell {t_shell} Å)", ax=ax, color="tomato")
ax.set_title("Core-shell vs solid sphere")
plt.tight_layout()
plt.show()
```

The core-shell curve has the same low-$q$ plateau but different oscillation positions
and depths compared to the solid sphere. The shell introduces a second length scale
into the problem — features from both $R_c$ and $R_s$ are present in the curve.

!!! example "Try It Yourself"
    Using the parameters above as a starting point:

    1. Set `rho_shell = rho_core`. What does the form factor look like? Does this
       make physical sense?
    2. Set `rho_shell = rho_matrix`. What does the form factor look like now? Which
       part of the particle is effectively invisible?
    3. Set `rho_shell` to a value between `rho_core` and `rho_matrix`. How does the
       depth of the oscillations change compared to the extremes above?

??? success "Solution"
    **Part 1:** When `rho_shell = rho_core`, the contrast step at the core-shell
    boundary disappears: $\rho_c - \rho_s = 0$. The first term in the amplitude
    vanishes and only the second term remains — which is identical to a solid sphere
    of radius $R_{\text{total}}$. The core-shell model reduces exactly to the solid
    sphere, as expected.

    **Part 2:** When `rho_shell = rho_matrix`, the contrast step at the outer
    surface disappears: $\rho_s - \rho_m = 0$. The second term vanishes and only the
    core contribution remains — equivalent to a solid sphere of radius $R_c$ with
    $\Delta\rho = \rho_c - \rho_m$. The shell is invisible because it matches the
    surrounding medium.

    **Part 3:** Intermediate SLD values produce intermediate oscillation depths.
    The destructive interference between the two amplitude terms is partial rather
    than complete.

!!! tip "Git checkpoint"
    ```console
    $ git add chapter_04_shells.ipynb
    $ git commit -m "add sphere_amplitude and core_shell_form_factor functions"
    ```

---

**What's next:** [Multiple Shells](2-multiple-shells.md) — generalizing the model to
any number of concentric layers.
