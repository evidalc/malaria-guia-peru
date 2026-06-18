# MalariaGuía Perú — Claude Code Handoff Document
## NTS N°233 · MINSA/DGIESP-2025
**Date:** May 2026 | **Status:** Ready for Claude Code development

---

## 1. PROJECT OVERVIEW

A treatment decision-support app for **non-complicated malaria** in Peru. Operationalizes the treatment chapter of NTS N°233 (MINSA 2025). Serves two user types with different interfaces but identical clinical logic and KPI capture.

**Tech stack:** React web app → deployed via Netlify  
**Language:** Spanish only (placeholders for Awajún, Shipibo, EN future)  
**Offline:** Required — data stored locally, synced when connected  
**Reference:** NTS N°233 — MINSA/DGIESP-2025

---

## 2. USER TYPES

### HCP (Health Care Provider)
- Login: IPRESS code + CDC-Perú assigned password
- Data aggregated at HF (health facility) level
- Credentials created centrally by CDC-Perú, shared with HF malaria responsible
- Sees all 5 parasite species
- Technical language, mg/kg doses + tap-to-reveal pill counts
- NTS table references shown

### ACS (Agente Comunitario de Salud)
- Login: DNI (username) + IPRESS code of reference HF (password)
- Registered jointly with HF malaria responsible (who enters IPRESS code)
- GPS coordinates captured at registration (offline, synced later)
- Individual performance tracking
- Sees only 3 species (RDT-detectable): P. vivax, P. falciparum, Mixta PfPv
- Plain language, pill counts only, no NTS references
- Larger text, larger touch targets (min 48px)
- Linked to reference HF for geographic anchoring

---

## 3. AUTHENTICATION

### Login credentials
| User | Username | Password | Created by |
|------|----------|----------|-----------|
| HCP/HF | IPRESS code | CDC-assigned | CDC-Perú centrally |
| ACS | DNI (8 digits) | IPRESS code of reference HF | ACS + HF malaria responsible jointly |

### Test credentials (prototype)
- Username: `12345678` | Password: `ABC` — works for both HCP and ACS

### Forgot password
- HCP: "Contacte a CDC-Perú para restablecer su acceso"
- ACS: "Contacta al responsable de malaria de tu establecimiento"
- No in-app password reset flow

### Language selector
- Active: 🇵🇪 Español
- Placeholder (disabled): Awajún, Shipibo, EN, PT

---

## 4. APP FLOW

```
Landing → User type selection
  ├── HCP → HF Login → HCP Home → New Visit (Intake) → Treatment Output
  └── ACS → ACS Login → ACS Home → New Visit (Intake) → Treatment Output

Visit types:
  ├── Visita Inicial → Full intake → Treatment output
  ├── Visita de Seguimiento → Partial intake → Management output (TBD)
  └── Visita de Verificación Final → Partial intake → Discharge status
```

### Severe malaria gate
If ANY severity sign selected at intake → redirect to severe malaria screen:
- Text instructing to consult NTS for severe malaria management
- Refer to higher-complexity HF
- Back button to return to form

---

## 5. PARASITE SCOPE

| Parasite | HCP | ACS | G6PD needed | TQ eligible |
|----------|-----|-----|-------------|-------------|
| P. vivax | ✅ | ✅ | ✅ | ✅ (if G6PD normal + TQ available) |
| P. falciparum | ✅ | ✅ | ❌ | ❌ |
| P. malariae | ✅ | ❌ | ❌ | ❌ |
| P. ovale | ✅ | ❌ | ✅ (pending MoH) | ❌ |
| Mixta PfPv | ✅ | ✅ | ✅ | ❌ |

---

## 6. DATA INTAKE — ACCORDION SECTIONS

### All visits share 5 accordion sections that adapt by visit type:

#### Section 1: REGISTRO
- DNI (8 digits max, numeric)
- Fecha (date picker, defaults to today)
- Tipo de visita: Inicial / Seguimiento / Verificación Final

