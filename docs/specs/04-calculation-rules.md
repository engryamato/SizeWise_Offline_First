# Calculation Rules & Validation (Draft v0.1)

Note: Provide references (SMACNA, ASHRAE) and verify licensing. Below outlines the structure and placeholders for constants.

## Units and Conventions

- Default units: Imperial; support metric with explicit conversions
- Rounding: velocities to nearest 1 fpm; losses to 0.01 in.wg; diameters to 0.1 in
- Temperature, altitude corrections configurable

## Inputs (per segment)

- shape: rect|round; width_in, height_in | diameter_in
- length_ft, cfm, material, lining_thickness_in
- fittings: elbows_count, tees_count, transitions_count
- altitude_ft (from job), temp_f optional

## Outputs (per segment)

- velocity_fpm, reynolds
- friction_inwg_per100ft, fittings_loss_inwg, total_loss_inwg
- pressure_class (suggested), warnings[]

## Core Equations (to be verified against SMACNA/ASHRAE)

- Area (rect): A = (width_in × height_in) / 144 [ft²]
- Area (round): A = π × (diameter_in/24)² [ft²]
- Velocity: V = CFM / A [fpm]
- Hydraulic diameter (rect): Dh ≈ 2ab/(a+b) [in]; Dh_ft = Dh/12 [ft]
- Reynolds: Re = (ρ × V_ft_per_s × Dh_ft) / μ, where V_ft_per_s = V/60
- Friction: Darcy–Weisbach with f from Colebrook-White or tabulated HVAC charts (will calibrate to SMACNA)
- Pressure loss per 100 ft: ΔP_f = f × (L/Dh_ft) × (ρ × v² / 2) converted to in.wg per 100 ft
- Fittings loss: ΔP_fittings = K_total × (ρ × v² / 2) → in.wg
- Total loss: ΔP_total = ΔP_f + ΔP_fittings

## Provisional Constants (to verify; sources below)

- Air density ρ (70°F, 1 atm): 0.075 lbm/ft³ (engineering practice)
- Dynamic viscosity μ (~68–70°F): 3.8e-7 slug/(ft·s)
- Material absolute roughness ε [ft] (typical ranges):
  - Galvanized steel: 0.0003–0.0005
  - Commercial steel: ~0.00015
  - Smooth stainless (drawn): ~5e-6–1e-5
  - Lined duct (effective): ~0.001–0.003 (depends on liner)
- Altitude correction: use standard atmosphere p(z); ρ = p / (R_specific × T_abs)

Note: We will reconcile ε and f to match SMACNA friction charts; constants will be updated accordingly.

## Validation Matrix (examples)
- cfm > 0 required; upper bound per tier e.g., edge_limit (licensing)
- length_ft > 0 and < 2000
- width_in,height_in within [2, 120]
- diameter_in within [2, 120]
- elbows_count, tees_count, transitions_count >= 0 and reasonable maxima (e.g., <= 20)

## Warning/Error Thresholds (examples)
- Error: velocity > 1800 fpm in supply → E_INPUT_VALIDATION
- Advisory: aspect ratio > 4:1 (info/warning depending on ruleset)
- Advisory: exceeds preferred velocity for room type

## Golden Test Vectors (illustrative; losses TBD until constants finalized)

```
Case 1: Rect 18×12 in, L=25 ft, 850 CFM, galvanized, elbows=2, transitions=1, sea level
Area = 18×12 / 144 = 1.50 ft² → Velocity ≈ 567 fpm

Case 2: Round 12 in, L=40 ft, 650 CFM, sea level
Area = π×(12/24)² = 0.7854 ft² → Velocity ≈ 829 fpm

Case 3: Rect 10×6 in, L=15 ft, 250 CFM, lined, elbows=3
Area = 10×6 / 144 = 0.4167 ft² → Velocity ≈ 600 fpm (aspect ratio 10:6 ≈ 1.67)
```

## Output Determinism
- Same inputs → same outputs; document rounding order

## References
- ASHRAE Handbook—Fundamentals (e.g., 2021), Chapter on Fluid Flow and on Air Properties
- SMACNA HVAC Systems Duct Design (for friction charts and fitting losses)
- Standard Atmosphere equations (e.g., NIST/NOAA) for altitude pressure/density

