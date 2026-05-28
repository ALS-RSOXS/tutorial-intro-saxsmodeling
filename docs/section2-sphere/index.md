# Section 2: Building Mathematical Models

With your environment set up and version control in place, it is time to start on the
science. This section introduces X-ray scattering from first principles and builds a
complete computational model of scattering from a sphere — the simplest non-trivial
geometry and the foundation for everything in Section 3.

By the end of this section you will have:

- An understanding of what SAXS measures and how the scattering vector $q$ is defined
- A working Python function that computes the form factor $P(q, R)$ for a solid sphere
- A reusable log-log plotting routine for scattering data
- Physical intuition for how sphere size is encoded in the scattering curve
- A polydisperse model that accounts for a distribution of sphere sizes

All of this code lives in a single Jupyter notebook — `chapter_02_sphere.ipynb` —
that you will build incrementally as you work through the pages.

!!! note "A note on units"
    All scattering vectors in this section are in **Å$^{-1}$** (inverse angstroms).
    If you are reading papers alongside this tutorial, check their units — nm$^{-1}$
    is also common. The conversion is $1 \text{ nm}^{-1} = 0.1 \text{ Å}^{-1}$.

## Pages in this section

1. [What is SAXS?](1-what-is-saxs.md)
2. [Scattering Length Density](2-scattering-length-density.md)
3. [The Sphere Form Factor](3-sphere-form-factor.md)
4. [q-Vectors in NumPy](4-q-vectors-numpy.md)
5. [Plotting on a Log Scale](5-plotting-loglog.md)
6. [Effect of Sphere Size](6-effect-of-size.md)
7. [Polydispersity](7-polydispersity.md)
8. [Commit Checkpoint](8-commit-checkpoint.md)