#### Section 2: EPIDEMIOLÓGICO
- **Inicial only** — disabled/grayed for Seguimiento and Final
- Días desde inicio de síntomas (numeric)
- Lugar probable de infección:
  - Mismo lugar de residencia → Departamento + Provincia + Distrito
  - Otro lugar (importation flag ⚠️) → Departamento + Provincia + Distrito

#### Section 3: LABORATORIO
**Visita Inicial:**
- Tipo de malaria (radio buttons)
- G6PD toggle (only for Pv, Po, PfPv): Yes/No
  - If Yes: G6PD value (U/g Hb) + Hb optional + instrument selector
  - If No: reason dropdown (see below)

**Visita de Seguimiento:**
- Hb (optional) + instrument selector only
- Note: G6PD not repeated; this mirrors PAVE-Peru practice (pending MoH confirmation)

**Visita de Verificación Final:**
- Parasite clearance test: Sí/No
  - If No → reason dropdown
  - If Sí → Result: Negativa (→ alta) or Positiva (→ management per NTG/referral)
- Hb (optional) + instrument selector

**Instrument selector options (all visit types where Hb appears):**
- SD Biosensor G6PD/Hb analyzer
- HemoCue
- Otro

**G6PD "not done" reasons — HCP:**
- No aplica (P. falciparum, P. malariae o gestante)
- Sin insumos / desabastecimiento
- Prueba defectuosa o resultado inválido
- Paciente rechazó la prueba
- No hubo tiempo / emergencia
- Otro

**G6PD "not done" reasons — ACS:**
- No aplica (P. falciparum)
- No aplica (paciente gestante)
- No tengo insumos
- La prueba salió defectuosa
- El paciente rechazó la prueba
- Otro motivo

**Parasite clearance "not done" reasons — HCP:**
- Insumos no disponibles en el IPRESS
- Microscopio no disponible o no funciona
- Paciente se negó a la prueba
- Otro

**Parasite clearance "not done" reasons — ACS:**
- PDR no disponible
- Paciente se negó a la prueba
- Otro

#### Section 4: DEMOGRÁFICO
**Visita Inicial:**
- Peso (kg)
- Edad + unit (Años/Meses)
- Sexo (Masculino/Femenino)
- If Femenino: ¿Gestante? toggle + ¿Lactante? toggle (no subtext)

**Visita de Seguimiento / Final:**
- Auto-populated from initial visit (editable except weight)
- Weight: grayed out, not editable (pending MoH confirmation)
- Age, sex, pregnancy, lactation: editable
- Opens with blue info note: "Datos cargados desde visita inicial. Actualice si hubo cambios."
- NOT auto-marked complete — user must confirm manually

#### Section 5: CLÍNICO
**Visita Inicial:**
- Title: "Clínico" / "Signos de gravedad"
- Single checklist: severity signs (multi-select + "Ninguno" option)

**Visita de Seguimiento / Final:**
- Title: "Clínico — Signos de gravedad o AHA"
- Two collapsible subsections:
  1. 🚨 Signos de malaria grave (same severity list)
  2. 🩸 Signos/síntomas sugestivos de AHA (7 items, icon-based for ACS)

**Severity signs (HCP language):**
1. Postración o incapacidad para caminar/sentarse sin apoyo
2. Alteración de consciencia o convulsiones
3. Dificultad respiratoria o respiración profunda
4. Vómitos repetidos (incapacidad de retener medicación oral)
5. Ictericia clínica + evidencia de disfunción orgánica
6. Sangrado anormal
7. Orina oscura (hemoglobinuria)
8. Hipoglicemia (< 2.2 mmol/L)
+ "Ninguno" option at top

