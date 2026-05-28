# Connection to Vesicles

The hollow sphere model is not just a mathematical curiosity — it is the first
reasonable physical description of a **lipid vesicle**: a closed, spherical membrane
that encloses an aqueous interior.

## What is a lipid vesicle?

A lipid molecule has a hydrophilic (water-loving) headgroup and one or two hydrophobic
(water-avoiding) hydrocarbon tails. In water, lipids spontaneously assemble into a
**bilayer**: two leaflets arranged tail-to-tail, with headgroups facing outward into
the water on both sides.

When a bilayer closes on itself it forms a vesicle — a hollow sphere whose wall is the
bilayer membrane.

!!! note "Key Concept: The Vesicle as a Hollow Sphere"
    A vesicle has three distinct regions:

    - **Aqueous interior** — water inside the vesicle ($\rho \approx 9.47 \times
      10^{-6}$ Å$^{-2}$)
    - **Bilayer membrane** — the lipid shell ($\rho$ varies; typically
      $7$–$12 \times 10^{-6}$ Å$^{-2}$ depending on which part of the bilayer
      you are considering)
    - **Aqueous exterior** — water outside the vesicle

    The interior and exterior are both water, so in the simplest model
    $\rho_{\text{core}} = \rho_{\text{matrix}}$. This is exactly the hollow sphere
    condition from the previous page.

The bilayer thickness in a typical phospholipid vesicle is roughly 30–40 Å. The vesicle
radius depends on preparation conditions but is commonly 200–1000 Å (20–100 nm) for
laboratory samples.

## Simulating a vesicle

Use the `multi_shell_form_factor` function with parameters that represent a realistic
lipid vesicle:

```python
R_vesicle   = 300.0   # outer radius in Å (30 nm)
t_bilayer   = 35.0    # bilayer thickness in Å
R_interior  = R_vesicle - t_bilayer

rho_water   = 9.47e-6   # Å^-2 — both interior and exterior
rho_lipid   = 7.0e-6    # Å^-2 — hydrocarbon chain region (below water)

P_vesicle = multi_shell_form_factor(
    q,
    radii=[R_interior, R_vesicle],
    slds=[rho_water, rho_lipid],    # core = matrix = water
    rho_matrix=rho_water,
)

fig, ax = plt.subplots(figsize=(8, 5))
plot_form_factor(q, P_vesicle,
                 label=f"Vesicle: R = {R_vesicle} Å, t = {t_bilayer} Å",
                 ax=ax, color="steelblue")
ax.set_title("Scattering from a simple vesicle model")
plt.tight_layout()
plt.show()
```

The curve looks different from anything in Section 2. Note the pronounced peak at
intermediate $q$ — this is characteristic of hollow sphere scattering and is one of
the signatures used to identify vesicles in experimental data.

## Reading structural parameters from the curve

The scattering curve from a vesicle encodes two geometric parameters: the outer radius
$R$ and the shell thickness $t$.

**Outer radius:** The first prominent minimum in the hollow sphere form factor falls at
approximately $q_{\min} \approx 4.5/R$, the same as for a solid sphere of the same
outer radius. Features at small $q$ are governed by the large-scale size of the object.

**Shell thickness:** At larger $q$, the oscillation period is related to the shell
thickness. For a thin shell, minima are spaced by approximately $\Delta q \approx
\pi / t$. For shells that are not thin compared to $R$, both length scales contribute
and the pattern is more complex — but the general trend holds: thicker shells produce
more closely spaced high-$q$ features.

Compare vesicles of different sizes and thicknesses to build intuition:

```python
configs = [
    (300, 35, "steelblue"),
    (500, 35, "tomato"),
    (300, 60, "seagreen"),
]

fig, ax = plt.subplots(figsize=(9, 5))

for R, t, color in configs:
    R_in = R - t
    P = multi_shell_form_factor(
        q,
        radii=[R_in, R],
        slds=[rho_water, rho_lipid],
        rho_matrix=rho_water,
    )
    plot_form_factor(q, P, label=f"R = {R} Å, t = {t} Å", ax=ax, color=color)

ax.set_title("Vesicle scattering: effect of radius and thickness")
plt.tight_layout()
plt.show()
```

Observe that increasing $R$ shifts the main peak to smaller $q$, while increasing $t$
(with $R$ fixed) shifts the finer high-$q$ oscillations to smaller $q$.

## The limits of this model

The simple hollow sphere treats the bilayer as a uniform slab with a single SLD. A real
lipid bilayer is not uniform — it has a layered structure with distinct regions:

