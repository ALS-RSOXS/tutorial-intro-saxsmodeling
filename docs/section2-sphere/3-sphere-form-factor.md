# The Sphere Form Factor

The **form factor** $P(q, R)$ is the function that describes the shape of the
scattering curve for a given particle geometry. For a solid, homogeneous sphere of
radius $R$, the form factor is:

$$P(q, R) = \left[\frac{3\left(\sin(qR) - qR\cos(qR)\right)}{(qR)^3}\right]^2$$

This function is normalized so that $P(q \to 0) = 1$. The full scattering intensity is
then:

$$I(q) \propto (\Delta\rho)^2 \, V^2 \, P(q, R)$$

where $V = \frac{4}{3}\pi R^3$ is the sphere volume and $\Delta\rho$ is the contrast
introduced on the previous page.

## Physical intuition

The expression inside the brackets is the **scattering amplitude** $F(q, R)$ — a
measure of how much a sphere of radius $R$ contributes to the scattered wave at each
$q$:

$$F(q, R) = \frac{3\left(\sin(qR) - qR\cos(qR)\right)}{(qR)^3}$$

!!! note "Key Concept: Amplitude and Intensity"
    Scattering is a wave phenomenon. The **amplitude** $F(q)$ describes the wave
    scattered by a single particle — it can be positive or negative and carries phase
    information. The **intensity** $P(q) = F(q)^2$ is what a detector actually
    measures. Intensity is always non-negative.

    This distinction becomes critical in Section 3, where we combine amplitudes from
    multiple shells. Shells are added as **amplitudes** (with their correct signs)
    before squaring, not as intensities after squaring. Getting this wrong leads to
    physically incorrect results.

The oscillations in $P(q, R)$ arise from interference between X-rays scattered from
different parts of the sphere. At $q = 0$ all of these waves add up in phase, giving
the maximum intensity. As $q$ increases, waves from opposite sides of the sphere begin
to cancel, and $P(q)$ falls. The first complete cancellation — the first **minimum** in
$P(q)$ — occurs when:

$$q_{\min} \approx \frac{4.49}{R}$$

This is a useful rule of thumb: once you can identify the first minimum in an
experimental scattering curve, you can immediately estimate the particle radius.

## Behavior at different length scales

The form factor has characteristic behavior in three regions:

| Region | Condition | Behavior |
|---|---|---|
| **Guinier region** | $qR \ll 1$ | $P(q) \approx 1$ — the plateau at low $q$ |
| **Intermediate** | $qR \sim 1$–$10$ | Oscillations that encode the particle size |
| **Porod region** | $qR \gg 1$ | $P(q) \propto q^{-4}$ — a power-law decay |

!!! tip "The Guinier approximation"
    At very small $q$ (specifically when $qR_g < 1$, where $R_g$ is the radius of
    gyration), the form factor can be approximated as:

    $$P(q) \approx \exp\!\left(-\frac{q^2 R_g^2}{3}\right)$$

    For a solid sphere, $R_g = R\sqrt{3/5}$. Plotting $\ln I$ versus $q^2$ (a
    **Guinier plot**) should give a straight line whose slope yields $R_g$ directly.
    This is one of the most widely used analysis tools in experimental SAXS — it
    requires no model assumptions beyond the dilute limit.

## What the form factor does not capture

$P(q, R)$ describes the scattering from a single, isolated particle. It does not
account for:

- **Interactions between particles** — described by the structure factor $S(q)$,
  which will be addressed in a later section.
- **Polydispersity** — real samples contain a distribution of particle sizes, which
  is addressed on a later page in this section.
- **Internal structure** — the sphere is assumed to be homogeneous. Adding layers of
  different SLD is the subject of Section 3.

---

**What's next:** [q-Vectors in NumPy](4-q-vectors-numpy.md) — implementing the sphere
form factor in Python and generating the $q$ arrays needed to evaluate it.