**Severity signs (ACS plain language):**
1. No puede caminar ni sentarse solo
2. Está inconsciente o tiene convulsiones
3. Le cuesta respirar mucho
4. Vomita todo lo que toma
5. Está amarillo (piel u ojos)
6. Tiene sangrado sin razón
7. Su orina está muy oscura (marrón o negra)
8. Tiene el azúcar baja (se le midió)
+ "Ninguno de los anteriores" option at top

**AHA signs (HCP language):**
1. Orina color marrón oscuro o roja
2. Ictericia (coloración amarilla de piel u ojos)
3. Palidez nueva o que empeora
4. Fatiga, mareos o dificultad respiratoria nuevos o que empeoran
5. Dolor de espalda nuevo o que empeora
6. Taquicardia nueva o que empeora
7. Fiebre, náuseas y/o vómitos nuevos o que empeoran

**AHA signs (ACS plain language — with icons):**
1. Orina muy oscura (roja o negra) [icon: urine cup with dark liquid from bottom]
2. Está amarillo (piel u ojos) [icon: eye with yellow sclera]
3. Está más pálido que antes [icon: pale washed-out face]
4. Siente mucho cansancio, mareo o le cuesta respirar [icon: placeholder]
5. Le duele la espalda (dolor nuevo) [icon: placeholder]
6. El corazón le late muy rápido [icon: placeholder]
7. La fiebre no baja con el tratamiento [icon: thermometer red]

Note: Icons 4-6 are placeholders pending PAVE-Peru vector files (Fatiga, Mareo, Falta de aire)

**Buscar button label by visit type:**
- Inicial: "BUSCAR TRATAMIENTO" (green)
- Seguimiento: "REGISTRAR SEGUIMIENTO" (blue)
- Final: "REGISTRAR VISITA FINAL" (amber)

---

## 7. G6PD CLASSIFICATION

| Value | Classification | Treatment implication |
|-------|---------------|----------------------|
| ≥ 6.1 U/g Hb | Normal | PQ daily × 7d ✅ · TQ eligible ✅ |
| 4.1–6.0 U/g Hb | Intermedio | PQ daily × 7d ✅ · TQ ❌ |
| ≤ 4.0 U/g Hb | Deficiente | PQ weekly supervised ✅ · TQ ❌ |
| Not tested | — | Default to PQ daily + close AHA monitoring |

---

## 8. TREATMENT LOGIC — ALL PARASITES

### P. vivax (non-pregnant, non-lactating)

**G6PD not available:**
- Card 1: CQ + PQ daily (default) — close AHA monitoring warning
- Card 2: CQ-resistant (AS+MQ + PQ daily)

**G6PD Normal (≥6.1) + TQ not available:**
- Card 1: CQ + PQ daily
- Card 2: CQ-resistant (AS+MQ + PQ daily)

**G6PD Normal (≥6.1) + TQ available (toggle ON):**
- Card 1: CQ + TQ (1st line)
- Card 2: CQ + PQ daily (alternative)
- Card 3: CQ-resistant (AS+MQ + PQ daily)

**G6PD Intermediate (4.1–6.0):**
- Card 1: CQ + PQ daily
- Card 2: CQ-resistant (AS+MQ + PQ daily)
- TQ toggle hidden

**G6PD Deficient (≤4.0):**
- Card 1: CQ + PQ weekly supervised
- Card 2: CQ-resistant (AS+MQ + PQ weekly)
- TQ toggle hidden

### P. vivax — PREGNANT
- Card 1: CQ weekly until delivery (NO primaquine)
  - 🚫 Red warning: "Primaquina CONTRAINDICADA durante la gestación"
- Card 2: PQ postpartum (1 month after delivery)
  - 🔬 Blue advisory: "Verificar G6PD antes de iniciar primaquina postparto"
  - If lactating: ⚠️ amber note about first month restriction
- TQ toggle hidden for all pregnant patients
- G6PD row shows: "No realizada — evaluar postparto previo a iniciar cura radical"

