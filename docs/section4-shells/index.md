# Section 4: Adding Shells to the Model

The solid sphere is the simplest possible scattering object, but real materials are
rarely uniform. A polymer nanoparticle may have a dense core and a swollen outer layer.
A lipid vesicle is a hollow sphere — an aqueous interior enclosed by a thin membrane.
To describe these structures we need to add **shells**: concentric regions with
different scattering length densities.

This section builds the shell model in three steps: a single shell around a core, then
multiple shells, then the special case where the core and matrix have the same SLD —
which produces a hollow sphere and connects directly to the physics of lipid vesicles.

By the end of this section you will have:

- A general multi-shell form factor function that handles any number of concentric
  layers
- Physical intuition for how each shell changes the scattering curve
- An understanding of why the hollow sphere model is a good first description of a
  vesicle
- A complete, reusable scattering toolkit built across Sections 2 and 4

All code belongs in a new notebook: `chapter_04_shells.ipynb`. Copy your
`sphere_amplitude`, `sphere_form_factor`, and `plot_form_factor` functions from
`chapter_02_sphere.ipynb` into the first code cell of the new notebook so that
everything is self-contained.

## Pages in this section

1. [Core-Shell Sphere](1-core-shell-model.md)
2. [Multiple Shells](2-multiple-shells.md)
3. [The Hollow Sphere](3-hollow-sphere.md)
4. [Connection to Vesicles](4-vesicle-connection.md)
