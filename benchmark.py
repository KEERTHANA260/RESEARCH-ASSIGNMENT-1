"""Python benchmark for the DAA Assignment 1 report.

Compares linear search, recursive binary search (after merge sort) and a chained
hash table on 1,000 to 1,000,000 unique registration numbers.
Run: python3 benchmark.py   (takes about a minute; writes results.json)
"""
import random, time, json, sys

sys.setrecursionlimit(10000)

# ---------- Approach A: linear search ----------
def linear(R, k):
    for i in range(len(R)):
        if R[i] == k:
            return i
    return -1

def linear_cnt(R, k):
    c = 0
    for i in range(len(R)):
        c += 1
        if R[i] == k:
            return i, c
    return -1, c

# ---------- Approach B: merge sort + recursive binary search ----------
def merge_sort(A):
    """bottom-up merge sort; returns sorted list and comparison count"""
    n = len(A)
    src = A[:]
    dst = [0] * n
    cmp = 0
    width = 1
    while width < n:
        for lo in range(0, n, 2 * width):
            mid = min(lo + width, n)
            hi = min(lo + 2 * width, n)
            i, j, k = lo, mid, lo
            while i < mid and j < hi:
                cmp += 1
                if src[i] <= src[j]:
                    dst[k] = src[i]; i += 1
                else:
                    dst[k] = src[j]; j += 1
                k += 1
            while i < mid:
                dst[k] = src[i]; i += 1; k += 1
            while j < hi:
                dst[k] = src[j]; j += 1; k += 1
        src, dst = dst, src
        width *= 2
    return src, cmp

def bsearch(R, lo, hi, k):
    if lo > hi:
        return -1
    mid = (lo + hi) // 2
    if k == R[mid]:
        return mid
    elif k < R[mid]:
        return bsearch(R, lo, mid - 1, k)
    else:
        return bsearch(R, mid + 1, hi, k)

def bsearch_cnt(R, lo, hi, k, c=0):
    if lo > hi:
        return -1, c
    mid = (lo + hi) // 2
    c += 1
    if k == R[mid]:
        return mid, c
    elif k < R[mid]:
        return bsearch_cnt(R, lo, mid - 1, k, c)
    else:
        return bsearch_cnt(R, mid + 1, hi, k, c)

# ---------- Approach C: hash table with separate chaining ----------
def is_prime(x):
    if x < 2: return False
    if x % 2 == 0: return x == 2
    i = 3
    while i * i <= x:
        if x % i == 0: return False
        i += 2
    return True

def next_prime(x):
    while not is_prime(x):
        x += 1
    return x

def build_table(R):
    m = next_prime(len(R))
    T = [None] * m
    for key in R:
        j = key % m
        T[j] = (key, T[j])      # head insertion: node = (key, next)
    return T, m

def hsearch(T, m, k):
    p = T[k % m]
    while p is not None:
        if p[0] == k:
            return p
        p = p[1]
    return -1

def hsearch_cnt(T, m, k):
    p = T[k % m]
    c = 0
    while p is not None:
        c += 1
        if p[0] == k:
            return p, c
        p = p[1]
    return -1, c

def chain_stats(T):
    mx = 0; nonempty = 0
    for p in T:
        L = 0
        while p is not None:
            L += 1; p = p[1]
        if L: nonempty += 1
        if L > mx: mx = L
    return mx, nonempty

# ---------- experiment driver ----------
SIZES = [1000, 10000, 100000, 1000000]
QLIN = {1000: 2000, 10000: 1000, 100000: 200, 1000000: 50}
QFAST = 20000
LO, HI = 10**9, 10**10

def tm(f, reps=1):
    best = None
    for _ in range(reps):
        t = time.perf_counter(); f(); d = time.perf_counter() - t
        if best is None or d < best: best = d
    return best

out = []
for n in SIZES:
    rnd = random.Random(2026 + n)
    data = rnd.sample(range(LO, HI), n)          # unsorted unique registration numbers
    present = set(data)
    # query workload: 50% hits (random existing keys), 50% misses (random absent keys)
    qs = []
    for i in range(QFAST):
        if i % 2 == 0:
            qs.append(data[rnd.randrange(n)])
        else:
            while True:
                x = rnd.randrange(LO, HI)
                if x not in present: break
            qs.append(x)
    qlin = qs[:QLIN[n]]

    row = {"n": n}

    # preprocessing
    row["sort_time"] = tm(lambda: merge_sort(data), 1)
    sdata, sort_cmp = merge_sort(data)
    row["sort_cmp"] = sort_cmp
    assert sdata == sorted(data)
    row["build_time"] = tm(lambda: build_table(data), 1)
    T, m = build_table(data)
    mx, nonempty = chain_stats(T)
    row["m"] = m; row["alpha"] = n / m; row["max_chain"] = mx; row["nonempty_buckets"] = nonempty

    # correctness check on the common workload
    for q in qs[:2000]:
        e = (q in present)
        assert (linear(data, q) != -1) == e
        assert (bsearch(sdata, 0, n - 1, q) != -1) == e
        assert (hsearch(T, m, q) != -1) == e

    # timings (per query, averaged over workload)
    t_lin = tm(lambda: [linear(data, q) for q in qlin], 1)
    row["lin_q"] = len(qlin); row["lin_time_per_query"] = t_lin / len(qlin)
    t_bin = tm(lambda: [bsearch(sdata, 0, n - 1, q) for q in qs], 3)
    row["bin_q"] = QFAST; row["bin_time_per_query"] = t_bin / QFAST
    t_hash = tm(lambda: [hsearch(T, m, q) for q in qs], 3)
    row["hash_time_per_query"] = t_hash / QFAST

    # comparison counts, split into hits / misses
    def avg(fn, qlist):
        h = []; ms = []
        for q in qlist:
            r, c = fn(q)
            (h if q in present else ms).append(c)
        return sum(h) / len(h), sum(ms) / len(ms), max(h + ms)
    row["lin_cmp_hit"], row["lin_cmp_miss"], row["lin_cmp_max"] = avg(lambda q: linear_cnt(data, q), qlin)
    row["bin_cmp_hit"], row["bin_cmp_miss"], row["bin_cmp_max"] = avg(lambda q: bsearch_cnt(sdata, 0, n - 1, q), qs)
    row["hash_cmp_hit"], row["hash_cmp_miss"], row["hash_cmp_max"] = avg(lambda q: hsearch_cnt(T, m, q), qs)

    # best / worst case checks
    first, last = data[0], data[-1]
    absent = qs[1]
    row["lin_cmp_best"] = linear_cnt(data, first)[1]
    row["lin_cmp_worst_last"] = linear_cnt(data, last)[1]
    row["lin_cmp_worst_absent"] = linear_cnt(data, absent)[1]
    row["bin_cmp_best"] = bsearch_cnt(sdata, 0, n - 1, sdata[(n - 1) // 2])[1]
    row["bin_cmp_worst_absent"] = bsearch_cnt(sdata, 0, n - 1, LO - 1)[1]
    row["lin_time_worst_absent"] = tm(lambda: linear(data, absent), 3)
    print(json.dumps(row), flush=True)
    out.append(row)

json.dump(out, open("results.json", "w"), indent=1)
print("DONE")