### P. falciparum (all non-pregnant)
- No G6PD needed
- Card 1: AS+MQ + PQ single dose (0.25mg/kg)
  - ⚠️ Clinical note: if mental status altered, do NOT use MQ → use AL instead
- Card 2: AL + PQ single dose
- Card 3: Quinine + Clindamycin + PQ (only if resistance + no ACT available)

### P. malariae
- Single card only (no swipe)
- CQ × 3 days + PQ single dose (0.25mg/kg)
- ℹ️ Note: G6PD not needed; PQ 0.25mg/kg safe even if G6PD deficient

### P. ovale (non-pregnant)
- Same structure as P. vivax but NO tafenoquine
- 🚩 Blue flag note on each card: pending MoH confirmation on G6PD requirement

### Mixed PfPv (non-pregnant)
- 🚫 Red note: TQ never for PfPv (cannot combine with ACT)
- G6PD Normal/not tested:
  - Card 1: AS+MQ + PQ daily × 7d
  - Card 2: AS+MQ + PQ weekly (for deficient)
- G6PD Deficient:
  - Card 1: AS+MQ + PQ weekly supervised
- No TQ toggle

### Children <6 months OR <5kg — ALL SPECIES
- Immediate referral screen regardless of parasite
- ACS: shows reference HF name + 📞 call button
- HCP: referral message + NTS guidance

---

## 9. TAFENOQUINE DOSING

| Weight | Age | Formulation | Dose | Tablets |
|--------|-----|-------------|------|---------|
| >10 to ≤20 kg | >2 years | pTQ 50mg dispersible | 100mg | 2 yellow |
| >20 to ≤35 kg | >2 years | pTQ 50mg dispersible | 200mg | 4 yellow |
| ≥35 kg | Adolescent/adult | aTQ 150mg | 300mg | 2 pink |
| ≤10 kg | — | ❌ Not eligible | — | — |

### TQ eligibility rules
- ONLY for P. vivax
- NEVER for PfPv, Pf, Pm, Po
- NEVER for pregnant or lactating patients
- ONLY if G6PD Normal (≥6.1 U/g Hb)
- ONLY if TQ pills available at the HF (toggle)
- NEVER for children <2 years

### TQ Consideraciones (drug interactions)
Opens via ⚠️ button when TQ selected:
Avoid: doxorubicina, nitrofurantoína, furazolidona, fenazopiridina, azul de metileno, ácido nalidíxico, sulfametoxazol, dapsona, acetanilida

---

## 10. P. VIVAX WEIGHT-BAND DOSING TABLE (NTG Table 5)

CQ = Cloroquina 150mg base tabs | PQ = Primaquina 15mg tabs

| Weight (kg) | CQ D1 | CQ D2 | CQ D3 | PQ D1–D7 |
|-------------|-------|-------|-------|-----------|
| 6–9 | ½ | ½ | ¼ | ¼ |
| 10–13 | ¾ | ¾ | ½ | ½ |
| 14–19 | 1 | 1 | ½ | ½ |
| 20–24 | 1½ | 1½ | ¾ | ¾ |
| 25–29 | 1½ | 1½ | ¾ | 1 |
| 30–34 | 2 | 2 | 1 | 1 |
| 35–39 | 2½ | 2½ | 1¼ | 1 |
| 40–44 | 2½ | 2½ | 1¼ | 1¼ |
| 45–49 | 3 | 3 | 1½ | 1½ |
| 50–54 | 3½ | 3½ | 1¾ | 1¾ |
| 55–59 | 3½ | 3½ | 1¾ | 1¾ |
| 60–64 | 4 | 4 | 2 | 2 |
| 65–69 | 4 | 4 | 2 | 2 |
| 70–74 | 4 | 4 | 2 | 2¼ |
| 75–79 | 4 | 4 | 2 | 2½ |
| 80–84 | 4 | 4 | 2 | 2¾ |
| 85–89 | 4 | 4 | 2 | 2¾ |
| 90–94 | 4 | 4 | 2 | 3 |
| 95–99 | 4 | 4 | 2 | 3 |
| 100–104 | 4 | 4 | 2 | 3¼ |
| 105–109 | 4 | 4 | 2 | 3½ |
| 110–114 | 4 | 4 | 2 | 3¾ |
| 115–120 | 4 | 4 | 2 | 3¾ |

