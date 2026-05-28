# Why Python?

Python has become the dominant language for scientific computing, and for good reason.
It is free and open-source, runs on every major operating system, and has an enormous
ecosystem of libraries built specifically for numerical work, data analysis, and
visualization.

For this tutorial the most important libraries are:

| Library | What it does |
|---|---|
| **NumPy** | Fast numerical arrays and the mathematical functions that operate on them |
| **SciPy** | Scientific algorithms including special functions and numerical integration |
| **Matplotlib** | Publication-quality plots and figures |
| **JupyterLab** | An interactive notebook interface that combines code, text, and figures in a single document |

Python is also designed to be readable. The goal of this tutorial is for you to
understand every line of code you write — not just run it and hope for the right answer.
Clear variable names and well-structured code are habits worth building from the very
first session.

## What you will be able to do

By the time you finish this tutorial, you will have working Python code that generates
scattering curves like those measured in an actual experiment. The final model — a
hollow sphere with multiple shells — captures the essential physics of a lipid vesicle:
a thin membrane enclosing an aqueous interior. The scattering curve from such a
structure shows a characteristic shape whose features encode the vesicle radius and
shell thickness. By the end of Section 3 you will be able to compute that curve from
scratch and understand what every feature in it means.

## Python versions and this tutorial

This tutorial was written for **Python 3.12** or later. The package manager introduced
in the next page — **uv** — will install the correct Python version automatically.

---

**What's next:** [Installing uv](2-installing-uv.md) — the tool that manages Python
and your project dependencies.
