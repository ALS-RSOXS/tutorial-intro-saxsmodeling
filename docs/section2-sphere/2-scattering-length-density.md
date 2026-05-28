# Scattering Length Density

X-rays interact with the electrons in a material. A region that is dense with electrons
scatters X-rays more strongly than a region that is sparse. The quantity that captures
this is the **scattering length density** (SLD), given the symbol $\rho$ and measured
in units of Å$^{-2}$.

You do not need to know how to calculate SLD values from scratch — they are tabulated
for common materials and can be computed from chemical composition using online tools.
What matters for building models is understanding the role SLD plays.

## The two-phase model

The simplest scattering model treats the sample as two regions with different SLDs: the
**particle** (with SLD $\rho_1$) surrounded by a **matrix** or solvent (with SLD
$\rho_2$). A sphere of lipid in water is one example. A polymer nanoparticle in a
buffer solution is another.

!!! note "Key Concept: Scattering Contrast"
    What determines the scattering signal is not the absolute SLD of either phase, but
    the difference between them:

    $$\Delta\rho = \rho_1 - \rho_2$$

    This difference is called the **contrast**. The scattering intensity scales as
    $(\Delta\rho)^2$, so doubling the contrast quadruples the signal.

## Typical SLD values

| Material | SLD (Å$^{-2}$) |
|---|---|
| Water (H$_2$O) | $9.47 \times 10^{-6}$ |
| Heavy water (D$_2$O) | $6.40 \times 10^{-6}$ |
| Silica (SiO$_2$) | $18.8 \times 10^{-6}$ |
| Lipid hydrocarbon chain | $\approx 7.0 \times 10^{-6}$ |
| Lipid headgroup | $\approx 12.0 \times 10^{-6}$ |

These values give a sense of the typical magnitudes. The contrast between lipid chains
and water is relatively small — this is why lipid scattering experiments require
careful experimental design to maximize signal.

## Representing SLD in code

In our Python models, SLD values will appear as parameters. The convention used
throughout this tutorial is:

```python
rho_particle = 10.0e-6   # SLD of the sphere, in Å^-2
rho_matrix   =  9.47e-6  # SLD of water, in Å^-2

delta_rho = rho_particle - rho_matrix
```

In the normalized form factor $P(q)$ that we will compute in the next pages,
$(\Delta\rho)^2$ appears as an overall prefactor that scales the intensity without
changing the shape of the curve. For now we will fold it into a proportionality
constant and focus on the shape of $P(q)$.

## A question to keep in mind

Consider what happens when $\rho_1 = \rho_2$: the contrast $\Delta\rho = 0$, and the
intensity goes to zero. A particle that is indistinguishable from its surroundings
produces no scattering signal at all.

!!! example "Try It Yourself"
    You are designing a scattering experiment with silica spheres ($\rho = 18.8 \times
    10^{-6}$ Å$^{-2}$) suspended in a solvent mixture. You can tune the solvent SLD
    by mixing water ($\rho = 9.47 \times 10^{-6}$ Å$^{-2}$) and heavy water
    ($\rho = 6.40 \times 10^{-6}$ Å$^{-2}$).

    1. Calculate $\Delta\rho$ for the silica spheres in pure water.
    2. Does the contrast increase or decrease if you switch to heavy water?
    3. Could you ever reach $\Delta\rho = 0$ for silica using this solvent mixture?
       Why or why not?

??? success "Solution"
    ```python
    rho_silica     = 18.8e-6
    rho_water      =  9.47e-6
    rho_heavy_water = 6.40e-6

    delta_rho_water       = rho_silica - rho_water        # 9.33e-6 Å^-2
    delta_rho_heavy_water = rho_silica - rho_heavy_water  # 12.4e-6 Å^-2
    ```

    1. $\Delta\rho = 18.8 \times 10^{-6} - 9.47 \times 10^{-6} = 9.33 \times 10^{-6}$ Å$^{-2}$
    2. The contrast **increases** in heavy water (12.4 × 10$^{-6}$ vs 9.33 × 10$^{-6}$).
    3. No — the SLD of silica (18.8 × 10$^{-6}$) is higher than either pure solvent.
       Any mixture of water and heavy water has SLD between 6.40 × 10$^{-6}$ and
       9.47 × 10$^{-6}$, which never reaches 18.8 × 10$^{-6}$. Contrast matching to
       zero is only possible for materials whose SLD falls within the accessible range
       of the solvent mixture.

This idea — that you cannot see what you cannot distinguish from the background — will
come back in Section 3 when we build hollow sphere models.

## Complex SLD and the index of refraction

!!! note "More advanced material"
    This section introduces concepts that are not needed to follow the main tutorial
    sequence. It is included here because the connection between SLD and the optical
    index of refraction is important in **resonant soft X-ray scattering** (RSOXS) and
    other techniques that tune the photon energy near an absorption edge. If you are
    focused on hard X-ray SAXS for now, you can return to this section later.

### The atomic scattering factor

In standard (non-resonant) SAXS at hard X-ray energies, each atom scatters X-rays in
proportion to its number of electrons $Z$. The SLD is therefore proportional to the
local electron density, which is what the table above reflects.

Near an **absorption edge** — a photon energy at which the X-rays are resonantly
absorbed by a specific element — this picture changes. The atomic scattering factor
picks up two energy-dependent correction terms:

