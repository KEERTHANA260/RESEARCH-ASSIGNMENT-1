# Registration Lookup Lab

Design and Analysis of Algorithms, Assignment 1: an efficient search strategy for a large-scale student record system.

An interactive web page that searches student registration numbers with three algorithms side by side, on databases of 1,000 to 1,000,000 records. It runs entirely in the browser, with no build step and no dependencies.

## The three algorithms

| Algorithm | Design strategy | Style | Preprocessing | Search cost |
| --- | --- | --- | --- | --- |
| Linear search | Brute force | Iterative | None | Θ(n) |
| Binary search | Decrease and conquer | Recursive | Merge sort, Θ(n log n) | Θ(log n) |
| Hash table with chaining | Transform and conquer | Iterative | Build table, Θ(n) | Θ(1) expected |

The basic operation counted in every algorithm is a key comparison. Binary search follows the recurrence `T(n) = T(⌊n/2⌋) + 1`, `T(0) = 0`, which solves to `⌊log₂ n⌋ + 1`.

## What the page does

- **Lookup:** search one registration number with all three algorithms and compare comparisons made, time per search and preprocessing cost. Includes a step-by-step trace of the binary search and one-click best and worst cases.
- **Benchmark:** measures all three algorithms at 1,000, 10,000, 100,000 and 1,000,000 records, draws log-scale charts of time and comparisons against the predicted values, and checks every result against the stored data.
- **Day-4 load:** the scenario with 50,000 searches per hour on 1,000,000 records and one update a day. Shows processor time per hour, burst headroom, the daily merge cost against a full re-sort, and a recommendation.
- **Theory check:** compares observed comparison counts with the derived formulas.

## Run it

Open `index.html` in a browser. To serve it locally instead:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Publish with GitHub Pages

1. Push this folder to a GitHub repository.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then save.
4. The site appears at `https://<your-username>.github.io/<repository-name>/` after a minute or so.

## Python benchmark

`python/benchmark.py` is the Python version of the same experiment, used to produce the numbers in the written report. It needs Python 3 and nothing else.

```bash
cd python
python3 benchmark.py
```

It prints one JSON line per database size and writes `results.json`.

## Files

```
index.html           page structure
style.css            styles, light and dark themes
script.js            algorithms, measurement and page behaviour
python/benchmark.py  Python implementation and experiment
```

## Notes

- Timings depend on the device and browser. The growth rates and the ranking of the algorithms stay the same.
- Student names and grades shown in the lookup are generated from the registration number for demonstration.
- Fonts (IBM Plex) load from Google Fonts, and the page falls back to system fonts if they are unavailable.
