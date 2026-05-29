# Section 3: Fitting Data

Building a model is only half the job. The other half is extracting physical parameters
from real data by finding the model settings that best describe what was measured. This
section introduces the statistical framework behind fitting and applies it first to a
simple line, then to the scattering models built in Section 2.

By the end of this section you will be able to:

- Explain what chi-squared minimization does and why it works
- Use `scipy.optimize.curve_fit` to fit any parametric model to data
- Extract parameter values **and their uncertainties** from the covariance matrix
- Construct and plot a confidence band around a fitted model
- Read a correlation matrix and understand what high parameter correlation means
- Fit a polydisperse sphere form factor to noisy scattering data using
  log-scale-weighted residuals

All code belongs in `chapter_03_fitting.ipynb`. The `sphere_form_factor`,
`polydisperse_sphere`, and `plot_form_factor` functions from
`chapter_02_sphere.ipynb` are needed in the third page — copy them into the first
cell of this notebook so everything is self-contained.

## Pages in this section

1. [Chi-Squared and Fitting a Line](1-chi-squared.md)
2. [Interpreting the Results](2-interpreting-results.md)
3. [Fitting Scattering Data](3-fitting-saxs.md)