Note: CQ D1 = D2 always. PQ dose same D1 through D7.
Note: For >120kg → medical board required per NTG.

---

## 11. P. FALCIPARUM DOSING

### Option 1: AS+MQ (Table 7–8)
Fixed dose by weight (Tab 25+50mg children / Tab 100+200mg adults):
- >5–9kg: 25+50mg (1 tab x 25+50)
- 10–18kg: 50+100mg (2 tab x 25+50)
- 19–29kg: 100+200mg (1 tab x 100+200)
- 30–49kg: 200+400mg (2 tab x 100+200)
- 50–69kg: 200+400mg (2 tab x 100+200)
- 70–89kg: 200+400mg (2 tab x 100+200)
- 90–120kg: 200+400mg (2 tab x 100+200)
PQ: 0.25mg/kg single dose D1 (safe even if G6PD deficient)

### Option 2: AL (Table 9–10)
Fixed dose by weight (Tab 20+120mg), twice daily × 3 days:
- >5–15kg: 20+120mg (1 tab)
- 15–25kg: 40+240mg (2 tabs)
- 25–35kg: 60+360mg (3 tabs)
- >35kg: 80+480mg (4 tabs)
PQ: 0.25mg/kg single dose D1

### Option 3: Quinine + Clindamycin (Table 11)
- Only if resistance confirmed + no ACT available
- Quinine sulfate 10mg salt/kg × 3 times/day × 7 days
- Clindamycin 10mg/kg × 2 times/day × 7 days
- PQ: 0.25mg/kg single dose D1

---

## 12. TREATMENT CARD DISPLAY RULES

### HCP treatment cards show:
- mg/kg dose
- Total daily dose in mg (calculated from weight entered)
- Day dots (color-coded)
- NTS table reference
- "🔢 Ver número de tabletas" → tap to reveal pill count
  - Reveals: "X tabletas/día · Tab. 15mg · Verifique presentación disponible en su IPRESS"

### ACS treatment cards show:
- Pill count only (from weight-band table)
- Day dots (color-coded)
- NO mg/kg, NO NTS references

### Day dot colors:
- 🔴 Red: Cloroquina
- 🔵 Blue: Primaquina diaria
- 🟡 Amber: Primaquina semanal
- 🟢 Green: Tafenoquina
- 🩷 Dark pink/mauve: Artesunato combinations

### Swipeable treatment lines:
- Each card shows: line badge (1ra/2da/3ra Línea) + title + clinical context subtitle
- Swipe dots at bottom indicate position
- Cards reorganize when TQ toggle changes

### "Treatment administered" tick (mandatory before closing):
- Each card has a tick box: "Marcar como tratamiento administrado"
- User CANNOT close encounter without ticking one line
- Records: recommended (first card shown) vs administered (ticked)

### AHA monitoring warning:
- Shows 🔴 on all PQ and TQ drug rows (distinct from ⚠️ TQ Consideraciones button)

---

## 13. FOLLOW-UP VISIT STRUCTURE

### Visit types:
1. Visita Inicial (D1)
2. Visita de Seguimiento N (any post-D1, repeatable, auto-incremented)
3. Visita de Verificación Final (discharge check — any day, flagged as final)

### Visita de Seguimiento content (TBD — pending study team):
Likely fields:
- General clinical status: Mejor / Igual / Peor
- Treatment adherence: ¿Tomó todos los medicamentos? Sí/No → reason if No
- AHA signs checklist (icon-based for ACS)
- Referral triggered if AHA or worsening