1. **Outer headgroup layer** — phosphocholine or similar, higher electron density
2. **Hydrocarbon chain region** — two monolayers tail-to-tail, lower electron density
3. **Inner headgroup layer** — mirror of the outer layer

Each of these regions has a different SLD, and together they produce a characteristic
electron density profile that is asymmetric across the bilayer. The multi-shell model
you have already built can represent this — the bilayer becomes three shells (outer
headgroup, chain region, inner headgroup) instead of one.

!!! example "Try It Yourself"
    A simple three-layer bilayer model uses the following parameters:

    | Layer | Thickness | SLD |
    |---|---|---|
    | Outer headgroup | 9 Å | $12.0 \times 10^{-6}$ Å$^{-2}$ |
    | Hydrocarbon chains | 26 Å | $7.0 \times 10^{-6}$ Å$^{-2}$ |
    | Inner headgroup | 9 Å | $12.0 \times 10^{-6}$ Å$^{-2}$ |

    The vesicle outer radius is 300 Å. The interior and exterior are water
    ($\rho = 9.47 \times 10^{-6}$ Å$^{-2}$).

    1. Compute the outer radius, the radius at the start of the chain region, and the
       inner radius (interior water surface) from the layer thicknesses.
    2. Call `multi_shell_form_factor` with four entries in `radii` and `slds`
       (interior water, inner headgroup, chains, outer headgroup), then the matrix.
    3. Overlay the three-layer result on the single-layer vesicle curve from above.
       Can you see a difference? At which $q$ values does the bilayer structure
       become apparent?

??? success "Solution"
    ```python
    R_outer       = 300.0  # Å
    t_head_outer  = 9.0
    t_chains      = 26.0
    t_head_inner  = 9.0
    t_total       = t_head_outer + t_chains + t_head_inner  # 44 Å

    # Radii from inside out
    R_inner        = R_outer - t_total          # interior water surface
    R_chain_start  = R_inner  + t_head_inner    # start of chain region
    R_chain_end    = R_chain_start + t_chains   # end of chain region (= outer head start)
    # R_outer = R_chain_end + t_head_outer = 300 Å ✓

    rho_water    = 9.47e-6
    rho_headgroup = 12.0e-6
    rho_chains   =  7.0e-6

    P_bilayer = multi_shell_form_factor(
        q,
        radii=[R_inner, R_chain_start, R_chain_end, R_outer],
        slds=[rho_water, rho_headgroup, rho_chains, rho_headgroup],
        rho_matrix=rho_water,
    )

    # Single-layer reference
    P_single = multi_shell_form_factor(
        q,
        radii=[R_outer - t_total, R_outer],
        slds=[rho_water, rho_chains],
        rho_matrix=rho_water,
    )

    fig, ax = plt.subplots(figsize=(8, 5))
    plot_form_factor(q, P_single,  label="Single-layer bilayer",  ax=ax, color="steelblue")
    plot_form_factor(q, P_bilayer, label="Three-layer bilayer",   ax=ax, color="tomato")
    ax.set_title("Bilayer structure: single-layer vs three-layer model")
    plt.tight_layout()
    plt.show()
    ```

    The two curves are similar at small $q$ (both encode the same outer radius) but
    diverge at larger $q$ where the internal bilayer structure becomes resolved. The
    headgroup peaks, which have higher electron density than water, produce additional
    scattering that modifies the high-$q$ oscillations.

## Where to go from here

The model you have built — a multi-shell hollow sphere — is a practical starting point
for analyzing SAXS data from vesicle systems. Real experimental analysis extends this
in several directions:

- **Polydispersity in vesicle radius** — real samples contain a distribution of sizes,
  broadening and dampening the oscillations (the same effect you explored in Section 2)
- **Bilayer asymmetry** — the inner and outer leaflets of a biological membrane can
  differ in lipid composition, making the electron density profile asymmetric
- **Structure factor** — at high vesicle concentrations, inter-vesicle interactions
  produce additional features in the scattering pattern
- **Gaussian electron density profiles** — fitting the continuous bilayer electron
  density with Gaussian functions provides more structural detail than discrete shell
  models

These topics are addressed in the research literature referenced in the context
materials for this tutorial.

## Final commit

Save everything you have built:

```bash
git add chapter_03_shells.ipynb
git commit -m "add multi-shell and hollow sphere form factor models"
git push
```

You now have a complete, version-controlled scattering toolkit: a sphere form factor,
polydisperse averaging, a general multi-shell model, and its application to the hollow
sphere geometry that describes vesicle scattering.
