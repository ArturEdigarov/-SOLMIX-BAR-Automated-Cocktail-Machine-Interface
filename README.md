# 🍹 SOLMIX BAR — Automated Cocktail Machine Interface

An intuitive, dark-themed, responsive web interface built with **React**, **Tailwind CSS**, and **shadcn/ui** to control a hardware automated cocktail mixer (via a Python backend). 

The application allows users to precise-dose components using interactive sliders, tracks total fluid and alcohol volume limits in real-time, and generates a dynamic hardware-scannable barcode containing the recipe configuration.

---

## 🚀 Key Features

* **Smart Volume Restrictions (The "Invisible Wall"):** 
  * Real-time constraint calculation. Sliders physically lock once total limits are reached.
  * Maximum total drink capacity: **200 ml**.
  * Maximum cumulative alcohol capacity: **50 ml** (automatically detects `isAlcohol` pump flags).
* **Dynamic Neon Dark UI:** Designed with a sleek, dark-mode aesthetic utilizing rich slate tones, glow effects, and modern progress bars representing cup fulfillment.
* **On-the-Fly Barcode Generation:** Encodes the 9-pump configuration array into a clean `CODE128` barcode via `react-barcode` for instantaneous USB-scanner interpretation.
* **German Localization:** UI tailored natively for European deployments (*"Cocktail mixen"*, *"Füllstand des Glases"*).
* **One-Click Reset:** Instantly clears all pump values back to zero.

---

## 🛠️ Tech Stack

* **Frontend:** React 18, Vite
* **Styling:** Tailwind CSS
* **UI Components:** Radix UI / shadcn/ui (Slider, Dialog, Button)
* **Icons:** Lucide React
* **Barcode Engine:** `react-barcode` (CODE128 standard)

---

## 📐 The Communication Protocol (How it works with Python)

When the user configures a recipe and clicks **"COCKTAIL MIXEN"**, the UI aggregates the 9 pump values into a space-separated string (e.g., `40 5 5 34 46 55 5 5 5`) and presents a high-contrast barcode modal.

Any standard USB barcode scanner connected to the Raspberry Pi / Controller acts as a keyboard input. It scans the screen, types the string directly into the Python controller script, and executes an `Enter` command.

**Python Processing Example:**
```python
# Raw input intercepted from the barcode scanner
barcode_input = "40 5 5 34 46 55 5 5 5"

# Instant conversion into milliliters for the 9 relays/pumps
pumps_ml = [int(x) for x in barcode_input.split()]

print(pumps_ml) 
# Output: [40, 5, 5, 34, 46, 55, 5, 5, 5] -> Ready to pump!