$$f(E) = f_0 + f'(E) + if''(E)$$

where $f_0 \approx Z$ is the non-resonant (Thomson) term, $f'(E)$ is the real
**anomalous dispersion** correction, and $f''(E)$ is the imaginary **absorption**
correction. Both $f'$ and $f''$ can vary by orders of magnitude across an absorption
edge, and $f'$ can even become negative.

The SLD therefore becomes **complex** near an edge:

$$\rho_{\text{complex}} = \rho_{\text{real}} + i\,\rho_{\text{imag}}$$

where $\rho_{\text{real}}$ encodes scattering (refraction) and $\rho_{\text{imag}}$
encodes absorption. The contrast $\Delta\rho$ used in the form factor becomes a
complex number as well, and the intensity is then proportional to
$|\Delta\rho|^2 = (\Delta\rho_{\text{real}})^2 + (\Delta\rho_{\text{imag}})^2$.

### The complex index of refraction

X-ray optical techniques — including RSOXS, reflectometry, and GISAXS — often describe
materials using the **complex index of refraction**:

$$n = 1 - \delta + i\beta$$

where $\delta$ (delta) is the **refractive index decrement** (it controls phase
shifts and refraction) and $\beta$ (beta) controls **absorption** and attenuation.
Both $\delta$ and $\beta$ are dimensionless and positive for ordinary materials.

!!! note "Key Concept: $\delta$, $\beta$, and the SLD"
    The connection between the optical constants and the complex SLD depends on the
    X-ray wavelength $\lambda$:

    $$\delta = \frac{\lambda^2}{2\pi}\,\rho_{\text{real}} \qquad \beta = \frac{\lambda^2}{2\pi}\,\rho_{\text{imag}}$$

    Rearranging, the SLD components are:

    $$\rho_{\text{real}} = \frac{2\pi}{\lambda^2}\,\delta \qquad \rho_{\text{imag}} = \frac{2\pi}{\lambda^2}\,\beta$$

    Because $\lambda$ depends on photon energy ($\lambda = hc/E$), the same material
    has different $\delta$ and $\beta$ values at different energies — even if its
    physical structure has not changed. SLD in Å$^{-2}$ removes this energy dependence
    from the material property itself, which is why SAXS calculations typically use SLD
    rather than optical constants.

### Converting between the two representations in Python

The following utility function performs both conversions. Add it to your notebook for
reference — you will use it if you work with resonant scattering data:

```python
import numpy as np

HC = 12398.4  # hc in eV·Å — converts photon energy to wavelength

def wavelength_from_energy(energy_eV):
    """Return X-ray wavelength in Å for a given photon energy in eV."""
    return HC / energy_eV

def sld_from_optical_constants(delta, beta, energy_eV):
    """
    Convert optical constants (delta, beta) to complex SLD.

    Parameters
    ----------
    delta : float
        Refractive index decrement (dimensionless).
    beta : float
        Absorption index (dimensionless).
    energy_eV : float
        Photon energy in eV.

    Returns
    -------
    rho_real, rho_imag : float
        Real and imaginary SLD components in Å^-2.
    """
    lam = wavelength_from_energy(energy_eV)
    prefactor = 2 * np.pi / lam**2
    return prefactor * delta, prefactor * beta

def optical_constants_from_sld(rho_real, rho_imag, energy_eV):
    """
    Convert complex SLD to optical constants (delta, beta).

    Parameters
    ----------
    rho_real : float
        Real SLD component in Å^-2.
    rho_imag : float
        Imaginary SLD component in Å^-2.
    energy_eV : float
        Photon energy in eV.

    Returns
    -------
    delta, beta : float
        Dimensionless optical constants.
    """
    lam = wavelength_from_energy(energy_eV)
    prefactor = lam**2 / (2 * np.pi)
    return prefactor * rho_real, prefactor * rho_imag
```

As a concrete example, here is what happens near the carbon K-edge (~285 eV), where
soft X-ray scattering experiments on organic materials are commonly performed:

```python
# Typical optical constants for a polymer near the carbon K-edge
energy = 285.0   # eV — near the carbon 1s absorption edge
delta  = 2.5e-4  # dimensionless
beta   = 1.5e-5  # dimensionless

rho_real, rho_imag = sld_from_optical_constants(delta, beta, energy)
lam = wavelength_from_energy(energy)

print(f"Photon energy:  {energy:.1f} eV")
print(f"Wavelength:     {lam:.4f} Å")
print(f"rho_real:       {rho_real:.3e} Å^-2")
print(f"rho_imag:       {rho_imag:.3e} Å^-2")
```

!!! tip "Why this matters for RSOXS"
    In resonant soft X-ray scattering, the photon energy is tuned to an absorption
    edge of a specific element — carbon, nitrogen, oxygen, or sulfur are common choices
    for organic and biological materials. At the right energy, two materials that are
    nearly invisible to hard X-rays (similar electron densities, small Δρ) can become
    strongly contrasted because their $f'$ and $f''$ values differ dramatically near
    the edge. This energy-dependent contrast is the defining advantage of RSOXS for
    studying chemical heterogeneity in soft-matter systems.

---

**What's next:** [The Sphere Form Factor](3-sphere-form-factor.md) — the mathematical
function that describes how a sphere of radius $R$ scatters X-rays as a function of $q$.
