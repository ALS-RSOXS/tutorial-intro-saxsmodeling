# Simulating X-ray Scattering: A Practical Introduction

This tutorial teaches you to simulate how X-rays scatter from soft-matter structures
using Python — working from a solid sphere all the way to a multi-shell vesicle model.
Along the way you will learn how to manage your computing environment, track your work
with version control, and create publication-quality figures. These are foundational
skills that will serve you throughout your research career.

## Who this is for

This tutorial is written for undergraduate students and researchers early in their PhD
programs. No prior experience with scattering physics, Python, or version control is
assumed. A working knowledge of algebra and basic calculus is helpful, and some
exposure to any programming language is useful, but complete beginners to Python are
welcome.

## What you will build

Each section builds on the last:

| Section | Topic | What you will produce |
|---|---|---|
| **1** | Setup | A working Python environment, a GitHub repository, and your first interactive notebook |
| **2** | Sphere model | A function that computes and plots the X-ray scattering from a sphere of any size, including polydisperse samples |
| **3** | Fitting data | Least-squares fitting with `scipy.optimize.curve_fit`, confidence bands, correlation matrices, and fitting a sphere model to noisy scattering data |
| **4** | Shell models | Core-shell and hollow sphere models that connect directly to the physics of lipid vesicles |
| **5** | Gaussian bilayer profiles | Continuous electron density profiles for symmetric and asymmetric POPC bilayers |

By the end of Section 3 you will be able to generate and interpret scattering curves
for structures that appear in real experimental soft-matter research.

## How to use this tutorial

Work through each section in order — every page assumes the setup from the pages before
it.

When you see a code block, open your Jupyter notebook and **type it out**. Typing
rather than copying forces you to read every line and notice what each piece does.

Exercises appear throughout. Attempt every one before expanding the solution — the
struggle is where most of the learning happens.

---

[**Start with Section 1: Setup →**](section1-setup/index.md)
