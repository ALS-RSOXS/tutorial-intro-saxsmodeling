# Simulating X-ray Scattering: A Practical Introduction

This tutorial serves as an introduction to modeling X-ray scattering of soft materials using Python.
Along the way you will learn how to manage your computing environment, track your work
with version control, and create publication-quality figures.

## Who this is for

This tutorial is written for undergraduate students with limited-to-no prior experience with scattering physics or data analysis in Python. A working knowledge of algebra is helpful and any experience with data manipulation is useful, but complete beginners should be able to follow along.

## What you will build

Each section builds on the last:

| Section | Topic | What you will produce |
|---|---|---|
| **1** | Setup | A working Python environment, a GitHub repository, and your first interactive Jupyter notebook |
| **2** | Sphere model | A function that computes and plots the X-ray scattering from a sphere of any size, including polydisperse samples |
| **3** | Fitting data | Least-squares fitting with `scipy.optimize.curve_fit`, confidence bands, correlation matrices, and fitting a sphere model to noisy scattering data |
| **4** | Shell models | Core-shell and hollow sphere models that connect directly to the physics of lipid vesicles |
| **5** | Gaussian bilayer profiles | Continuous electron density profiles for symmetric and asymmetric POPC bilayers |

## What will you learn

By the time you finish this tutorial, you will have working Python code that generates
scattering curves like those measured in real experiments. You will also be able to use it to **fit** data and extract critical structural parameters of a nanoparticle.

## How to use this tutorial

Work through each section in order — every page assumes the setup from the pages before
it.

When you see a code block, open your Jupyter notebook and **type it out**. Typing
rather than copying forces you to read every line and notice what each piece does.

Exercises are provided to help you think about the material with available solutions.

---

[**Start with Section 1: Setup →**](section1-setup/index.md)
