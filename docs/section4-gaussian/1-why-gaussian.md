# Why Gaussian Profiles?

The three-shell model treats the lipid bilayer as three rectangular slabs —
outer headgroup, hydrocarbon chains, inner headgroup — separated by perfectly sharp
boundaries. When you plot this as an electron density profile, each transition is an
instantaneous step from one value to the next.

This is mathematically convenient, but it is not physically accurate.

## What a real bilayer looks like

A lipid molecule is not rigidly fixed in the membrane. At physiological temperatures
the bilayer is in a **fluid phase** — lipid chains are disordered, molecules
diffuse laterally, and individual headgroups fluctuate in and out of the water layer
on nanosecond timescales.

Three physical effects conspire to make the electron density profile of a real bilayer
continuous rather than stepped:

**1. Thermal fluctuations of individual lipids.** At any moment in time, lipid
molecules within a single leaflet are at slightly different axial positions. When
averaged over time and across the illuminated sample volume, the sharp edge of the
headgroup layer is replaced by a distribution of positions — well described by a
Gaussian.

**2. Water penetration.** Water molecules are not excluded from the headgroup region.
They hydrogen-bond to the phosphate and choline groups and penetrate several ångströms
into what the step-function model treats as a uniform headgroup slab. The
headgroup-water boundary is a gradient, not a wall.

**3. Bilayer undulations.** The vesicle surface itself fluctuates on longer length
scales. These undulations are averaged out by the scattering measurement, and the
effect at the level of the electron density profile is again an apparent broadening of
every interface.

The cumulative result is an electron density profile that looks like a pair of smooth
peaks (the headgroups) flanking a smooth trough (the hydrocarbon chains):

!!! note "Key Concept: The Gaussian Bilayer Profile"
    The electron density profile of a real fluid-phase bilayer is well described by
    a **sum of Gaussians**: one for each headgroup layer and one for the chain region.
    Each Gaussian has three parameters — position, width, and amplitude — that encode
    where each structural region is, how broad the interface is, and how different its
    electron density is from water.

    This model is not just an approximation of convenience. It has been validated
    against molecular dynamics simulations, X-ray reflectometry, and small-angle
    scattering from unilamellar vesicles (Brzustowicz & Brunger 2005, Kučerka et al.
    2011).

## Where the step-function model breaks down

The sharp-interface (shell) model works well at small to intermediate $q$ where the
measurement is sensitive to the overall bilayer thickness and vesicle size. At larger
$q$ — where the measurement resolves the internal structure of the bilayer — the two
models diverge in a predictable way.

A sharp interface contributes scattering at all $q$ values with no decay. A Gaussian
interface contributes a scattering amplitude that decays as $\exp(-q^2\sigma^2/2)$,
where $\sigma$ is the interface width. The broader the interface, the faster this
decay. At high $q$, the shell model over-predicts the oscillation amplitude because
it assumes perfectly sharp transitions that do not exist in a real membrane.

**Three practical situations where the Gaussian model matters:**

1. **Fitting data at $q > 0.3$ Å$^{-1}$** — oscillations in this range are sensitive
   to interface sharpness. A sharp-interface model will systematically fail here.

2. **Extracting interface widths** — $\sigma_H$ and $\sigma_C$ are physically
   meaningful parameters that can be compared to MD simulations and reflectometry
   results.

3. **Modeling asymmetric bilayers** — the inner and outer headgroup layers can have
   different widths. The shell model has no way to represent this; the Gaussian model
   handles it naturally by using independent parameters for each leaflet.

## What this model cannot do

The Gaussian model is still a model. It assumes:

- The bilayer electron density profile is well described by three Gaussians (adequate
  for most common phospholipids, but not for all lipid mixtures)
- The vesicle is monodisperse (polydispersity must be handled separately)
- The bilayer is symmetric between leaflets (relaxed in Section 4 page 5)

It does not account for inter-vesicle interactions (structure factor), multilamellarity,
or cholesterol-induced changes to chain order that alter the profile shape.

---

**What's next:** [Building the Electron Density Profile](2-building-the-profile.md) —
constructing the POPC bilayer profile in Python and visualizing it.