### Visita de Verificación Final:
- Parasite clearance test (Sí/No + reason/result)
- Hb (optional) + instrument
- AHA checklist
- Episode status:
  - En seguimiento
  - Alta completada → discharge
  - Perdido o no retornó/murió

### Episode status drives dashboard bar color:
- Light blue: En seguimiento (active)
- Solid blue: Alta completada (discharged)
- Gray: Perdido o no retornó/murió

---

## 14. REFERRAL LOGIC

### Triggers:
- Any severity sign selected at initial visit
- Any AHA sign selected at follow-up
- Child <6 months or <5kg (any species)
- Parasite clearance POSITIVE at final visit

### Referral screen content:
- HCP: NTS guidance text + [📋 Ver NTS] button
- ACS: "Refiera al establecimiento de salud de inmediato" + HF name/address + [📞 Llamar al establecimiento de ser posible] button
- Call button always visible with note (no connectivity detection)

---

## 15. DATA ARCHITECTURE

### Encounter record (Initial Visit):
```
- DNI patient (8 digits)
- Date/time of entry
- User ID (IPRESS code for HCP / DNI for ACS)
- Visit type
- Parasite type
- Days since symptom onset
- Place of infection (dept/prov/district)
- G6PD performed (Y/N + reason if N)
- G6PD value (U/g Hb)
- Hb value (g/dL) [optional]
- Hb instrument used
- Weight (kg)
- Age + unit
- Sex
- Pregnant (Y/N)
- Lactating (Y/N)
- Severity signs (array)
- Treatment RECOMMENDED (card shown first)
- Treatment ADMINISTERED (card ticked — mandatory)
- Referral triggered (Y/N)
- GPS coordinates of encounter
- Sync status (pending/synced/error)
```

### Episode status (Final Visit):
```
- En seguimiento
- Alta completada
- Perdido o no retornó/murió
```

---

## 16. HF DASHBOARD (HCP Malaria Responsible)

### 4 metric cards (all tappable drill-downs):
1. **Encuentros totales** → ACS list with G6PD rate + encounter detail per patient
2. **Tasa G6PD realizado** → reason breakdown with % bars
3. **Referencias sugeridas** → list with disclaimer (suggested ≠ done)
4. **Sinc. pendientes** → list of unsynced records by ACS/HCP

### Bar chart: Encuentros por ACS
- Bar length = number of encounters
- Bar color by G6PD testing rate (green ≥80% / amber 50–79% / red <50%)
- Right label = G6PD value from INITIAL VISIT (not a %)
- Legend: Normal ≥6.1 / Intermedio 4.1–6.0 / Deficiente ≤4.0

### Estado de seguimiento table:
- Per patient: DNI, parasite, days since initial, ACS/HCP responsible
- Status badges: D7 vencido (red) / D7 próximo (amber) / Alta completada (green)

### Sync indicator (ACS device):
- 🟢 Todo sincronizado
- 🟡 N registros pendientes de sincronización
- 🔴 Error de sincronización

---

## 17. ACS REGISTRATION FLOW (3 steps)

1. **Step 1:** IPRESS code (entered by HF malaria responsible) + ACS personal data (DNI, name, phone)
2. **Step 2:** Community name + district + province + GPS auto-capture (offline capable)
3. **Step 3:** Credential summary (DNI = username, IPRESS = password) + HF responsible confirmation

---

## 18. ALL MoH/CDC-PERU FLAGS (13 total)

