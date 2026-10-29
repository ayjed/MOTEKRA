import json

b = json.load(open('docs/evidence/phase-52/baseline_audit.json', encoding='utf-8'))['performance_baselines']
o = json.load(open('docs/evidence/phase-52/optimization_results.json', encoding='utf-8'))['performance_optimized']

print("=== DESKTOP (1440px) ===")
print(f"{'Route':<20} | {'Baseline LCP':<12} | {'Opt LCP':<10} | {'Delta':<10} | {'Baseline Load':<13} | {'Opt Load':<10} | {'CLS'}")
print("-" * 85)
for k in b['desktop']:
    b_lcp = b['desktop'][k]['lcp']
    o_lcp = o['desktop'][k]['lcp']
    delta = o_lcp - b_lcp
    b_load = b['desktop'][k]['loadTime']
    o_load = o['desktop'][k]['loadTime']
    cls_val = o['desktop'][k]['cls']
    print(f"{k:<20} | {b_lcp:<12} | {o_lcp:<10} | {delta:<+10} | {b_load:<13} | {o_load:<10} | {cls_val}")

print("\n=== MOBILE (390px) ===")
print(f"{'Route':<20} | {'Baseline LCP':<12} | {'Opt LCP':<10} | {'Delta':<10} | {'Baseline Load':<13} | {'Opt Load':<10} | {'CLS'}")
print("-" * 85)
for k in b['mobile']:
    b_lcp = b['mobile'][k]['lcp']
    o_lcp = o['mobile'][k]['lcp']
    delta = o_lcp - b_lcp
    b_load = b['mobile'][k]['loadTime']
    o_load = o['mobile'][k]['loadTime']
    cls_val = o['mobile'][k]['cls']
    print(f"{k:<20} | {b_lcp:<12} | {o_lcp:<10} | {delta:<+10} | {b_load:<13} | {o_load:<10} | {cls_val}")
