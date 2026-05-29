# Section 4: Gaussian Bilayer Profiles

The shell models in Section 3 represent the bilayer as a stack of uniform slabs with
perfectly sharp boundaries. That is a useful first approximation, but it does not
reflect how a real membrane is structured. Lipid molecules fluctuate thermally, water
penetrates into the headgroup region, and the interfaces between structural regions are
gradients rather than steps.

This section replaces the sharp-interface model with a **Gaussian electron density
profile** — a continuous function that describes the bilayer structure more physically.
We will build the profile for a POPC bilayer, compute its scattering form factor
numerically, compare it to the three-shell model, and then extend it to handle
**asymmetric bilayers** where the inner and outer leaflets differ.

By the end of this section you will have:

- A function that builds a continuous radial electron density profile for a symmetric
  POPC bilayer
- A numerical form factor computed from that profile via a spherical Fourier transform
- A quantitative understanding of where the Gaussian and shell models agree and where
  they diverge
- An asymmetric bilayer model with independent parameters for each leaflet

All code belongs in `chapter_04_gaussian_bilayer.ipynb`. Copy `plot_form_factor` and
`multi_shell_form_factor` from your earlier notebooks into the first cell so everything
is self-contained.

## Pages in this section

1. [Why Gaussian Profiles?](1-why-gaussian.md)
2. [Building the Electron Density Profile](2-building-the-profile.md)
3. [Form Factor from a Profile](3-form-factor-from-profile.md)
4. [Comparing to the Shell Model](4-comparing-to-shell-model.md)
5. [Asymmetric Bilayer](5-asymmetric-bilayer.md)