| # | Flag | For |
|---|------|-----|
| 1 | G6PD testing requirement for P. ovale — NTG Table 2(b) doesn't mention it explicitly but dose is equivalent to Pv radical cure | MoH |
| 2 | G6PD testing timing for pregnant Pv/Pv — initial visit or only postpartum before primaquine? Applies to both HCP and ACS | MoH |
| 3 | Auto-flagging criteria for "Perdido o no retornó" — temporal threshold + manual marking? | MoH |
| 4 | Hb retest at follow-up visits — PAVE-Peru practice (for Hb drop calculation) vs NTG. What instrument? (HemoCue at HF vs G6PD analyzer). Does not apply to ACS | MoH |
| 5 | Geographic coding system — UBIGEO INEI, internal CDC-Perú code, or other? Confirm with GERESA Loreto | CDC-Perú / GERESA Loreto |
| 6 | Data export format — CSV, API, DHIS2-compatible, NOTI integration to avoid double entry? | CDC-Perú |
| 7 | Visita de Seguimiento content — exact fields for HCP vs ACS | Study team |
| 8 | Final verification test for ACS — PDR valid for parasitemia clearance or only microscopy (HF only)? | MoH |
| 9 | Dispersible pediatric primaquine (MMV/FOSUN, 2.5mg+5mg tabs) — when available in Peru? 7 vs 14 day course? Double daily dose to shorten to 7 days as in adults? | MoH |
| 10 | Weight-band dosing tables for Pf (AS+MQ, AL) and PfPv — equivalent to Table 5 for Pv | MoH/CDC-Perú |
| 11 | Should HCP interface include optional "🔢 Ver número de tabletas" pop-up? All IPRESS have same CQ/PQ formulations? | MoH |
| 12 | Other Hb measurement methods beyond SD Biosensor and HemoCue to list in app? | MoH |
| 13 | **HCP dashboard — ACS encounter visibility:** Should the HCP (malaria responsible at the HF) be able to see the encounters logged by their assigned ACS providers — i.e., a swipeable second view "Encuentros por ACS" within the Encuentros section showing each ACS's patient bars alongside the HCP's own "Encuentros del mes"? ACS dashboard would always show only its own encounters. | MoH / CDC-Perú |

---

## 19. ACTION ITEMS (non-MoH)

- [ ] Request PAVE-Peru vector files (SVG/AI) for AHA icons: Falta de aire, Fatiga, Mareo
- [ ] Confirm preferred term: ACS (Agente Comunitario de Salud) — final abbreviation
- [ ] DNI digit limit: 8 digits (current) — confirm if increased to 9-10
- [ ] Confirm with CDC-Perú: UBIGEO coding for geographic dropdowns

---

## 20. BUILD PRIORITIES FOR CLAUDE CODE

### Phase 1 — Authentication ✅ (designed)
- Landing screen with user type selection
- HF login (IPRESS + password)
- ACS login (DNI + IPRESS)
- Language placeholder row

### Phase 2 — Intake Form ✅ (designed)
- HCP accordion form (5 sections, visit-type-aware)
- ACS accordion form (same structure, plain language, larger UI)

### Phase 3 — Treatment Output (build next)
- P. vivax: all G6PD pathways, TQ toggle, pregnant pathway
- P. falciparum: 3 options, AS+MQ clinical note
- P. malariae: single card
- P. ovale: same as Pv, no TQ
- Mixed PfPv: AS+MQ + PQ, G6PD guided
- Children <6m/<5kg: referral screen
- Weight-band pill counts for ACS
- mg/kg + tap-to-reveal for HCP
- Treatment administered mandatory tick

### Phase 4 — Follow-up & Final Visit Output (TBD)
- Seguimiento management screen
- Verificación Final → discharge vs continue management
- Episode status update

### Phase 5 — Dashboard & Data
- HF malaria responsible dashboard
- ACS encounter list
- Sync indicator
- Data export

---

## 21. REFERENCE FILES

The following HTML prototypes were built in Claude.ai and should be used as visual/logic reference:
- `malaria-signin.html` — Login screens
- `malaria-intake-v2.html` — HCP intake accordion
- `malaria-intake-acs.html` — ACS intake accordion
- `malaria-app-peru.html` — Treatment output (P. vivax complete)
- `malaria-guia-peru-full.html` — Partial end-to-end prototype

---

*Document prepared May 2026 · MalariaGuía Perú · CDC-Perú / MINSA / PAVE-Peru*
